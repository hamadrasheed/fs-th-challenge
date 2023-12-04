<?php

namespace App\Models;

use App\Models\config\NhModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserNewsPreferences extends NhModel
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'm_user_news_preferences';
    protected $primaryKey = 'id';

    protected $fillable = [
        'user_id',
        'category_codes',
        'source_codes',
        'author_codes',
    ];

    protected $casts = [
        'category_codes' => 'array',
        'source_codes' => 'array',
        'author_codes' => 'array',
    ];

    public static function requestDefault()
    {
        return [
            "user_id" => ['required', 'exists:users,id'],
            "category_codes" => ['nullable'],
            "source_codes" => ['nullable'],
            "author_codes" => ['nullable'],
        ];
    }

    public static function requestUpdate(): array
    {
        $data = UserNewsPreferences::requestDefault();
        $data['user_id'] = ['nullable', 'exists:users,id'];
        return $data;
    }

    public function getUser()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
