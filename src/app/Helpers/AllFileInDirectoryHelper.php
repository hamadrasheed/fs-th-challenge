<?php

namespace App\Helpers;

use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class AllFileInDirectoryHelper
{
    private $exceptName = [
        ".",
        "..",
        ".DS_Store"
    ];

    /**
     * get all file of public directory
     *
     * @param  string $path = target path
     * @return array<int,mixed>
     */
    public function getFileNamesInPublicDirectory($path, $withUrl = false)
    {
        $targetPath = public_path($path);
        $fileList = scandir($targetPath);

        return collect($fileList)->map(fn ($v, $i) => [
            'id' => $i,
            'name' => Str::of($v)->explode($targetPath)[0],
        ])->whereNotIn('name', $this->exceptName)
            ->map(function ($v, $i) use ($path) {
                $v['name'] = $path . $v['name'];
                return $v;
            })
            ->pluck('name')
            ->all();
    }
}
