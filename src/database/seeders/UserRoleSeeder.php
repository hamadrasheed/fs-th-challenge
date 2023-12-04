<?php

namespace Database\Seeders;

use App\Models\UserRole;
use Illuminate\Database\Seeder;

class UserRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        UserRole::insert([
            [
                'code' => UserRole::$ROOT,
                "name" => strtoupper("root"),
                "created_at" => now(),
                "updated_at" => now(),
            ],
            [
                'code' => UserRole::$USER,
                "name" => strtoupper("user"),
                "created_at" => now(),
                "updated_at" => now(),
            ],
        ]);
    }
}
