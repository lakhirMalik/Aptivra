<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CvUploadPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_page_requires_login(): void
    {
        $this->get('/cv-upload')->assertRedirect('/login');
        $this->actingAs(User::factory()->create())->get('/cv-upload')->assertOk();
    }

    public function test_uploaded_cv_is_still_shown_when_the_page_is_opened_again(): void
    {
        Storage::fake('local');
        Queue::fake();
        $user = User::factory()->create();

        $this->actingAs($user)->get('/cv-upload')->assertInertia(fn (Assert $page) => $page->where('current', null));

        $id = $this->actingAs($user)
            ->postJson('/cv-documents', ['file' => UploadedFile::fake()->create('cv.pdf', 50, 'application/pdf')])
            ->json('id');

        $this->actingAs($user)->get('/cv-upload')->assertInertia(fn (Assert $page) => $page
            ->where('current.id', $id)
            ->where('current.original_name', 'cv.pdf'));

        $this->actingAs(User::factory()->create())->get('/cv-upload')->assertInertia(fn (Assert $page) => $page->where('current', null));
    }
}
