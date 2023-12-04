<?php

namespace App\Models;

use App\Models\config\NhModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class NewsCategory extends NhModel
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'm_news_category';
    protected $primaryKey = 'id';
    protected $fillable = ['code', 'name'];

    public function scopeSetAlias($query)
    {
        return $query->from('m_news_category as mnc');
    }

    public function scopeWhereId($query, $id)
    {
        return $query->where('mnc.id', $id);
    }

    public function scopeWhereCode($query, $code)
    {
        return $query->where('mnc.code', $code);
    }

    public function scopeWhereName($query, $name)
    {
        return $query->where('mnc.name', $name);
    }

    public function scopeNewsSourceRelation($query, $useAlias = true)
    {
        $alias = $useAlias ? 'mnc' : 'm_news_category';
        return $query->leftJoin('m_news_source as mns', "$alias.code", 'mns.category_code');
    }

    public function getNewsSource()
    {
        return $this->hasMany(NewsSource::class, 'category_code');
    }
}
