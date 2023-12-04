<?php

namespace App\Models;

use App\Models\config\NhModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class NewsSource extends NhModel
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'm_news_source';
    protected $primaryKey = 'id';
    protected $fillable = [
        'code',
        'name',
        'description',
        'url',
        'category_code',
        'language_code',
        'country_code',
    ];

    public function scopeSetAlias($query)
    {
        return $query->from('m_news_source as mns');
    }

    public function scopeWhereId($query, $id)
    {
        return $query->where('mns.id', $id);
    }

    public function scopeNewsCategoryRelation($query, $useAlias = true)
    {
        $alias = $useAlias ? 'mns' : 'm_news_source';
        return $query->leftJoin('m_news_category as mnc', "$alias.category_code", 'mnc.code');
    }

    public function scopeNewsLanguageRelation($query, $useAlias = true)
    {
        $alias = $useAlias ? 'mns' : 'm_news_source';
        return $query->leftJoin('m_news_language as mnl', "$alias.language_code", 'mnl.code');
    }

    public function scopeNewsCountryRelation($query, $useAlias = true)
    {
        $alias = $useAlias ? 'mns' : 'm_news_source';
        return $query->leftJoin('m_news_country as mnco', "$alias.country_code", 'mnco.code');
    }

    public function scopeNewsAuthorRelation($query, $useAlias = true)
    {
        $alias = $useAlias ? 'mns' : 'm_news_source';
        return $query->leftJoin('m_news_author as mna', "$alias.code", 'mna.source_code');
    }

    public function scopeNewsRelation($query, $useAlias = true)
    {
        $alias = $useAlias ? 'mns' : 'm_news_source';
        return $query->leftJoin('m_news as mn', "$alias.code", 'mn.source_code');
    }

    public function getNewsCategory()
    {
        return $this->belongsTo(NewsCategory::class, 'category_code');
    }

    public function getNewsLanguage()
    {
        return $this->belongsTo(NewsLanguage::class, 'language_code');
    }

    public function getNewsCountry()
    {
        return $this->belongsTo(NewsCountry::class, 'country_code');
    }

    public function getNewsAuthor()
    {
        return $this->hasMany(NewsAuthor::class, 'source_code');
    }

    public function getNews()
    {
        return $this->hasMany(News::class, 'source_code');
    }
}
