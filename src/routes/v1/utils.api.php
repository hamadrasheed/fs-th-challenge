<?php

use App\Http\Controllers\api\utils\OptionController;
use Illuminate\Support\Facades\Route;

Route::name('utils.')->prefix('utils')->group(function (): void {
    Route::controller(OptionController::class)->group(function (): void {
        Route::name('news.')->prefix('news')->group(function(): void {
            Route::get('category', 'newsCategory')->name('category');
            Route::get('language', 'newsLanguage')->name('language');
            Route::get('country', 'newsCountry')->name('country');
            Route::get('source', 'newsSource')->name('source');
            Route::get('author', 'newsAuthor')->name('author');
        });
        Route::get('gender', 'gender')->name('gender');
    });
});
