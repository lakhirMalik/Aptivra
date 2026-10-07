<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Models\Vacancy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class VacancyController extends Controller
{
    /** @return array<string, mixed> */
    private function rules(): array
    {
        return [
            'title' => 'required|string|max:150',
            'description' => 'required|string|max:10000',
            'criteria' => 'required|array|min:1|max:30',
            'criteria.*.text' => 'required|string|max:300',
            'criteria.*.type' => 'required|in:required,preferred',
        ];
    }

    /** @param array<string, mixed> $data */
    private function addVersion(Vacancy $vacancy, array $data): void
    {
        $n = $vacancy->current_version + 1;
        $vacancy->versions()->create([
            'version' => $n,
            'title' => $data['title'],
            'description' => $data['description'],
            'criteria' => $data['criteria'],
        ]);
        $vacancy->update(['current_version' => $n]);
    }

    public function store(Request $request, Organization $organization): JsonResponse
    {
        $isStaff = $request->user()->memberships()
            ->where('organization_id', $organization->id)
            ->whereIn('role', ['owner', 'recruiter'])->exists();
        abort_unless($isStaff && $organization->status === 'approved', 403);

        $data = $request->validate($this->rules() + ['job_family_id' => 'required|exists:job_families,id']);

        $vacancy = DB::transaction(function () use ($organization, $data) {
            $v = $organization->vacancies()->create(['job_family_id' => $data['job_family_id']]);
            $this->addVersion($v, $data);

            return $v;
        });

        return response()->json($vacancy->load('versions'), 201);
    }

    public function update(Request $request, Vacancy $vacancy): JsonResponse
    {
        Gate::authorize('manage', $vacancy);
        $this->addVersion($vacancy, $request->validate($this->rules()));

        return response()->json($vacancy->load('versions'));
    }

    public function publish(Vacancy $vacancy): JsonResponse
    {
        Gate::authorize('manage', $vacancy);
        $vacancy->versions()->where('version', $vacancy->current_version)
            ->update(['published_at' => now()]);
        $vacancy->update(['status' => 'open']);

        return response()->json($vacancy->fresh());
    }
}
