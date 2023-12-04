<?php

namespace App\Traits;

trait RequestTrait
{
    /**
     * for validation list
     *
     * @param array $manipulate
     * @return array
     */
    public static function requestList($manipulate = [
        'except' => [],
        'only' => [],
        'update' => [],
    ]): array
    {
        $startDate = ['date', 'required_with:end_date_range'];
        $endDate = ['date', 'required_with:start_date_range'];

        if (request('start_date_range'))
            $endDate[] = "after:start_date_range";
        if (request('end_date_range'))
            $startDate[] = "before:end_date_range";

        $validate = [
            'q' => ['string', 'min:1', 'nullable'],
            'limit' => ['integer', 'max:100', 'min:1'],
            'show_trash_data' => ['boolean'],
            'only_active' => ['boolean'],
            'start_date_range' => $startDate,
            'end_date_range' => $endDate,
            'sort' => ['string'],
            'order' => ['in:asc,desc'],
        ];

        if (isset($manipulate['except']) && is_array($manipulate['except']) && count($manipulate['except']))
            $validate = collect($validate)->except($manipulate['except'])->all();

        if (isset($manipulate['only']) && is_array($manipulate['only']) && count($manipulate['only']))
            $validate = collect($validate)->only($manipulate['only'])->all();

        if (isset($manipulate['update']) && is_array($manipulate['update']) && count($manipulate['update']))
            $validate = [...$validate, ...$manipulate['update']];

        return $validate;
    }

    /**
     * scopeSearchBy
     *
     * @param  mixed $query
     * @return void
     */
    public function scopeSearchBy($query, $column): void
    {
        $search = request('q');
        $query->when($search, function ($query) use ($search, $column) {
            if (gettype($column) == 'string')
                return $query->where($column, 'LIKE', "%$search%");

            return $query->where(function ($q) use ($column, $search) {

                foreach ($column as $i => $cl) {
                    if (!$i)
                        $q->where($cl, 'LIKE', "%$search%");
                    else
                        $q->orWhere($cl, 'LIKE', "%$search%");
                }
            });
        });
    }

    /**
     * scopeShowTrashedOrNot
     *
     * @param  mixed $query
     * @param  array $selectedWithoutTrashed
     * @param  array $selectedOnlyTrashed
     * @return void
     */
    public function scopeShowTrashedOrNot($query, $selectedWithoutTrashed, $selectedOnlyTrashed): void
    {
        $showTrash = request('show_trash_data');
        $showTrash = gettype($showTrash) == 'string' ? (int)$showTrash : $showTrash;

        //without trash
        $query->when(!$showTrash, function ($query) use ($selectedWithoutTrashed) {
            $query
                ->setSoftDeletedWithAlias()
                ->select(
                    ...$selectedWithoutTrashed
                );
        })
            //only trash
            ->when($showTrash, function ($query) use ($selectedOnlyTrashed) {
                $query->trashedWithAlias()
                    ->userDeletedRelation()
                    ->select(
                        ...$selectedOnlyTrashed
                    );
            });
    }

    /**
     * scopeHasActive
     *
     * @param  mixed $query
     * @return void
     */
    public function scopeOnlyActive($query, $column = 'is_active'): void
    {
        $active = request('only_active');
        $active = gettype($active) == 'string' ? (int)$active : $active;

        $query->when(is_int($active), function ($query) use ($active, $column) {
            $query->where($column, $active);
        });
    }

    /**
     * scopeDateBetween
     *
     * @param  mixed $query
     * @return void
     */
    public function scopeDateBetween($query, $column): void
    {
        $startDateRange = request('start_date_range');
        $endDateRange = request('end_date_range');

        $query->when($startDateRange && $endDateRange, function ($query) use ($startDateRange, $endDateRange, $column) {
            $query->whereBetween($column, [$startDateRange, $endDateRange]);
        });
    }

    /**
     * scopeOrderRequest
     *
     * @param  mixed $query
     * @param  string $defaultSort
     * @param  array $columnByParams
     * @return void
     */
    public function scopeOrderRequest($query, $defaultSort, $columnByParams = [], $defaultOrder = 'desc'): void
    {
        $sort = request('sort');
        $order = request('order') ?? ($sort ? 'asc' : $defaultOrder);
        $columnName = isset($columnByParams[$sort]) ? $columnByParams[$sort] : null;

        $query->orderBy($columnName ? $columnName : $defaultSort, $order);
    }

    /**
     * scopeOrderRequest with lock
     *
     * @param  mixed $query
     * @param  string $defaultSort
     * @param  array $columnByParams
     * @return void
     */
    public function scopeOrderWithLockRequest($query, $lockSort, $defaultSort, $columnByParams = [], $defaultOrder = 'desc'): void
    {
        $sort = request('sort');
        $order = request('order') ?? ($sort ? 'asc' : $defaultOrder);
        $columnName = isset($columnByParams[$sort]) ? $columnByParams[$sort] : null;

        $query
            ->orderBy($lockSort, 'asc')
            ->orderBy($columnName ? $columnName : $defaultSort, $order);
    }

    /**
     * scopeFilter
     */
    public function scopeFilter($query, $payload)
    {
        $payloadString = collect(collect(array_keys($payload))
            ->filter(fn($q) => $payload[$q]['type'] == 'string')
            ->reduce(fn($prev, $next) => [...$prev, $payload[$next]['column'] => request($next)], []))
            ->filter(fn($q) => $q)
            ->toArray()
        ;

        $payloadIn = collect(collect(array_keys($payload))
            ->filter(fn($q) => $payload[$q]['type'] == 'in')
            ->reduce(fn($prev, $next) => [...$prev, $payload[$next]['column'] => request($next)], []))
            ->filter(fn($q) => $q)
            ->toArray()
        ;

        $payloadBool = collect(collect(array_keys($payload))
            ->filter(fn($q) => $payload[$q]['type'] == 'bool')
            ->reduce(fn($prev, $next) => [...$prev, $payload[$next]['column'] => request($next)], []))
            ->filter(fn($q) => $q)
            ->toArray()
        ;

        $query
            ->when(count($payloadString) > 0, fn($q) => $q->where(function($q) use ($payloadString) {
                $i = 0;
                foreach ($payloadString as $key => $value) {
                    if ($i == 0)
                        $q->where($key, $value);
                    else
                        $q->orWhere($key, $value);

                    $i++;
                }
            }))
            ->when(count($payloadIn) > 0, fn($q) => $q->where(function($q) use ($payloadIn) {
                $i = 0;
                foreach ($payloadIn as $key => $value) {
                    if ($i == 0)
                        $q->whereIn($key, $value);
                    else
                        $q->orWhereIn($key, $value);

                    $i++;
                }
            }))
            ->when(count($payloadBool) > 0, fn($q) => $q->where(function($q) use ($payloadBool) {
                $i = 0;
                foreach ($payloadBool as $key => $value) {
                    $value = is_bool($value) ? $value : (int)$value;
                    if ($i == 0)
                        $q->where($key, $value);
                    else
                        $q->orWhere($key, $value);

                    $i++;
                }
            }))
        ;
    }
}
