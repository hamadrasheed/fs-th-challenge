<?php

namespace App\Helpers;

class EnvHelper
{
    public static function get($value)
    {
        return array_key_exists($value, $_SERVER) ? $_SERVER[$value] : env($value);
    }
}
