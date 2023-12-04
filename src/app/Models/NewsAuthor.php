<?php

namespace App\Models;

use App\Models\config\NhModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class NewsAuthor extends NhModel
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'm_news_author';
    protected $primaryKey = 'id';
    protected $fillable = ['code', 'name', 'source_code'];

    public function scopeSetAlias($query)
    {
        return $query->from('m_news_author as mna');
    }

    public function scopeWhereId($query, $id)
    {
        return $query->where('mna.id', $id);
    }

    public function scopeWhereCode($query, $code)
    {
        return $query->where('mna.code', $code);
    }

    public function scopeWhereName($query, $name)
    {
        return $query->where('mna.name', $name);
    }

    public function scopeNewsSourceRelation($query, $useAlias = true)
    {
        $alias = $useAlias ? 'mna' : 'm_news_author';
        return $query->leftJoin('m_news_source as mns', "$alias.source_code", 'mns.code');
    }

    public function getNewsSource()
    {
        return $this->belongsTo(NewsSource::class, 'source_code');
    }
}
