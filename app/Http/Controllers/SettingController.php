<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function index(): Response
    {
        $settings = Setting::whereIn('key', ['site_name', 'logo'])
            ->get()
            ->keyBy('key');

        return Inertia::render('settings/index', [
            'siteName' => $settings['site_name']->value ?? config('app.name'),
            'logo' => $settings['logo']->value ?? null,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'site_name' => ['required', 'string', 'max:255'],
            'logo' => ['nullable', 'file', 'mimes:svg,png,jpg,jpeg,gif,webp', 'max:2048'],
        ]);

        Setting::setValue('site_name', $validated['site_name']);

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('settings', 'public');
            Setting::setValue('logo', $path);
        }

        return redirect()->route('settings.index')
            ->with('success', 'Pengaturan berhasil disimpan.');
    }
}
