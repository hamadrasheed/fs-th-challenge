<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            NewsCategorySeeder::class,
            NewsLanguageSeeder::class,
            NewsCountrySeeder::class,
            NewsSourceSeeder::class,
            NewsSeeder::class,
            UserRoleSeeder::class,
            UserSeeder::class,
        ]);
    }
}
