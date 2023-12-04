<?php

namespace Database\Seeders;

use App\Helpers\AllFileInDirectoryHelper;
use App\Models\Branch;
use App\Models\NewsAuthor;
use App\Models\NewsCategory;
use App\Models\NewsSource;
use App\Models\User;
use App\Models\UserInformation;
use App\Models\UserNewsPreferences;
use App\Models\UserRole;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory;
use Illuminate\Support\Str;


class UserSeeder extends Seeder
{
    protected $helper;

    public function __construct()
    {
        $this->helper = new AllFileInDirectoryHelper();
    }

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $role = [
            [
                'code' => UserRole::$ROOT,
                'data' => [
                    [
                        'name' => 'ROOT',
                        'username' => 'root',
                        'email' => 'root@example.com',
                        'password' => bcrypt('secret'),
                        "email_verified_at" => now(),
                        'is_active' => true,
                        "role_code" => UserRole::$ROOT,
                        "created_at" => now(),
                        "updated_at" => now(),
                    ]
                ]
            ],
            [
                'code' => UserRole::$USER,
                'count' => 10,
                'data' => [
                    [
                        'name' => 'annon user',
                        'username' => 'annon',
                        'email' => 'annon@example.com',
                        'password' => bcrypt('secret'),
                        "email_verified_at" => now(),
                        'is_active' => true,
                        "role_code" => UserRole::$USER,
                        "created_at" => now(),
                        "updated_at" => now(),
                    ]
                ]
            ],

        ];
        DB::transaction(function () use ($role) {
            foreach ($role as $r) {
                $i = 0;
                do {
                    if (!$i && isset($r['data']))
                        foreach ($r['data'] as $dt)
                            $this->createData($r['code'], $dt);

                    $this->createData($r['code'], null, true);
                    $i++;
                } while (isset($r['count']) && $r['count'] > $i);
            }
        }, 10);
    }

    private function createData($role_code, $data = null, $random = false)
    {
        $faker = Factory::create('id_ID');

        $genderIndex = rand(0, 1);
        $genderOpt = UserInformation::genderList()[$genderIndex];
        $name = $genderIndex ? $faker->firstNameFemale : $faker->firstNameMale;

        $email = $faker->safeEmail;
        $is_active = $random ? rand(0, 1) : true;

        $user = User::create($data ??  [
            'name' => $name,
            'username' => Str::of($email)->explode('@')[0],
            'email' => $email,
            "email_verified_at" => $is_active ? (rand(0, 1) ? now() : null) : now(),
            "is_active" => $is_active,
            'password' => bcrypt('secret'),
            "role_code" => $role_code,
            "created_at" => now(),
            "updated_at" => now(),
        ]);

        UserInformation::create([
            "user_id" => $user->id,
            "phone" => $faker->phoneNumber,
            "gender" => $genderOpt,
            "birthdate" => $faker->date(),
            "address" => $faker->address,
            "created_at" => now(),
            "updated_at" => now(),
        ]);

        $category = NewsCategory::all()->random(5);
        $source = NewsSource::all()->random(5);
        $author = NewsAuthor::all()->random(5);
        UserNewsPreferences::create([
            'user_id' => $user->id,
            'category_codes' => count($category) > 0 ? $category->pluck('code')->toArray() : null,
            'source_codes' => count($source) > 0 ? $source->pluck('code')->toArray() : null,
            'author_codes' => count($author) > 0 ? $author->pluck('code')->toArray() : null,
        ]);
    }
}
