<?php

namespace App\Helpers;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class DetailPolicyHelper
{
    public $id;
    private $message = [];
    private $relations = [];
    public $canDelete = 'can_delete';
    public $canUpdate = 'can_update';

    /**
     * __construct
     *
     * @param  array<string,mixed> $relations
     * @param  bool $canDelete
     * @param  bool $canUpdate
     * @return void
     */
    public function __construct($canDelete = false, $canUpdate = true, ...$relations)
    {

        $this->relations = $relations;
        $this->message[$this->canDelete] = $canDelete;
        $this->message[$this->canUpdate] = $canUpdate;
    }

    /**
     * checkPermission
     *
     * @return array
     */
    public function checkPermission()
    {
        if (!$this->checkAction(null)) {

            $this->message['can_delete'] = true;
            $this->message['can_update'] = true;
        } else {

            if (!$this->message['can_delete'] || !$this->message['can_update'])
                $this->message['message'] = [];

            if (!$this->message['can_delete'])
                $this->message['message'][] = __('response.warning.cant_delete.subtitle');

            if (!$this->message['can_update'])
                $this->message['message'][] = __('response.warning.cant_update.subtitle');
        }

        return $this->message;
    }

    /**
     * check
     *
     * @param  string|null $action
     * @return bool
     */
    public function checkAction($action = 'can_delete')
    {

        $relations = $this->relations;
        $result = false;
        $i = 0;
        $action = isset($this->message[$action]) ? $this->message[$action] : null;


        do {
            $r = $relations[$i];

            if (in_array(count($r), [2, 3])) {
                $table = $r[0];
                $column = $r[1];
                $func = isset($r[2]) ? $r[2] : null;


                $result = DB::table($table)
                    ->when(gettype($column) == 'string', fn ($q) => $q->where($column, $this->id))
                    ->when(gettype($column) == 'array', fn ($q) => $q->where(function ($q) use ($column) {
                        foreach ($column as $i => $dt) {
                            if (!$i)
                                $q->where($dt, $this->id);
                            else
                                $q->orWhere($dt, $this->id);
                        }
                    }))
                    ->when($func, $func ? $func : function ($q) {
                    })
                    ->first() ? true : false;
            }

            $i++;
        } while (count($relations) > $i && !$result);


        return $action ? false : $result;
    }
}
