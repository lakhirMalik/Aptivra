<?php

namespace App\Console\Commands;

use App\Models\CvDocument;
use App\Support\Audit;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class PurgeExpiredCvDocuments extends Command
{
    protected $signature = 'cv:purge-expired';

    protected $description = 'Delete expired CV files and their records';

    public function handle(): int
    {
        $documents = CvDocument::query()->where('expires_at', '<=', now())->get();

        foreach ($documents as $document) {
            Storage::disk('local')->delete($document->storage_path);
            Audit::record('cv.expired_purged', $document->user_id, $document);
            $document->delete();
        }

        $this->info("Purged {$documents->count()} expired document(s).");

        return self::SUCCESS;
    }
}
