<?php

namespace App\Models;

use App\Models\config\NhModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class NewsLanguage extends NhModel
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'm_news_language';
    protected $primaryKey = 'id';
    protected $fillable = ['code', 'name'];

    public function scopeSetAlias($query)
    {
        return $query->from('m_news_language as mnl');
    }

    public function scopeWhereId($query, $id)
    {
        return $query->where('mnl.id', $id);
    }

    public function scopeWhereCode($query, $code)
    {
        return $query->where('mnl.code', $code);
    }

    public function scopeWhereName($query, $name)
    {
        return $query->where('mnl.name', $name);
    }

    public function scopeNewsSourceRelation($query, $useAlias = true)
    {
        $alias = $useAlias ? 'mnl' : 'm_news_language';
        return $query->leftJoin('m_news_source as mns', "$alias.code", 'mns.language_code');
    }

    public function getNewsSource()
    {
        return $this->hasMany(NewsSource::class, 'language_code');
    }
}
