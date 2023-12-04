<?php

namespace App\Helpers;

use Intervention\Image\Facades\Image;

class ImageHelper
{
    public function imageUrlCompress($imgUrl, $extensions = "jpg", $default = 480)
    {
        $img = Image::make(file_get_contents($imgUrl));
        $cond = $img->height() > $img->width();
        $r = $cond ?
            $img->height() / $img->width() : $img->width() / $img->height();
        $p = $r * $default;
        $w = $cond ? $p : $default;
        $h = $cond ? $default : $p;

        $img->resize($p, $w, function ($constraint) {
            $constraint->aspectRatio();
        });


        return $img->encode($extensions,95);
    }

    public function imageCompress($image, $extensions = "jpg", $default = 480)
    {
        $img = Image::make($image->getRealPath());
        $cond = $img->height() > $img->width();
        $r = $cond ?
            $img->height() / $img->width() : $img->width() / $img->height();
        $p = $r * $default;
        $w = $cond ? $p : $default;
        $h = $cond ? $default : $p;

        $img->resize($p, $w, function ($constraint) {
            $constraint->aspectRatio();
        });

        return $img->encode($extensions,95);
    }
}
