<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use jcobhams\NewsApi\NewsApi;
use App\Helpers\EnvHelper;
use App\Models\LogNewsDate;
use App\Models\News;
use App\Models\NewsAuthor;
use App\Models\NewsSource;
use Carbon\CarbonPeriod;

class NewsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $periods = CarbonPeriod::create(now()->subDays(3)->format('Y-m-d'), now()->format('Y-m-d'));
        $sources = NewsSource::whereIn('code', ['bbc-news', 'gruenderszene', 'new-york-magazine', 'the-wall-street-journal', 'xinhua-net'])->get()->pluck('code')->toArray();

        try {
            $newsapi = new NewsApi(EnvHelper::get('NEWSAPI_KEY'));
            foreach ($periods as $period) {
                $stopIter = false;
                $page = 1;
                while (!$stopIter && $page < 5) {
                    $res = $newsapi->getEverything(sources: implode(",", $sources), from: $period, to: $period, page: $page);
                    if (ceil($res->totalResults / 100) == $page) {
                        $stopIter = true;
                    }

                    $authors = [];
                    $count = NewsAuthor::count();
                    foreach ($sources as $val) {
                        $arr = collect($res->articles)->where('source.id', $val)->pluck('author');
                        $existingAuthor = NewsAuthor::whereIn('name', collect($arr)->unique())->where('source_code', $val)->get()->pluck('name');
                        $authors = [...$authors, ...collect($arr)->filter(fn ($q) => !in_array($q, $existingAuthor->toArray()) && $q)->map(fn ($q, $i) => [
                            'name' => $q ? $q : 'anonymous',
                            'source_code' => $val,
                            'code' => 'AU-' . str()->padLeft($count + $i+1, 3, '0').str()->random(rand(4,10)),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ])->unique('name')->toArray()];
                    }

                    if (count($authors) > 0) {
                        NewsAuthor::insert($authors);
                    }

                    if (count($res->articles) > 0) {
                        News::insert(
                            collect($res->articles)->map(function ($q) use ($authors) {
                                $auh = collect($authors)->filter(fn ($x) => $x['name'] == ($q->author ? $q->author : 'anonymous'))->toArray();
                                return [
                                    'source_code' => $q->source->id,
                                    'author_code' => is_array($auh) && count($auh) > 0 && isset($auh[0]) ? $auh[0]['code'] : null,
                                    'title' => $q->title,
                                    'permalink' => preg_replace("![^a-z0-9]+!i", "-", strtolower($q->title) . "-" . rand(111, 999)),
                                    'description' => $q->description,
                                    'url' => $q->url,
                                    'url_to_image' => $q->urlToImage,
                                    'published_at' => \Carbon\Carbon::parse($q->publishedAt),
                                    'content' => $q->content,
                                    'created_at' => now(),
                                    'updated_at' => now(),
                                ];
                            })->toArray()
                        );
                    }

                    $page++;
                }
            }
        } catch (\Throwable $th) {
            // throw $th;
        }

        LogNewsDate::insert(collect($periods)->map(fn ($q) => [
            'date' => $q,
            'created_at' => now(),
            'updated_at' => now(),
        ])->toArray());
    }
}
