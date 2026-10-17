<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use ZipArchive;

class DocumentInspector
{
    public static function problem(UploadedFile $file): ?string
    {
        $path = $file->getRealPath();

        if (strtolower($file->getClientOriginalExtension()) === 'pdf') {
            return file_get_contents($path, false, null, 0, 5) === '%PDF-' ? null : 'This file is not a valid PDF.';
        }

        $invalid = 'This file is not a valid DOCX document.';
        $zip = new ZipArchive;

        if ($zip->open($path) !== true) {
            return $invalid;
        }

        try {
            if ($zip->locateName('[Content_Types].xml') === false || $zip->locateName('word/document.xml') === false) {
                return $invalid;
            }

            if ($zip->locateName('word/vbaProject.bin') !== false) {
                return 'Documents with macros are not supported. Save a copy without macros and upload that.';
            }
        } finally {
            $zip->close();
        }

        return null;
    }
}
