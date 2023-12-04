<?php

namespace App\Helpers;

use Illuminate\Database\Eloquent\Collection;

class ArrayHelper
{
    /**
     * groupArray
     * [{id:1,name:foo},{id:1,name:bar}] -> [{id:1,child:[{name:foo,},{name:bar}]}]
     * @param  array|Collection $data = data
     * @param  string $key = pk variable on array & combine all based on it
     * @param  array $parent = selection of the parent's array based on the index key. else moved to index key "child"
     * @param  array $locale = selection localization from selection array
     * @param  array $toArray = value is json, selected by index key, & need to convert to array
     * @param  string $childName = name of index key child nodes
     * @return array
     */
    public function groupArray($data, string $key, array $parent = [], $locale = [], $toArray = [], $childName = 'child', $paginate = false): array
    {
        $result = [];
        $locale_default = app()->currentLocale();

        if (gettype($data) !== 'array')
            $data = $data->toArray();

        foreach (($paginate ? $data['data'] : $data) as $i => $dt) {
            $dt = (array) $dt;
            if (count($locale)) {
                foreach ($locale as $l) {

                    if (!is_array($dt[$l]))
                        $dt[$l] = json_decode($dt[$l], true)[$locale_default];
                }
            }

            if (count($toArray)) {
                foreach ($toArray as $l) {
                    if (!is_array($dt[$l]))
                        $dt[$l] = ((array)json_decode($dt[$l]));
                }
            }
            if (!in_array($dt[$key], array_column($result, $key))) {
                $result[] = [$key => $dt[$key]];
                foreach ($parent as $p) {
                    $result[count($result) - 1][$p] = $dt[$p];
                }
            }

            $i = array_search($dt[$key], array_column($result, $key));
            $except = $parent;
            $except[] = $key;

            if (!isset($result[$i][$childName]))
                $result[$i][$childName] = [];

            $result[$i][$childName][] = collect($dt)->except($except)->all();
        }

        if ($paginate)
            $data['data'] = $result;

        return $paginate ? $data : $result;
    }

    public function orderArray($array)
    {
        $result = [];
        if ($array instanceof Collection)
            $array = $array->toArray();

        foreach ($array as $dt) {
            $result[] = $dt;
        }

        return $result;
    }

    /**
     * arrayChangerByKey
     *
     * @param  array|Collection $data
     * @param  array $changeKey
     * @return array|Collection
     */
    public function arrayChangerByKey($data, $changeKey = [
        'except' => [],
        'only' => [],
        'update' => [],
    ], $toArray = true)
    {
        $data = (array)$data;


        if (isset($changeKey['except']) && is_array($changeKey['except']) && count($changeKey['except'])) {
            //by key
            if (!isset($data[0])) {
                $data = collect($data)->except($changeKey['except']);
            }

            //by index
            else {
                $data = collect($data)->map(fn ($v, $i) => [
                    'id' => $i,
                    'value' => $v
                ])
                    ->whereNotIn('value', $changeKey['except'])
                    ->pluck('value');
            }
        }

        if (isset($changeKey['only']) && is_array($changeKey['only']) && count($changeKey['only'])) {

            //by key
            if (!isset($data[0])) {
                $data = collect($data)->only($changeKey['only']);
            }
            //by index
            else {
                $data = collect($data)->map(fn ($v, $i) => [
                    'id' => $i,
                    'value' => $v
                ])
                    ->whereIn('value', $changeKey['only'])
                    ->pluck('value');
            }
        }

        if (isset($changeKey['update']) && is_array($changeKey['update']) && count($changeKey['update'])) {
            //by key
            if (!isset($data[0]))
                $data = [...$data, ...$changeKey['update']];
            //by index
            else {
                $data = collect($changeKey['update'])
                    ->reduce(function ($prev, $curr) {
                        if (!in_array($curr, $prev))
                            $prev = [...$prev, $curr];

                        return $prev;
                    }, $data);
            }

            $data = collect($data);
        }

        if ($toArray && !is_array($data))
            $data = $data->all();

        return $data;
    }

    /**
     * sortArrayTest
     *
     * @param  array $data
     * @param  string $order
     * @return bool
     */
    public function sortArrayTest($data, $order)
    {
        //order prevent
        if (!in_array($order, ['asc', 'desc'])) {
            return false;
        }

        // order rules
        $alpha = '0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z';
        $alpha = explode(',', $alpha);
        $result = true;



        $i = 0;


        if (!count($data))
            $result = false;

        while (isset($data[$i + 1]) && $result) {
            $z = 0;
            $currAlpha = $data[$i];
            $nextAlpha = $data[$i + 1];
            $continue = true;

            do {
                $currAlphaByIndex = substr($currAlpha, $z, 1);
                $nextAlphaByIndex = substr($nextAlpha, $z, 1);

                if (strtolower($currAlphaByIndex) !== strtolower($nextAlphaByIndex))
                    $continue = false;

                $result = $this->checkOrder($currAlphaByIndex, $nextAlphaByIndex, $order, $alpha);



                $z++;
            } while ($result && $continue && (strlen($currAlpha) > $z || strlen($nextAlpha) > $z));

            $i++;
        }

        return $result;
    }

    private function checkOrder($curr, $next, $order, $alpha)
    {
        $currIndex = array_search(strtolower($curr), $alpha) ?? null;
        $nextIndex = array_search(strtolower($next), $alpha) ?? null;
        $isAsc = $order == 'asc';

        if ($isAsc ? !$currIndex : !$nextIndex)
            return true;

        $ascCond = $currIndex <= $nextIndex;
        $descCond = $currIndex >= $nextIndex;


        return $isAsc ? $ascCond : $descCond;
    }

    /**
     * orderOptsMap
     *
     * @param  array $data
     * @param  array|string $except
     * @return array
     */
    public function orderOptsMap($data = [], $except = 'id'):array
    {

        return collect(collect($data)->reduce(function ($prev,$next)  {
            $key = str_contains($next, '.') ? explode('.', $next)[1] : $next;
            $key = explode(' as', $key)[0];
            $value = explode(' as', $next)[0];
            return [...$prev,$key => $value];
        },[]))->except($except)->toArray();
    }
}
