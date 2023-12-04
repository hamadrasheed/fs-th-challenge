<?php

namespace Database\Seeders;

use App\Models\NewsCountry;
use Illuminate\Database\Seeder;

class NewsCountrySeeder extends Seeder
{
    public const DATA = [
        ['ae', 'United Arab Emirates'],
        ['ar', 'Argentina'],
        ['at', 'Austria'],
        ['au', 'Australia'],
        ['be', 'Belgium'],
        ['bg', 'Bulgaria'],
        ['br', 'Brazil'],
        ['ca', 'Canada'],
        ['ch', 'Switzerland'],
        ['cn', 'China'],
        ['co', 'Colombia'],
        ['cu', 'Cuba'],
        ['cz', 'Czech Republic'],
        ['de', 'Germany'],
        ['eg', 'Egypt'],
        ['fr', 'France'],
        ['gb', 'United Kingdom'],
        ['gr', 'Greece'],
        ['hk', 'Hong Kong'],
        ['hu', 'Hungary'],
        ['id', 'Indonesia'],
        ['ie', 'Ireland'],
        ['il', 'Israel'],
        ['in', 'India'],
        ['it', 'Italy'],
        ['jp', 'Japan'],
        ['kr', 'South Korea'],
        ['lt', 'Lithuania'],
        ['lv', 'Latvia'],
        ['ma', 'Morocco'],
        ['mx', 'Mexico'],
        ['my', 'Malaysia'],
        ['ng', 'Nigeria'],
        ['nl', 'Netherlands'],
        ['no', 'Norway'],
        ['nz', 'New Zealand'],
        ['ph', 'Philippines'],
        ['pl', 'Poland'],
        ['pt', 'Portugal'],
        ['ro', 'Romania'],
        ['rs', 'Serbia'],
        ['ru', 'Russia'],
        ['sa', 'Saudi Arabia'],
        ['se', 'Sweden'],
        ['sg', 'Singapore'],
        ['si', 'Slovenia'],
        ['sk', 'Slovakia'],
        ['th', 'Thailand'],
        ['tr', 'Turkey'],
        ['tw', 'Taiwan'],
        ['ua', 'Ukraine'],
        ['us', 'USA'],
        ['ve', 'Venezuela'],
        ['za', 'South Africa'],
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (static::DATA as $data) {
            NewsCountry::updateOrCreate([
                'code' => $data[0],
                'name' => $data[1],
            ], [
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
