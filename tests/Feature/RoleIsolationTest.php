<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class RoleIsolationTest extends TestCase
{
    use RefreshDatabase;

    public function test_candidate_cannot_access_employer_workspace(): void
    {
        $candidate = User::factory()->candidate()->create();

        $this->actingAs($candidate)->get('/workspace')->assertForbidden();
    }

    public function test_employer_can_access_workspace(): void
    {
        $employer = User::factory()->employer()->create();

        $this->actingAs($employer)->get('/workspace')->assertOk();
    }

    public function test_candidate_cannot_create_organization(): void
    {
        $candidate = User::factory()->candidate()->create();

        $this->actingAs($candidate)->postJson('/organizations', ['name' => 'Bad Corp'])->assertForbidden();
    }

    public function test_employer_can_create_organization(): void
    {
        $employer = User::factory()->employer()->create();

        $this->actingAs($employer)->postJson('/organizations', ['name' => 'Good Corp'])->assertCreated();
    }

    public function test_employer_cannot_access_cv_upload_page(): void
    {
        $employer = User::factory()->employer()->create();

        $this->actingAs($employer)->get('/cv-upload')->assertForbidden();
    }

    public function test_employer_cannot_upload_cv(): void
    {
        $employer = User::factory()->employer()->create();

        $file = UploadedFile::fake()->createWithContent('cv.pdf', "%PDF-1.4\ncontent");

        $this->actingAs($employer)->postJson('/cv-documents', ['file' => $file])->assertForbidden();
    }

    public function test_candidate_can_access_cv_upload_page(): void
    {
        $candidate = User::factory()->candidate()->create();

        $this->actingAs($candidate)->get('/cv-upload')->assertOk();
    }

    public function test_employer_is_redirected_from_public_job_browse(): void
    {
        $employer = User::factory()->employer()->create();

        $this->actingAs($employer)->get('/jobs')->assertRedirect('/dashboard');
    }

    public function test_candidate_and_guest_can_browse_jobs(): void
    {
        $candidate = User::factory()->candidate()->create();

        $this->get('/jobs')->assertOk();
        $this->actingAs($candidate)->get('/jobs')->assertOk();
    }
}
