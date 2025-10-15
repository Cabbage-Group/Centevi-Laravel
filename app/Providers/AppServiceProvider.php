<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Observers\AuditObserver;
use Illuminate\Support\Facades\Event;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        $observer = new AuditObserver();
        
        Event::listen('eloquent.created: *', function ($event, $data) use ($observer) {
            $observer->created($data[0]);
        });
      
        Event::listen('eloquent.updated: *', function ($event, $data) use ($observer) {
            $observer->updated($data[0]);
        });
      
        Event::listen('eloquent.deleted: *', function ($event, $data) use ($observer) {
            $observer->deleted($data[0]);
        });
    }
}
