<?php

namespace App\Helpers;

class StringHelper
{    
    /**
     * translateStorageFromDB
     *
     * @param  string $string
     * @param  string $path
     * @return string
     */
    public function translateStorageFromStringDB($string,$path)
    {
        $string=str($string)->explode("/");
        $string=$string[count($string)-1];

        return $path.$string;
    }
}
