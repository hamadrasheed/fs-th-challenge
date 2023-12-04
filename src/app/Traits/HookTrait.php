<?php

namespace App\Traits;


use App\Helpers\EnvHelper;
use Illuminate\Support\Facades\Schema;

trait HookTrait
{
    public static function bootHookTrait()
    {
        // parent::boot();

        static::creating(function ($model) {
            // @phpstan-ignore-next-line
            $table = (new static)->getTable();
            // @phpstan-ignore-next-line
            $table = strpos($table, ' as ') >= 0 ? explode(' ', $table)[0] : $table;

            $userCreatedExists = Schema::hasColumn($table, EnvHelper::get('CREATED_USER_DB'));
            $userUpdatedExists = Schema::hasColumn($table, EnvHelper::get('UPDATED_USER_DB'));
            $user = request()->user();

            if ($userCreatedExists && $user)
                $model->{EnvHelper::get('CREATED_USER_DB')} = $user->id;
            if ($userUpdatedExists && $user)
                $model->{EnvHelper::get('UPDATED_USER_DB')} = $user->id;
        });

        // @phpstan-ignore-next-line
        static::updating(function ($model) {
            // @phpstan-ignore-next-line
            $table = (new static)->getTable();
            // @phpstan-ignore-next-line
            $table = strpos($table, ' as ') >= 0 ? explode(' ', $table)[0] : $table;

            $userTracertExists = Schema::hasColumn($table, EnvHelper::get('UPDATED_USER_DB'));
            $user = request()->user();


            if ($userTracertExists && $user)
                $model->{EnvHelper::get('UPDATED_USER_DB')} = $user->id;
        });

        // @phpstan-ignore-next-line
        static::deleting(function ($model) {
            // @phpstan-ignore-next-line
            $table = (new static)->getTable();
            // @phpstan-ignore-next-line
            $table = strpos($table, ' as ') >= 0 ? explode(' ', $table)[0] : $table;

            $userTracertExists = Schema::hasColumn($table, EnvHelper::get('DELETED_USER_DB'));
            $user = request()->user();

            if (!$model->forceDeleting && $userTracertExists && $user) {
                $model->{EnvHelper::get('DELETED_USER_DB')} = $user->id;
            }
        });
    }
}
