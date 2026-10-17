<?php

namespace App\Observers;

use App\Models\CvDocument;
use App\Models\User;
use App\Support\Audit;
use Illuminate\Support\Facades\Storage;

class UserObserver
{
    public function deleting(User $user): void
    {
        CvDocument::query()
            ->where('user_id', $user->id)
            ->get()
            ->each(fn (CvDocument $document) => Storage::disk('local')->delete($document->storage_path));

        Audit::record('account.deleted', null, null, ['user_id' => $user->id]);
    }
}
