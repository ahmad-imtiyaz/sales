<?php

use App\Models\Customer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('customer index page loads successfully', function () {
    Customer::factory()->count(3)->create();

    $response = $this->get(route('customers.index'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('customers/index'));
});

test('customer can be created', function () {
    $customerData = [
        'nama' => 'PT Test Customer',
        'alamat' => 'Jl. Test No. 123',
        'kota' => 'Jakarta',
        'pic' => 'John Doe',
        'telepon' => '021-1234567',
        'email' => 'john@test.com',
    ];

    $response = $this->post(route('customers.store'), $customerData);

    $response->assertRedirect(route('customers.index'));
    $this->assertDatabaseHas('customers', $customerData);
});

test('customer can be updated', function () {
    $customer = Customer::factory()->create([
        'nama' => 'PT Old Name',
    ]);

    $response = $this->put(route('customers.update', $customer), [
        'nama' => 'PT New Name',
        'alamat' => 'Jl. Updated No. 456',
        'kota' => 'Bandung',
        'pic' => 'Jane Smith',
        'telepon' => '022-7654321',
        'email' => 'jane@updated.com',
    ]);

    $response->assertRedirect(route('customers.index'));
    $this->assertDatabaseHas('customers', [
        'id' => $customer->id,
        'nama' => 'PT New Name',
    ]);
});

test('customer can be deleted', function () {
    $customer = Customer::factory()->create();

    $response = $this->delete(route('customers.destroy', $customer));

    $response->assertRedirect(route('customers.index'));
    $this->assertDatabaseMissing('customers', ['id' => $customer->id]);
});

test('customer validation requires nama', function () {
    $response = $this->post(route('customers.store'), [
        'nama' => '',
    ]);

    $response->assertSessionHasErrors('nama');
});

test('customer validation requires valid email', function () {
    $response = $this->post(route('customers.store'), [
        'nama' => 'PT Test',
        'email' => 'invalid-email',
    ]);

    $response->assertSessionHasErrors('email');
});
