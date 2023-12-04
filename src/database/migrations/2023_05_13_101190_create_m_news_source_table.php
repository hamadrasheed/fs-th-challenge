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
        Schema::create('m_news_source', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->text('description');
            $table->text('url');
            $table->string('category_code')->comment('relations to m_news_category');
            $table->foreign('category_code')->references('code')->on('m_news_category')
                ->constrained()->restrictOnUpdate()->restrictOnDelete();
            $table->string('language_code')->comment('relations to m_news_language');
            $table->foreign('language_code')->references('code')->on('m_news_language')
                ->constrained()->restrictOnUpdate()->restrictOnDelete();
            $table->string('country_code')->comment('relations to m_news_country');
            $table->foreign('country_code')->references('code')->on('m_news_country')
                ->constrained()->restrictOnUpdate()->restrictOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_news_source');
    }
};
