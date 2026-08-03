<?php

use App\Providers\AppServiceProvider;
use App\Providers\FortifyServiceProvider;
use Tightenco\Ziggy\ZiggyServiceProvider;

return [
    AppServiceProvider::class,
    FortifyServiceProvider::class,
    ZiggyServiceProvider::class,
];
