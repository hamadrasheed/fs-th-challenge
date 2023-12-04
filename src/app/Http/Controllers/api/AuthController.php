<?php

namespace App\Http\Controllers\api;

use App\Helpers\ArrayHelper;
use App\Helpers\EnvHelper;
use App\Helpers\ImageHelper;
use App\Helpers\StringHelper;
use App\Http\Controllers\Controller;
use App\Models\NewsAuthor;
use App\Models\NewsCategory;
use App\Models\NewsSource;
use App\Models\User;
use App\Models\UserInformation;
use App\Models\UserNewsPreferences;
use App\Models\UserRole;
use App\Traits\apiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    use apiResponseTrait;

    private $name, $nameUserInformation;

    public function __construct()
    {
        $this->name = __('vars.models.User');
        $this->nameUserInformation = __('vars.models.UserInformation');
    }

    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required',
                'password' => 'required',
            ]);

            $email = $request->email;
            $password = $request->password;

            $emailOrUserName = gettype($email) == 'string' && is_numeric(strpos($email, '@')) ? 'email' : 'username';
            $user = User::setAlias()
                ->select(DB::raw('distinct u.id as id'), 'password', 'email_verified_at', 'is_active', 'role_code')
                ->where($emailOrUserName, $email)
                ->whereActive(true)
                ->whereNews()
                ->first();

            if ($user && Hash::check($password, $user->password) && $user->email_verified_at && $user->is_active) {
                $ability = $this->checkAbility($user->role_code);
                if (empty($ability)) {
                    return $this->responseUnauthorized(null, 'ability');
                }

                return $this->makeResponse($user, $ability);
            }

            throw ValidationException::withMessages([
                'password' => $user && is_null($user->email_verified_at) ?
                    __('string.auth.confirm_email') : ($user && !$user->is_active ?
                        __('string.auth.inactive') :
                        __('string.auth.except_login', ['with' => $emailOrUserName]))
            ]);
        } catch (\Throwable $e) {
            return $this->responseconfirmedFailed($e, $this->name);
        }
    }

    public function register(Request $request)
    {
        try {
            $request->validate([
                'name' => ['required', 'string', 'min:3', 'max:255'],
                'username' => ['required', 'string', 'min:3', 'max:30', 'unique:m_users,username'],
                'email' => ['required', 'string', 'email', 'max:100', 'unique:m_users,email'],
                'password' => ['required', 'string', "min:8"],
                'password_confirmation' => ['required', 'same:password'],
            ]);

            $data = $request->only([
                'name',
                'username',
                'email',
                'password',
            ]);
            $data['is_active'] = true;
            $data['password'] = bcrypt($request->password);
            $data['role_code'] = UserRole::$USER;

            DB::beginTransaction();
            $userVar = User::create($data);
            $userVar->sendEmailVerificationNotification();
            DB::commit();

            return $this->responseCustomSuccess('Signed up! Please check your email to verify your account.');
        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->responseCreatedFailed($e, 'user');
        }
    }

    public function verify(Request $request, $id, $hash)
    {
        try {
            $request->request->add(['hash' => $hash]);
            if (!$request->hasValidSignature()) {
                return response()->json(["msg" => "Invalid/Expired url provided."], 401);
            }

            /**
             * @var mixed $user
             */
            $user = User::findOrFail($id);

            if ($user->hasVerifiedEmail()) {
                return [
                    'message' => 'Email already verified'
                ];
            }

            if ($user->markEmailAsVerified()) {
                event(new Verified($user));
                $user->update(['email_verified_at' => now()]);
            }

            return redirect()->to('/signin?verified=1');
        } catch (\Throwable $e) {
            return $this->responseconfirmedFailed($e, 'user');
        }
    }

    public function logout()
    {
        try {
            $user = request()->user();
            // @phpstan-ignore-next-line
            $user->tokens()->where('id', $user->currentAccessToken()->id)->delete();
            return $this->responseCustomSuccess(__('string.auth.logout_success'), null, Response::HTTP_ACCEPTED);
        } catch (\Throwable $e) {
            return $this->responseconfirmedFailed($e, $this->name);
        }
    }

    public function forgotPassword(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email'
            ]);

            $check = User::setAlias()
                ->whereNews()
                ->select('is_active', 'email_verified_at')
                ->where('u.email', $request->email)
                ->first();

            if (!$check)
                return throw ValidationException::withMessages([
                    'email' => __("string.auth.not_found")
                ]);


            if (!$check->is_active || !$check->email_verified_at)
                return throw ValidationException::withMessages([
                    'email' => __(!$check->is_active ? "string.auth.inactive" : "string.auth.confirm_email")
                ]);


            $status = Password::sendResetLink(
                $request->only(['email'])
            );

            if ($status === Password::RESET_LINK_SENT) {
                return $this->responseCustomSuccess(__($status), null, 202);
            }

            throw ValidationException::withMessages([
                'email' => __($status)
            ]);
        } catch (\Throwable $e) {
            return $this->responseconfirmedFailed($e, $this->name);
        }
    }

    public function resetPassword(Request $request)
    {
        try {
            $request->validate([
                'token' => 'required',
                'email' => 'required|email',
                'password' => 'required|min:8|confirmed',
            ]);

            $status = Password::reset(
                $request->only(['email', 'password', 'password_confirmation', 'token']),
                function ($user, $password) {
                    $user->forceFill([
                        'password' => Hash::make($password)
                    ])->setRememberToken(Str::random(60));

                    $user->save();

                    $user->tokens()->delete();

                    event(new PasswordReset($user));
                }
            );

            if ($status === Password::PASSWORD_RESET) {
                return $this->responseCustomSuccess(__($status), null, 202);
            }

            throw ValidationException::withMessages([
                'email' => __($status)
            ]);
        } catch (\Throwable $e) {
            return $this->responseconfirmedFailed($e, $this->name);
        }
    }

    public function check()
    {
        try {
            $user = request()->user();

            $ok = User::setAlias()
                ->whereActive(true)
                ->whereNews()
                ->whereId($user->id)
                ->select("u.id", 'u.email_verified_at', 'u.is_active', 'u.role_code')
                ->first();

            if ($ok && $ok->email_verified_at && $ok->is_active) {
                $ability = $this->checkAbility($ok->role_code);
                if (empty($ability)) {
                    return $this->responseUnauthorized(null, 'ability');
                }

                // @phpstan-ignore-next-line
                return $this->makeResponse($user, $ability, $user->currentAccessToken()->token);
            }

            return $ok ? $this->responseWaitingEmailConfirm() : $this->responseInactive();
        } catch (\Throwable $e) {
            return $this->responseconfirmedFailed($e, $this->name);
        }
    }

    private function checkAbility($role_code)
    {
        $ability = null;
        if ($role_code == UserRole::$ROOT) {
            $ability = [
                EnvHelper::get('ROOT_ABILITY'),
                EnvHelper::get('USER_ABILITY'),
            ];
        } else if ($role_code == UserRole::$USER) {
            $ability = [
                EnvHelper::get('USER_ABILITY'),
            ];
        }

        return $ability;
    }

    private function makeResponse(User $user, $ability, $token = null)
    {
        $helper = new ArrayHelper();

        $data = User::setAlias()
            ->userInformationRelation()
            ->userRoleRelation()
            ->whereId($user->id)
            ->select(
                'u.id',
                'u.name',
                UserInformation::photoDefaultColumn(),
                'ur.code as role_code',
                'ur.name as role_name',
            )
            ->get();

        if (!$token)
            $token = $user->createToken(str()->random(rand(15, 21)), $ability)->plainTextToken;

        // group role
        $data = $helper->groupArray($data, 'id', [
            'id', 'name', 'photo',
        ], [], [], 'roles')[0];

        $data['token'] = $token;
        $data['abilities'] = $ability;

        return $this->responseconfirmedSuccess($this->name, $data);
    }

    /**
     * Update password account user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function changePassword(Request $request)
    {
        try {
            // validate
            $data = $request->validate(User::requestUpdate());

            $user = request()->user();

            $data['password'] = bcrypt($request->new_password);

            $user->update([...$data]);

            return $this->responseCustomSuccess("Your password is successfully updated!");
        } catch (\Throwable $e) {
            return $this->responseCustomFailed($e, "Failed to update your password!");
        }
    }

    /**
     * Show personal data user.
     *
     * @return \Illuminate\Http\Response
     */
    public function editProfile()
    {
        try {
            $user = request()->user();
            // @phpstan-ignore-next-line
            $userInformation = $user->getUserInformation;

            if ($userInformation) {
                // @phpstan-ignore-next-line
                $result = collect($user->getUserInformation)->except([
                    'created_at',
                    'updated_at',
                ])->replace([
                    'name' => $user->name,
                    'email' => $user->email,
                ]);
            } else {
                $result = [
                    "name" => $user->name,
                    'email' => $user->email,
                    "user_id" => $user->id,
                    "photo" => null,
                    "phone" => null,
                    "gender" => null,
                    "birthdate" => null,
                    "address" => null,
                ];
            }

            $category = [];
            $source = [];
            $author = [];
            $newsPreferences = $user->getUserNewsPreferences;
            if ($newsPreferences) {
                $setCat = $newsPreferences->category_codes;
                if ($setCat && count($setCat) > 0) {
                    $category = collect(NewsCategory::whereIn('code', $setCat)->get())->map(fn ($q) => [
                        'label' => $q->name,
                        'value' => $q->code,
                    ]);
                }

                $setSource = $newsPreferences->source_codes;
                if ($setSource && count($setSource) > 0) {
                    $source = collect(NewsSource::whereIn('code', $setSource)->get())->map(fn ($q) => [
                        'label' => $q->name,
                        'value' => $q->code,
                    ]);
                }

                $setAuthor = $newsPreferences->author_codes;
                if ($setAuthor && count($setAuthor) > 0) {
                    $author = collect(NewsAuthor::whereIn('code', $setAuthor)->get())->map(fn ($q) => [
                        'label' => $q->name,
                        'value' => $q->code,
                    ]);
                }
            }
            $result["preferences"] = [
                "category" => $category,
                "source" => $source,
                "author" => $author,
            ];

            return $this->responseLoadDataSuccess($result, $this->nameUserInformation);
        } catch (\Throwable $e) {
            return $this->responseLoadDataFailed($e, $this->nameUserInformation);
        }
    }

    /**
     * Create or update personal data user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function updateProfile(Request $request)
    {
        try {
            // validate
            $data = $request->validate(UserInformation::requestUpdate());

            $user = request()->user();
            // @phpstan-ignore-next-line
            $userInformation = $user->getUserInformation;

            $data['user_id'] = $user->id;

            $rand = str()->random(rand(10, 21));

            if ($request->hasFile('photo') && $request->file('photo')->isValid()) {
                $helper = new ImageHelper();

                if ($userInformation) {
                    $string = new StringHelper();
                    $pathOld = $string->translateStorageFromStringDB($userInformation->photo, UserInformation::$photoSavePath);
                    if (Storage::exists($pathOld)) {
                        Storage::delete($pathOld);
                    }
                }

                $img = $request->file('photo');
                $ext = $img->extension();
                $name = "user_photo_$rand." . $ext;
                $data['photo'] = UserInformation::$photoGetPath . $name;

                $compress = $helper->imageCompress($img, $ext);
                Storage::put(UserInformation::$photoSavePath . $name, $compress);
            }

            // save news preferences
            if ($request->has(['category', 'source', 'author'])) {
                $category = NewsCategory::select('code', 'name')->whereIn('code', explode(',', $request->category))->get();
                $source = NewsSource::select('code', 'name')->whereIn('code', explode(',', $request->source))->get();
                $author = NewsAuthor::select('code', 'name')->whereIn('code', explode(',', $request->author))->get();

                UserNewsPreferences::updateOrCreate([
                    'user_id' => $user->id,
                ], [
                    'category_codes' => count($category) > 0 ? $category->pluck('code')->toArray() : null,
                    'source_codes' => count($source) > 0 ? $source->pluck('code')->toArray() : null,
                    'author_codes' => count($author) > 0 ? $author->pluck('code')->toArray() : null,
                ]);

                $data['category'] = count($category) > 0 ? $category->toArray() : NewsCategory::select('code', 'name')->get()->toArray();
            }

            $user->update(['name' => $request->name]);
            UserInformation::updateOrCreate(['user_id' => $data['user_id']], [...$data]);
            $data['name'] = $request->name;
            return $this->responseCustomSuccess('Your profile is successfully updated!', $data);
        } catch (\Throwable $e) {
            return $this->responseCustomFailed($e, 'Failed to update your profile!');
        }
    }
}
