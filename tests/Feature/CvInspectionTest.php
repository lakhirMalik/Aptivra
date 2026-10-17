<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use ZipArchive;

class CvInspectionTest extends TestCase
{
    use RefreshDatabase;

    private function docx(bool $macro): UploadedFile
    {
        $path = tempnam(sys_get_temp_dir(), 'docx');
        $zip = new ZipArchive;
        $zip->open($path, ZipArchive::CREATE | ZipArchive::OVERWRITE);
        $zip->addFromString('[Content_Types].xml', '<Types/>');
        $zip->addFromString('word/document.xml', '<document/>');

        if ($macro) {
            $zip->addFromString('word/vbaProject.bin', 'macro');
        }

        $zip->close();

        return new UploadedFile($path, 'cv.docx', null, null, true);
    }

    public function test_invalid_and_macro_documents_are_rejected(): void
    {
        Storage::fake('local');
        Queue::fake();
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson('/cv-documents', ['file' => UploadedFile::fake()->createWithContent('fake.pdf', 'not a pdf')])
            ->assertUnprocessable()->assertJsonValidationErrors('file');

        $this->actingAs($user)->postJson('/cv-documents', ['file' => $this->docx(true)])
            ->assertUnprocessable()->assertJsonValidationErrors('file');

        $this->actingAs($user)->postJson('/cv-documents', ['file' => $this->docx(false)])->assertCreated();
        $this->assertDatabaseCount('cv_documents', 1);
    }
}
