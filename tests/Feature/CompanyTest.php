<?php

use App\Models\Company;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('company index page loads successfully', function () {
    Company::factory()->count(3)->create();

    $response = $this->get(route('companies.index'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('companies/index'));
});

test('company can be created', function () {
    $companyData = [
        'nama' => 'CV Test Company',
        'alamat' => 'Jl. Test No. 123',
        'telepon' => '021-1234567',
        'email' => 'test@company.com',
        'logo' => null,
    ];

    $response = $this->postWithCsrf(route('companies.store'), $companyData);

    $response->assertRedirect(route('companies.index'));
    $this->assertDatabaseHas('companies', $companyData);
});

test('company can be updated', function () {
    $company = Company::factory()->create([
        'nama' => 'CV Old Name',
    ]);

    $response = $this->putWithCsrf(route('companies.update', $company), [
        'nama' => 'CV New Name',
        'alamat' => 'Jl. Updated No. 456',
        'telepon' => '021-7654321',
        'email' => 'updated@company.com',
    ]);

    $response->assertRedirect(route('companies.index'));
    $this->assertDatabaseHas('companies', [
        'id' => $company->id,
        'nama' => 'CV New Name',
    ]);
});

test('company can be deleted', function () {
    $company = Company::factory()->create();

    $response = $this->deleteWithCsrf(route('companies.destroy', $company));

    $response->assertRedirect(route('companies.index'));
    $this->assertDatabaseMissing('companies', ['id' => $company->id]);
});

test('company validation requires nama', function () {
    $response = $this->postWithCsrf(route('companies.store'), [
        'nama' => '',
    ]);

    $response->assertSessionHasErrors('nama');
});

test('company validation requires valid email', function () {
    $response = $this->postWithCsrf(route('companies.store'), [
        'nama' => 'CV Test',
        'email' => 'invalid-email',
    ]);

    $response->assertSessionHasErrors('email');
});
