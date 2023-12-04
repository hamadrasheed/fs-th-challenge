<?php

namespace App\Models;

use App\Models\config\NhModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class NewsCountry extends NhModel
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'm_news_country';
    protected $primaryKey = 'id';
    protected $fillable = ['code', 'name'];

    public function scopeSetAlias($query)
    {
        return $query->from('m_news_country as mnco');
    }

    public function scopeWhereId($query, $id)
    {
        return $query->where('mnco.id', $id);
    }

    public function scopeWhereCode($query, $code)
    {
        return $query->where('mnco.code', $code);
    }

    public function scopeWhereName($query, $name)
    {
        return $query->where('mnco.name', $name);
    }

    public function scopeNewsSourceRelation($query, $useAlias = true)
    {
        $alias = $useAlias ? 'mnco' : 'm_news_country';
        return $query->leftJoin('m_news_source as mns', "$alias.code", 'mns.country_code');
    }

    public function getNewsSource()
    {
        return $this->hasMany(NewsSource::class, 'country_code');
    }
}
