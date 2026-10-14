<?php

namespace App\Http\Controllers;

use App\Jobs\ScanCvDocument;
use App\Models\CvDocument;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CvDocumentController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $request->validate(['file' => 'required|file|mimes:pdf,docx|max:5120']);

        $file = $request->file('file');
        abort_unless($file instanceof UploadedFile, 422);

        $path = Storage::disk('local')->putFileAs(
            'cv/quarantine',
            $file,
            Str::uuid().'.'.strtolower($file->getClientOriginalExtension())
        );
        abort_if($path === false, 500, 'The file could not be stored.');

        $document = CvDocument::create([
            'user_id' => $request->user()->id,
            'original_name' => $file->getClientOriginalName(),
            'mime' => $file->getMimeType(),
            'size' => $file->getSize(),
            'sha256' => hash_file('sha256', $file->getRealPath()),
            'storage_path' => $path,
            'expires_at' => now()->addHours(24),
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
