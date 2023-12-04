<?php

namespace App\Models;

use App\Models\config\NhModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserRole extends NhModel
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'm_user_roles';
    protected $primaryKey = 'id';

    protected $fillable = [
        'code',
        'name',
    ];

    public static $ROOT = "NH_RT";
    public static $USER = "NH_UR";

    public function getUser()
    {
        return $this->hasMany(User::class, 'role_code');
    }
}
