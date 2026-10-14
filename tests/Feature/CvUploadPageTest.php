<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CvUploadPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_page_requires_login(): void
    {
        $this->get('/cv-upload')->assertRedirect('/login');
        $this->actingAs(User::factory()->create())->get('/cv-upload')->assertOk();
    }
}
