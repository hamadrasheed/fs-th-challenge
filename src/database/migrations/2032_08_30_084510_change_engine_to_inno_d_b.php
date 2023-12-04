<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //for testing
        if (DB::connection()->getPDO()->getAttribute(PDO::ATTR_DRIVER_NAME) == 'mysql')

            for ($i = 0; $i < collect(DB::select('SHOW TABLES'))->count(); $i++) {
                $table = (string) (property_exists(DB::select('SHOW TABLES')[$i], "Tables_in_" . env('DB_DATABASE')) && (string)DB::select('SHOW TABLES')[$i]->{"Tables_in_" . env('DB_DATABASE')} ?
                    DB::select('SHOW TABLES')[$i]->{"Tables_in_" . env('DB_DATABASE')} :
                    DB::select('SHOW TABLES')[$i]->Tables_in_bdg_test);
                DB::statement('ALTER TABLE ' . $table . ' ENGINE = InnoDB');
            }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (DB::connection()->getPDO()->getAttribute(PDO::ATTR_DRIVER_NAME) == 'mysql')

            for ($i = 0; $i < collect(DB::select('SHOW TABLES'))->count(); $i++) {
                $table = (string) (property_exists(DB::select('SHOW TABLES')[$i], "Tables_in_" . env('DB_DATABASE')) && (string)DB::select('SHOW TABLES')[$i]->{"Tables_in_" . env('DB_DATABASE')} ?
                    DB::select('SHOW TABLES')[$i]->{"Tables_in_" . env('DB_DATABASE')} :
                    DB::select('SHOW TABLES')[$i]->Tables_in_bdg_test);
                DB::statement('ALTER TABLE ' . $table . ' ENGINE = MyISAM');
            }
    }
};
