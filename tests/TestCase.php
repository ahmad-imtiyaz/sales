<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        
        // Visit login page to establish session with CSRF token
        $this->get('/login');
    }

    /**
     * Make a POST request with CSRF token
     */
    protected function postWithCsrf($uri, array $data = [], array $headers = [])
    {
        $token = $this->getCsrfToken();
        
        return $this->withHeaders([
            'X-CSRF-TOKEN' => $token,
            'X-Requested-With' => 'XMLHttpRequest',
        ])->post($uri, $data, $headers);
    }

    /**
     * Make a PUT request with CSRF token
     */
    protected function putWithCsrf($uri, array $data = [], array $headers = [])
    {
        $token = $this->getCsrfToken();
        
        return $this->withHeaders([
            'X-CSRF-TOKEN' => $token,
            'X-Requested-With' => 'XMLHttpRequest',
        ])->put($uri, $data, $headers);
    }

    /**
     * Make a DELETE request with CSRF token
     */
    protected function deleteWithCsrf($uri, array $headers = [])
    {
        $token = $this->getCsrfToken();
        
        return $this->withHeaders([
            'X-CSRF-TOKEN' => $token,
            'X-Requested-With' => 'XMLHttpRequest',
        ])->delete($uri, [], $headers);
    }

    /**
     * Get CSRF token from session
     */
    protected function getCsrfToken(): string
    {
        return session()->token();
    }
}