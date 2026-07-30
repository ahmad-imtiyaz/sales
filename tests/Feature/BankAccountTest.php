<?php

use App\Models\BankAccount;
use App\Models\Company;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
    $this->company = Company::factory()->create();
});

test('bank account index page loads successfully', function () {
    BankAccount::factory()->count(3)->create(['company_id' => $this->company->id]);

    $response = $this->get(route('bank-accounts.index'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('bank-accounts/index'));
});

test('bank account can be created', function () {
    $bankAccountData = [
        'company_id' => $this->company->id,
        'nama_bank' => 'BRI',
        'nomor_rekening' => '0563-01-000400-30-3',
        'atas_nama' => 'CV Agus Jaya',
        'status' => true,
    ];

    $response = $this->postWithCsrf(route('bank-accounts.store'), $bankAccountData);

    $response->assertRedirect(route('bank-accounts.index'));
    $this->assertDatabaseHas('bank_accounts', $bankAccountData);
});

test('bank account can be updated', function () {
    $bankAccount = BankAccount::factory()->create([
        'company_id' => $this->company->id,
        'nama_bank' => 'BRI',
    ]);

    $response = $this->putWithCsrf(route('bank-accounts.update', $bankAccount), [
        'company_id' => $this->company->id,
        'nama_bank' => 'BCA',
        'nomor_rekening' => '123456789',
        'atas_nama' => 'CV Agus Jaya',
        'status' => false,
    ]);

    $response->assertRedirect(route('bank-accounts.index'));
    $this->assertDatabaseHas('bank_accounts', [
        'id' => $bankAccount->id,
        'nama_bank' => 'BCA',
        'status' => false,
    ]);
});

test('bank account can be deleted', function () {
    $bankAccount = BankAccount::factory()->create(['company_id' => $this->company->id]);

    $response = $this->deleteWithCsrf(route('bank-accounts.destroy', $bankAccount));

    $response->assertRedirect(route('bank-accounts.index'));
    $this->assertDatabaseMissing('bank_accounts', ['id' => $bankAccount->id]);
});

test('bank account validation requires company_id', function () {
    $response = $this->postWithCsrf(route('bank-accounts.store'), [
        'company_id' => '',
    ]);

    $response->assertSessionHasErrors('company_id');
});

test('bank account validation requires nama_bank', function () {
    $response = $this->postWithCsrf(route('bank-accounts.store'), [
        'nama_bank' => '',
    ]);

    $response->assertSessionHasErrors('nama_bank');
});

test('bank account validation requires nomor_rekening', function () {
    $response = $this->postWithCsrf(route('bank-accounts.store'), [
        'nomor_rekening' => '',
    ]);

    $response->assertSessionHasErrors('nomor_rekening');
});

test('bank account validation requires atas_nama', function () {
    $response = $this->postWithCsrf(route('bank-accounts.store'), [
        'atas_nama' => '',
    ]);

    $response->assertSessionHasErrors('atas_nama');
});
