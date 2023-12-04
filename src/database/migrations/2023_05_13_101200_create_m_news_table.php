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
        Schema::create('m_news', function (Blueprint $table) {
            $table->id();
            $table->string('source_code')->nullable()->comment('relations to m_news_source');
            $table->foreign('source_code')->references('code')->on('m_news_source')
                ->constrained()->restrictOnUpdate()->restrictOnDelete();
            $table->string('author_code')->nullable()->comment('relations to m_news_author');
            $table->foreign('author_code')->references('code')->on('m_news_author')
                ->constrained()->restrictOnUpdate()->restrictOnDelete();
            $table->text('title');
            $table->string('permalink', 500)->unique();
            $table->text('description')->nullable();
            $table->text('url')->nullable();
            $table->text('url_to_image')->nullable();
            $table->timestamp('published_at');
            $table->text('content')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_news');
    }
};
