<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->command('anticipos:sincronizar-recientes')
            ->dailyAt('06:00')
            ->timezone('America/Panama');

        $schedule->command('anticipos:sincronizar-recientes')
            ->dailyAt('20:00')
            ->timezone('America/Panama');
    }

    /**
     * Register the commands for the application.
     */
    protected function commands()
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}