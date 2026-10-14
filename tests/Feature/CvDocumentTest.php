<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CvDocumentTest extends TestCase
{
    use RefreshDatabase;

    public function test_upload_is_private_and_expires(): void
    {
        Storage::fake('local');
        $owner = User::factory()->create();
        $other = User::factory()->create();

        $id = $this->actingAs($owner)
            ->postJson('/cv-documents', ['file' => UploadedFile::fake()->create('cv.pdf', 100, 'application/pdf')])
            ->assertCreated()->assertJsonPath('status', 'quarantined')->json('id');

        $this->actingAs($owner)->getJson("/cv-documents/{$id}")->assertOk();
        $this->actingAs($other)->getJson("/cv-documents/{$id}")->assertNotFound();
        $this->actingAs($owner)
            ->postJson('/cv-documents', ['file' => UploadedFile::fake()->create('cv.exe', 10)])
            ->assertUnprocessable();

        $this->travel(25)->hours();
        $this->actingAs($owner)->getJson("/cv-documents/{$id}")->assertNotFound();

        $this->artisan('cv:purge-expired')->assertSuccessful();
        $this->assertDatabaseMissing('cv_documents', ['id' => $id]);
    }
}
