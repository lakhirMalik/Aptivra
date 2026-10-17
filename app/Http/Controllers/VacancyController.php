<?php

namespace App\Http\Controllers;

use App\Models\JobFamily;
use App\Models\Organization;
use App\Models\Vacancy;
use App\Support\Audit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

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

    public function publish(Request $request, Vacancy $vacancy): JsonResponse
    {
        Gate::authorize('manage', $vacancy);
        $vacancy->versions()->where('version', $vacancy->current_version)
            ->update(['published_at' => now()]);
        $vacancy->update(['status' => 'open']);
        Audit::record('vacancy.published', $request->user()->id, $vacancy);

        return response()->json($vacancy->fresh());
    }

    public function close(Request $request, Vacancy $vacancy): JsonResponse
    {
        Gate::authorize('manage', $vacancy);
        $vacancy->update(['status' => 'closed']);
        Audit::record('vacancy.closed', $request->user()->id, $vacancy);

        return response()->json($vacancy->fresh());
    }

    public function publicIndex(Request $request): Response|RedirectResponse
    {
        $user = $request->user();
        if ($user !== null && $user->isEmployer() && ! $user->is_admin) {
            return redirect()->route('dashboard');
        }

        $query = Vacancy::query()
            ->where('status', 'open')
            ->with(['organization:id,name', 'jobFamily:id,name,slug', 'versions']);

        if ($request->filled('family')) {
            $slug = (string) $request->query('family');
            $query->whereHas('jobFamily', fn ($q) => $q->where('slug', $slug));
        }

        $vacancies = $query->latest('id')->get()->map(function (Vacancy $v): array {
            $current = $v->versions->firstWhere('version', $v->current_version);

            return [
                'id' => $v->id,
                'organization' => $v->organization?->name,
                'job_family' => $v->jobFamily?->name,
                'job_family_slug' => $v->jobFamily?->slug,
                'title' => $current?->title,
                'description' => $current?->description,
                'criteria_count' => is_array($current?->criteria) ? count($current->criteria) : 0,
                'published_at' => $current?->published_at,
            ];
        });

        return Inertia::render('jobs/index', [
            'vacancies' => $vacancies,
            'jobFamilies' => JobFamily::query()->get(['id', 'name', 'slug']),
            'selectedFamily' => $request->query('family'),
        ]);
    }

    public function publicShow(Request $request, Vacancy $vacancy): Response|RedirectResponse
    {
        $user = $request->user();
        if ($user !== null && $user->isEmployer() && ! $user->is_admin) {
            return redirect()->route('dashboard');
        }

        abort_unless($vacancy->status === 'open', 404);

        $vacancy->load(['organization:id,name', 'jobFamily:id,name,slug', 'versions']);
        $current = $vacancy->versions->firstWhere('version', $vacancy->current_version);
        abort_if($current === null, 404);

        return Inertia::render('jobs/show', [
            'vacancy' => [
                'id' => $vacancy->id,
                'organization' => $vacancy->organization?->name,
                'job_family' => $vacancy->jobFamily?->name,
                'version' => $current->version,
                'title' => $current->title,
                'description' => $current->description,
                'criteria' => $current->criteria ?? [],
                'published_at' => $current->published_at,
            ],
        ]);
    }

    public function index(Request $request, Organization $organization): Response
    {
        abort_unless(
            $request->user()->memberships()->where('organization_id', $organization->id)->exists(),
            403
        );

        $vacancies = $organization->vacancies()->with('versions')->get()->map(
            fn (Vacancy $v): array => [
                'id' => $v->id,
                'status' => $v->status,
                'title' => $v->versions->firstWhere('version', $v->current_version)?->title,
            ]
        );

        return Inertia::render('vacancies', [
            'organization' => $organization->only(['id', 'name', 'status']),
            'jobFamilies' => JobFamily::query()->get(['id', 'name']),
            'vacancies' => $vacancies,
        ]);
    }
}
