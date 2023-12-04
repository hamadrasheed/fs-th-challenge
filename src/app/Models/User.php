<?php

namespace App\Models;

use App\Helpers\ArrayHelper;
use App\Helpers\EnvHelper;
use App\Traits\HookTrait;
use App\Traits\RequestTrait;
use App\Notifications\ResetPasswordNotification;
use App\Notifications\VerifyEmailNotification;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable, RequestTrait, HookTrait;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'm_users';
    protected $primaryKey = 'id';

    protected $redirectTo = "http://innoscripta.com/";

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'role_code',
        'password',
        'is_active',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public static function requestDefault($isUpdate = false)
    {
        $request = [
            'name' => ['required', 'string', 'min:3', 'max:255'],
            'password' => [$isUpdate ? 'nullable' : 'required', 'string', 'min:8', 'max:60', 'confirmed'],
            'is_active' => ['boolean'],
            'role_code' => ['required', 'string', 'exists:m_user_roles,code'],
        ];

        if (!$isUpdate)
            $request = [
                ...$request, 'username' => [
                    'required', 'string', 'min:3', 'max:30',
                    'unique:m_users,username'
                ],
                'email' => [
                    'required', 'string', 'email', 'max:255',
                    'unique:m_users,email'
                ]
            ];

        return $request;
    }

    public static function requestUpdate()
    {
        return [
            'password' => ['required', 'string', 'current_password'],
            'new_password' => ['required', 'string', 'min:8', 'max:60'],
            'password_confirmation' => ['required', 'same:new_password'],
        ];
    }

    /**
     * dataReferenceIds
     *
     * @param  array<string,array<string>> $changeColumn
     * @return array
     */
    public static function dataReferenceIds($changeColumn = [
        'except' => [],
        'only' => [],
        'update' => []
    ])
    {
        $onlyTrashed = request('show_trash_data');

        $optionDefault = [
            EnvHelper::get('CREATED_USER_DB'),
            EnvHelper::get('UPDATED_USER_DB'),
            EnvHelper::get('CANCELLED_USER_DB'),
        ];

        if ($onlyTrashed)
            $optionDefault[] = EnvHelper::get('DELETED_USER_DB');

        // update column
        $array = new ArrayHelper();
        $finalopts = $array->arrayChangerByKey($optionDefault, $changeColumn);

        return $finalopts;
    }


    public function scopeSetAlias($query)
    {
        return $query->from('m_users as u');
    }

    /**
     * scopeSelectByIds
     *
     * @param  User $query
     * @param  array|Model $data
     * @param  array $columns
     */
    public function scopeSelectByIds($query, $data, $paginate = true, $columns = [])
    {
        // if column default
        if (!count($columns))
            $columns = User::dataReferenceIds();

        // parse to collection
        if (gettype($data) == 'array')
            $data = collect($data);
        elseif ($paginate)
            $data = collect($data->toArray()['data']);
        else
            $data = collect($data->toArray());



        $dataIds = $data->reduce(function ($prevData, $item) use ($columns) {
            $newIds = [];
            $item = is_array($item) ? $item : collect($item)->toArray();

            foreach ($columns as $cl) {
                $dt = isset($item[$cl]) ? $item[$cl] : null;


                if ($dt && !in_array($dt, $prevData) && !in_array($dt, $newIds))
                    $newIds[] = $dt;
            }

            return [...$prevData, ...$newIds];
        }, []);

        $query->setAlias()
            // ->setSoftDeletedWithAlias()
            ->whereIn('u.id', $dataIds)
            ->userInformationRelation()
            ->select(
                'u.id',
                'u.name',
                UserInformation::photoDefaultColumn()
            );
    }

    public function scopeExceptRoot($query)
    {
        $isRoot = request()->user()->tokenCan(EnvHelper::get('ROOT_ABILITY'));

        return $query->when(!$isRoot, fn ($q) => $q->whereNotIn('role_code', [UserRole::$ROOT]));
    }


    public function scopeWhereId($query, $id)
    {
        return $query->where('u.id', $id);
    }

    public function scopeWhereActive($query, $is_active = true)
    {
        return $query->where('u.is_active', $is_active);
    }

    public function scopeWhereUser($query)
    {
        return $query
            ->join('m_user_roles as ur', 'ur.code', 'u.role_code')
            ->whereIn('ur.code', [UserRole::$USER]);
    }

    public function scopeWhereNews($query)
    {
        return $query
            ->join('m_user_roles as ur', 'ur.code', 'u.role_code')
            ->whereIn('ur.code', [
                UserRole::$ROOT,
                UserRole::$USER,
            ]);
    }

    public function scopeUserInformationRelation($query, $useAlias = true)
    {
        $alias = $useAlias ? 'u' : 'm_users';
        return $query->leftJoin('m_user_information as ui', "$alias.id", 'ui.user_id');
    }

    public function scopeUserRoleRelation($query)
    {
        return $query->join('m_user_roles as ur', 'ur.code', 'u.role_code');
    }

    public function getUserInformation()
    {
        return $this->hasOne(UserInformation::class, 'user_id');
    }

    public function getUserNewsPreferences()
    {
        return $this->hasOne(UserNewsPreferences::class, 'user_id');
    }

    public function role()
    {
        return $this->hasOne(UserRole::class, 'code', 'role_code')->select('code', 'name');
    }

    public function getUserRole()
    {
        return $this->belongsTo(UserRole::class, 'role_code');
    }

    /**
     * Send a password reset notification to the user.
     *
     * @param  string  $token
     * @return void
     */
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPasswordNotification($token));
    }

    /**
     * Send the email verification notification.
     *
     * @return void
     */
    public function sendEmailVerificationNotification()
    {
        $this->notify(new VerifyEmailNotification());
    }
}
