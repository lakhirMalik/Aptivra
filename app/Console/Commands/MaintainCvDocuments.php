<?php

namespace App\Console\Commands;

use App\Models\CvDocument;
use App\Support\Audit;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class MaintainCvDocuments extends Command
{
    protected $signature = 'cv:maintain';

    protected $description = 'Purge expired CVs, fail stuck scans and remove orphaned files';

    public function handle(): int
    {
        $this->call('cv:purge-expired');

        $stuck = CvDocument::query()
            ->whereIn('status', ['quarantined', 'scanning'])
            ->where('updated_at', '<', now()->subMinutes(15))
            ->get();

        foreach ($stuck as $document) {
            $document->update([
                'status' => 'scan_unavailable',
                'failure_reason' => 'Scanning did not finish. The file was not treated as safe. Please upload it again.',
            ]);
            Audit::record('cv.scan_timeout', $document->user_id, $document);
        }

        $disk = Storage::disk('local');
        $known = CvDocument::query()->pluck('storage_path')->all();
        $orphans = 0;

        foreach (array_merge($disk->files('cv/quarantine'), $disk->files('cv/clean')) as $file) {
            if (! in_array($file, $known, true) && $disk->lastModified($file) < now()->subHour()->getTimestamp()) {
                $disk->delete($file);
                $orphans++;
            }
        }

        $this->info("Failed {$stuck->count()} stuck scan(s), removed {$orphans} orphaned file(s).");

        return self::SUCCESS;
    }
}
