<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        Setting::updateOrCreate(
            ['key' => 'site_name'],
            [
                'key' => 'site_name',
                'value' => 'CV Agus Jaya',
                'type' => 'string',
                'label' => 'Nama Website',
                'description' => 'Nama yang ditampilkan di login dan sidebar',
            ]
        );

        Setting::updateOrCreate(
            ['key' => 'logo'],
            [
                'key' => 'logo',
                'value' => null,
                'type' => 'file',
                'label' => 'Logo Website',
                'description' => 'Logo untuk login dan sidebar (opsional)',
            ]
        );
    }
}