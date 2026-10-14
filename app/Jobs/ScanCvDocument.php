<?php

namespace App\Jobs;

use App\Models\CvDocument;
use App\Support\Audit;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Storage;
use Throwable;

class ScanCvDocument implements ShouldQueue
{
    use Queueable;

    public int $tries = 1;

    public function __construct(public int $documentId) {}

    public function handle(): void
    {
        $document = CvDocument::find($this->documentId);

        if ($document === null) {
            return;
        }

        $disk = Storage::disk('local');
        $quarantinePath = $document->storage_path;

        if ($document->isExpired()) {
            $this->discard($document);

            return;
        }

        $document->update(['status' => 'scanning']);

        $code = $this->scan($disk->path($quarantinePath));

        $current = CvDocument::find($this->documentId);

        if ($current === null) {
            $disk->delete($quarantinePath);

            return;
        }

        if ($current->isExpired()) {
            $this->discard($current);

            return;
        }

        if ($code === 0) {
            $cleanPath = 'cv/clean/'.basename($quarantinePath);
            $disk->move($quarantinePath, $cleanPath);
            $current->update(['status' => 'clean', 'storage_path' => $cleanPath]);
            Audit::record('cv.scan_clean', $current->user_id, $current);
        } elseif ($code === 1) {
            $disk->delete($quarantinePath);
            $current->update([
                'status' => 'infected',
                'storage_path' => '',
                'failure_reason' => 'Malware was detected, so the file was deleted.',
            ]);
            Audit::record('cv.scan_infected', $current->user_id, $current);
        } else {
            $current->update([
                'status' => 'scan_unavailable',
                'failure_reason' => 'The scanner was unavailable. The file was not treated as safe.',
            ]);
            Audit::record('cv.scan_unavailable', $current->user_id, $current);
        }
    }

    private function discard(CvDocument $document): void
    {
        Storage::disk('local')->delete($document->storage_path);
        Audit::record('cv.expired_removed', $document->user_id, $document);
        $document->delete();
    }

    private function scan(string $path): int
    {
        try {
            return Process::timeout(120)->run(['clamscan', '--no-summary', $path])->exitCode() ?? 2;
        } catch (Throwable) {
            return 2;
        }
    }
}
