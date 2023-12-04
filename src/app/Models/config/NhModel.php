<?php

namespace App\Models\config;

use App\Traits\HookTrait;
use App\Traits\RequestTrait;
use Illuminate\Database\Eloquent\Model;

class NhModel extends Model
{
    use RequestTrait, HookTrait;
}
