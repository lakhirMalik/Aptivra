<?php

namespace Tests\Feature;

use App\Models\AuditEvent;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CvAuditTest extends TestCase
{
    use RefreshDatabase;

    private function pdf(): UploadedFile
    {
        return UploadedFile::fake()->create('cv.pdf', 50, 'application/pdf');
    }

    public function test_upload_and_delete_are_audited_without_file_content(): void
    {
        Storage::fake('local');
        Queue::fake();
        $user = User::factory()->create();

        $id = $this->actingAs($user)->postJson('/cv-documents', ['file' => $this->pdf()])->json('id');
        $this->actingAs($user)->deleteJson("/cv-documents/{$id}")->assertNoContent();

        $this->assertDatabaseHas('audit_events', ['event' => 'cv.uploaded', 'user_id' => $user->id, 'subject_id' => $id]);
        $this->assertDatabaseHas('audit_events', ['event' => 'cv.deleted', 'user_id' => $user->id, 'subject_id' => $id]);

        $uploaded = AuditEvent::where('event', 'cv.uploaded')->firstOrFail();
        $this->assertSame(['size', 'extension'], array_keys($uploaded->meta ?? []));
    }

    public function test_audit_events_cannot_be_changed_or_deleted(): void
    {
        $event = AuditEvent::create(['event' => 'test.event']);

        $this->assertFalse($event->update(['event' => 'changed']));
        $this->assertFalse($event->delete());
        $this->assertDatabaseHas('audit_events', ['id' => $event->id, 'event' => 'test.event']);
    }

    public function test_uploads_are_rate_limited(): void
    {
        Storage::fake('local');
        Queue::fake();
        $user = User::factory()->create();

        for ($i = 0; $i < 10; $i++) {
            $this->actingAs($user)->postJson('/cv-documents', ['file' => $this->pdf()])->assertCreated();
        }

        $this->actingAs($user)->postJson('/cv-documents', ['file' => $this->pdf()])->assertStatus(429);
    }
}
