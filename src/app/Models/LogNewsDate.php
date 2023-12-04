<?php

namespace App\Models;

use App\Models\config\NhModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LogNewsDate extends NhModel
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'log_news_date';
    protected $primaryKey = 'id';
    protected $fillable = ['date'];

    public function scopeSetAlias($query)
    {
        return $query->from('log_news_date as lnd');
    }

    public function scopeWhereId($query, $id)
    {
        return $query->where('lnd.id', $id);
    }

    public function scopeWhereDate($query, $date)
    {
        return $query->where('lnd.date', $date);
    }
}
