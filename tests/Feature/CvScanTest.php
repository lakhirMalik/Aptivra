<?php

namespace Tests\Feature;

use App\Jobs\ScanCvDocument;
use App\Models\CvDocument;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CvScanTest extends TestCase
{
    use RefreshDatabase;

    private function upload(User $user): int
    {
        return $this->actingAs($user)
            ->postJson('/cv-documents', ['file' => UploadedFile::fake()->create('cv.pdf', 50, 'application/pdf')])
            ->assertCreated()->json('id');
    }

    public function test_scan_outcomes(): void
    {
        Storage::fake('local');
        Queue::fake();
        $user = User::factory()->create();

        $clean = $this->upload($user);
        Queue::assertPushed(ScanCvDocument::class);
        Process::fake(fn () => Process::result(exitCode: 0));
        (new ScanCvDocument($clean))->handle();
        $document = CvDocument::findOrFail($clean);
        $this->assertSame('clean', $document->status);
        Storage::disk('local')->assertExists($document->storage_path);

        $infected = $this->upload($user);
        $quarantined = CvDocument::findOrFail($infected)->storage_path;
        Process::fake(fn () => Process::result(exitCode: 1));
        (new ScanCvDocument($infected))->handle();
        $this->assertSame('infected', CvDocument::findOrFail($infected)->status);
        Storage::disk('local')->assertMissing($quarantined);

        $unavailable = $this->upload($user);
        Process::fake(fn () => Process::result(exitCode: 127));
        (new ScanCvDocument($unavailable))->handle();
        $document = CvDocument::findOrFail($unavailable);
        $this->assertSame('scan_unavailable', $document->status);
        Storage::disk('local')->assertExists($document->storage_path);
    }

    public function test_late_worker_removes_expired_document(): void
    {
        Storage::fake('local');
        Queue::fake();
        $id = $this->upload(User::factory()->create());
        $path = CvDocument::findOrFail($id)->storage_path;

        $this->travel(25)->hours();
        Process::fake(fn () => Process::result(exitCode: 0));
        (new ScanCvDocument($id))->handle();

        $this->assertDatabaseMissing('cv_documents', ['id' => $id]);
        Storage::disk('local')->assertMissing($path);
    }
}
