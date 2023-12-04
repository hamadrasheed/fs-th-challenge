<?php

namespace App\Models;

use App\Helpers\ArrayHelper;
use App\Models\config\NhModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class News extends NhModel
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'm_news';
    protected $primaryKey = 'id';
    protected $fillable = [
        'source_code',
        'author_code',
        'title',
        'permalink',
        'description',
        'url',
        'url_to_image',
        'published_at',
        'content',
    ];

    public static function requestDefault()
    {
        return [
            'source_code' => ['nullable', 'exists:m_news_source,code'],
            'author_code' => ['nullable', 'exists:m_news_author,code'],
            'title' => ['required', 'string', 'min:3'],
            'permalink' => ['required', 'unique:m_news,permalink'],
            'description' => ['nullable', 'string', 'min:3'],
            'url' => ['nullable', 'string'],
            'url_to_image' => ['nullable', 'string'],
            'published_at' => ['required', 'numeric'],
            'content' => ['nullable', 'string', 'min:3'],
        ];
    }

    public function scopeSetAlias($query)
    {
        return $query->from('m_news as mn');
    }

    public function scopeNewsList($query)
    {
        $helper = new ArrayHelper();
        $search = [
            'mn.title',
            'mn.description',
            'mn.content',
        ];
        $select = [
            'mn.id',
            ...$search,
            'mn.permalink',
            'mn.url',
            'mn.url_to_image',
            'mn.published_at',
            'mns.code as source_code',
            'mns.name as source_name',
            'mns.description as source_desc',
            'mns.url as source_url',
            'mns.language_code',
            'mns.country_code',
            'mnc.code as category_code',
            'mnc.name as category_name',
            'mna.code as author_code',
            'mna.name as author_name',
        ];
        $orderAvailable = $helper->orderOptsMap($select, 'mn.id');

        $language = request('language');
        $category = request('category');
        $country = request('country');
        $source = request('source');
        $author = request('author');

        $query->setAlias()
            ->when($language, function ($query) use ($language) {
                $query->whereIn('mnl.code', explode(',', $language));
            })
            ->when($category, function ($query) use ($category) {
                $query->whereIn('mnc.code', explode(',', $category));
            })
            ->when($country, function ($query) use ($country) {
                $query->whereIn('mnco.code', explode(',', $country));
            })
            ->when($source, function ($query) use ($source) {
                $query->whereIn('mns.code', explode(',', $source));
            })
            ->when($author, function ($query) use ($author) {
                $query->whereIn('mna.code', explode(',', $author));
            })
            ->newsSourceRelation()
            ->newsAuthorRelation()
            ->select($select)
            ->searchBy($search)
            ->orderRequest('mn.published_at', $orderAvailable)
            ->dateBetween('mn.published_at');
    }

    public function scopeWhereId($query, $id)
    {
        return $query->where('mn.id', $id);
    }

    public function scopeNewsSourceRelation($query, $useAlias = true)
    {
        $alias = $useAlias ? 'mn' : 'm_news';
        return $query
            ->leftJoin('m_news_source as mns', "$alias.source_code", 'mns.code')
            ->leftJoin('m_news_category as mnc', 'mns.category_code', 'mnc.code')
            ->leftJoin('m_news_country as mnco', 'mns.country_code', 'mnco.code')
            ->leftJoin('m_news_language as mnl', 'mns.language_code', 'mnl.code');
    }

    public function scopeNewsAuthorRelation($query, $useAlias = true)
    {
        $alias = $useAlias ? 'mn' : 'm_news';
        return $query->leftJoin('m_news_author as mna', "$alias.author_code", 'mna.code');
    }

    public function getNewsSource()
    {
        return $this->belongsTo(NewsSource::class, 'source_code');
    }

    public function getNewsAuthor()
    {
        return $this->belongsTo(NewsAuthor::class, 'author_code');
    }
}
