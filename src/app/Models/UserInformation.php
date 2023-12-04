<?php

namespace App\Models;

use App\Models\config\NhModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;

class UserInformation extends NhModel
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'm_user_information';
    protected $primaryKey = 'id';

    protected $fillable = [
        'user_id',
        'photo',
        'phone',
        'gender',
        'birthdate',
        'address',
    ];

    //gender
    public static $genderMale = 'male';
    public static $genderFemale = 'female';

    //photo path location
    public static $photoSavePath = 'public/user-photo/';
    public static $photoGetPath = '/storage/user-photo/';

    public static function requestDefault()
    {
        return [
            "user_id" => ['required', 'exists:users,id'],
            "photo" => ['nullable', 'image', 'max:10000'],
            "phone" => ['required', 'string', 'min:3', 'max:22'],
            "gender" => ['required'],
            "birthdate" => ['required', 'date_format:Y-m-d'],
            "address" => ['nullable', 'string', 'max:250'],
        ];
    }

    public static function requestUpdate(): array
    {
        $data = UserInformation::requestDefault();
        $data['user_id'] = ['nullable', 'exists:users,id'];
        return $data;
    }

    public static function genderList()
    {
        return [
            UserInformation::$genderMale,
            UserInformation::$genderFemale,
        ];
    }

    public static function photoMockList()
    {
        return [
            asset('/images/mock/avatar/1.png'),
            asset('/images/mock/avatar/2.png'),
            asset('/images/mock/avatar/3.png'),
            asset('/images/mock/avatar/4.png'),
            asset('/images/mock/avatar/5.png'),
        ];
    }

    public static function photoDefaultColumn()
    {
        $photo = UserInformation::photoMockList();
        $photo = asset($photo[rand(0, 1)]);

        return DB::raw("if( ui.photo is null, '$photo', concat('" . url('') . "', ui.photo) ) as photo");
    }

    public function scopeListBirthDate($query)
    {
        $day = now()->format('d');
        $month = now()->format('m');
         $query->setAlias()
            ->select(
                'user_id',
                'u.name',
                DB::raw("FLOOR(DATEDIFF(NOW(), birthdate)/365) as age"),
            )
            ->userRelation()
            ->whereRaw('DAY(birthdate) =' . $day)
            ->whereRaw('MONTH (birthdate) =' . $month);
    }

    public function getUser()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
