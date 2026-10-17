<?php

namespace App\Http\Controllers;

use App\Jobs\ScanCvDocument;
use App\Models\CvDocument;
use App\Support\Audit;
use App\Support\DocumentInspector;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class CvDocumentController extends Controller
{
    public function page(Request $request): Response
    {
        $document = CvDocument::query()
            ->where('user_id', $request->user()->id)
            ->where('expires_at', '>', now())
            ->latest('id')
            ->first();

        return Inertia::render('cv-upload', [
            'current' => $document ? $this->payload($document) : null,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate(['file' => 'required|file|extensions:pdf,docx|max:5120']);

        $file = $request->file('file');
        abort_unless($file instanceof UploadedFile, 422);

        $problem = DocumentInspector::problem($file);

        if ($problem !== null) {
            throw ValidationException::withMessages(['file' => [$problem]]);
        }

        $userId = $request->user()->id;

        $path = Storage::disk('local')->putFileAs(
            'cv/quarantine',
            $file,
            Str::uuid().'.'.strtolower($file->getClientOriginalExtension())
        );
        abort_if($path === false, 500, 'The file could not be stored.');

        CvDocument::query()
            ->where('user_id', $userId)
            ->get()
            ->each(function (CvDocument $old) use ($userId): void {
                Storage::disk('local')->delete($old->storage_path);
                Audit::record('cv.replaced', $userId, $old);
                $old->delete();
            });

        $document = CvDocument::create([
            'user_id' => $userId,
            'original_name' => $file->getClientOriginalName(),
            'mime' => $file->getMimeType(),
            'size' => $file->getSize(),
            'sha256' => hash_file('sha256', $file->getRealPath()),
            'storage_path' => $path,
            'status' => 'quarantined',
            'expires_at' => now()->addHours(24),
        ]);

        Audit::record('cv.uploaded', $userId, $document, [
            'size' => $document->size,
            'extension' => strtolower($file->getClientOriginalExtension()),
        ]);

        ScanCvDocument::dispatch($document->id);

        return response()->json($this->payload($document), 201);
    }

    public function show(Request $request, CvDocument $cvDocument): JsonResponse
    {
        abort_unless($cvDocument->user_id === $request->user()->id && ! $cvDocument->isExpired(), 404);

        return response()->json($this->payload($cvDocument));
    }

    public function destroy(Request $request, CvDocument $cvDocument): JsonResponse
    {
        abort_unless($cvDocument->user_id === $request->user()->id, 404);

        Storage::disk('local')->delete($cvDocument->storage_path);
        Audit::record('cv.deleted', $request->user()->id, $cvDocument);
        $cvDocument->delete();

        return response()->json(null, 204);
    }

    /** @return array<string, mixed> */
    private function payload(CvDocument $document): array
    {
        return [
            'id' => $document->id,
            'original_name' => $document->original_name,
            'status' => $document->status,
            'failure_reason' => $document->failure_reason,
            'expires_at' => $document->expires_at,
        ];
    }
}
