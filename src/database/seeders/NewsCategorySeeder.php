<?php

namespace Database\Seeders;

use App\Models\NewsCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class NewsCategorySeeder extends Seeder
{
    public const DATA = [
        ['business', 'Business'],
        ['entertainment', 'Entertainment'],
        ['general', 'General'],
        ['health', 'Health'],
        ['science', 'Science'],
        ['sports', 'Sports'],
        ['technology', 'Technology'],
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (static::DATA as $data) {
            NewsCategory::updateOrCreate([
                'code' => $data[0],
                'name' => $data[1],
            ], [
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
