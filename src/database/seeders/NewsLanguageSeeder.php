<?php

namespace Database\Seeders;

use App\Models\NewsLanguage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class NewsLanguageSeeder extends Seeder
{
    public const DATA = [
        ['ar', 'Arabic'],
        ['de', 'Deutsch'],
        ['en', 'English'],
        ['es', 'Spanish'],
        ['fr', 'French'],
        ['he', 'Hebrew'],
        ['it', 'Italian'],
        ['nl', 'Dutch'],
        ['no', 'Norwegian'],
        ['pt', 'Portuguese'],
        ['ru', 'Russian'],
        ['sv', 'Swedish'],
        ['ud', 'Urdu'],
        ['zh', 'Chinese'],
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (static::DATA as $data) {
            NewsLanguage::updateOrCreate([
                'code' => $data[0],
                'name' => $data[1],
            ], [
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
