<?php

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('product index page loads successfully', function () {
    Product::factory()->count(3)->create();

    $response = $this->get(route('products.index'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('products/index'));
});

test('product can be created', function () {
    $productData = [
        'kode' => 'BRG-TEST',
        'nama_barang' => 'Produk Test',
        'satuan' => 'Unit',
        'harga' => 100000,
    ];

    $response = $this->postWithCsrf(route('products.store'), $productData);

    $response->assertRedirect(route('products.index'));
    $this->assertDatabaseHas('products', $productData);
});

test('product can be updated', function () {
    $product = Product::factory()->create([
        'kode' => 'BRG-OLD',
        'nama_barang' => 'Produk Lama',
    ]);

    $response = $this->putWithCsrf(route('products.update', $product), [
        'kode' => 'BRG-NEW',
        'nama_barang' => 'Produk Baru',
        'satuan' => 'Pcs',
        'harga' => 200000,
    ]);

    $response->assertRedirect(route('products.index'));
    $this->assertDatabaseHas('products', [
        'id' => $product->id,
        'kode' => 'BRG-NEW',
        'nama_barang' => 'Produk Baru',
    ]);
});

test('product can be deleted', function () {
    $product = Product::factory()->create();

    $response = $this->deleteWithCsrf(route('products.destroy', $product));

    $response->assertRedirect(route('products.index'));
    $this->assertDatabaseMissing('products', ['id' => $product->id]);
});

test('product validation requires kode', function () {
    $response = $this->postWithCsrf(route('products.store'), [
        'kode' => '',
    ]);

    $response->assertSessionHasErrors('kode');
});

test('product validation requires nama_barang', function () {
    $response = $this->postWithCsrf(route('products.store'), [
        'nama_barang' => '',
    ]);

    $response->assertSessionHasErrors('nama_barang');
});

test('product validation requires satuan', function () {
    $response = $this->postWithCsrf(route('products.store'), [
        'satuan' => '',
    ]);

    $response->assertSessionHasErrors('satuan');
});

test('product validation requires harga', function () {
    $response = $this->postWithCsrf(route('products.store'), [
        'harga' => '',
    ]);

    $response->assertSessionHasErrors('harga');
});

test('product validation requires harga to be numeric', function () {
    $response = $this->postWithCsrf(route('products.store'), [
        'harga' => 'abc',
    ]);

    $response->assertSessionHasErrors('harga');
});
