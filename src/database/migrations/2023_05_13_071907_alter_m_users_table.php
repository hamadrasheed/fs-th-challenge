<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('m_users', function (Blueprint $table) {
            $table->string('role_code', 12)->after('password');
            $table->foreign('role_code')->references('code')->on('m_user_roles')
                ->constrained()->restrictOnUpdate()->restrictOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('m_users', function (Blueprint $table) {
            $table->dropColumn('role_code');
        });
    }
};
