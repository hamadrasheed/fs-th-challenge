<?php

namespace App\Helpers;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\AbstractPaginator;
use Illuminate\Support\Collection;

class UserHelper
{
    /**
     * traceChanger
     *
     * @param  Collection|AbstractPaginator|Model $data
     * @param  bool $paginate
     * @param  array $referenceIds
     * @param  array $custom
     * @return Collection
     */
    public function traceUserUserWhoChanges($data, $paginate = false, $referenceIds = [], $custom = [])
    {
        // when referenceIds not set
        if (!count($referenceIds))
            $referenceIds = User::dataReferenceIds();

        //get data user manipulator
        $userTemp = User::selectByIds($data, $paginate, $referenceIds)->get();

        // add user manipulator
        if ($paginate)
            $data->getCollection()->transform(function ($dt) use ($userTemp, $referenceIds, $custom) {
                foreach ($referenceIds as $column) {
                    if ($dt->{$column} || isset($custom[$column])) {
                        $user = $userTemp->where('id', $dt->{$column})->first();
                        $dt->{$column} = isset($custom[$column]) && !$user ? [
                            'id' => null,
                            'photo' => asset('/images/mock/avatar/' . rand(1, 5) . '.png'),
                            'name' => $dt->{$custom[$column]}
                        ] : $userTemp->where('id', $dt->{$column})->first();
                    }
                }

                return $dt;
            });
        else
            foreach ($data as $i => $dt) {
                foreach ($referenceIds as $column) {
                    if ($dt->{$column})
                        $dt->{$column} = $userTemp->where('id', $dt->{$column})->first();
                }

                $data[$i] = $dt;
            }

        return $data;
    }
}
