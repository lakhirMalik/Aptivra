<?php

namespace App\Http\Controllers;

use App\Models\CvDocument;
use App\Models\JobFamily;
use App\Models\Organization;
use App\Models\Vacancy;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $isEmployer = $user->isEmployer();

        if ($isEmployer) {
            $organizations = Organization::query()
                ->whereIn('id', $user->memberships()->pluck('organization_id'))
                ->withCount('vacancies')
                ->get(['id', 'name', 'status']);

            $pendingCount = $user->is_admin
                ? Organization::query()->where('status', 'pending')->count()
                : null;

            return Inertia::render('dashboard', [
                'accountType' => 'employer',
                'isEmployer' => true,
                'organizations' => $organizations,
                'pendingCount' => $pendingCount,
                'cvDocument' => null,
                'recentJobs' => [],
                'jobFamilies' => [],
            ]);
        }

        // Candidate payload
        $cvDocument = CvDocument::query()
            ->where('user_id', $user->id)
            ->where('expires_at', '>', now())
            ->latest('id')
            ->first();

        $recentJobs = Vacancy::query()
            ->where('status', 'open')
            ->with(['organization:id,name', 'jobFamily:id,name,slug', 'versions'])
            ->latest('id')
            ->take(3)
            ->get()
            ->map(function (Vacancy $v): array {
                $current = $v->versions->firstWhere('version', $v->current_version);

                return [
                    'id' => $v->id,
                    'organization' => $v->organization?->name,
                    'job_family' => $v->jobFamily?->name,
                    'title' => $current?->title,
                    'criteria_count' => is_array($current?->criteria) ? count($current->criteria) : 0,
                    'published_at' => $current?->published_at,
                ];
            });

        $jobFamilies = JobFamily::query()->get(['id', 'name', 'slug']);

        return Inertia::render('dashboard', [
            'accountType' => 'candidate',
            'isEmployer' => false,
            'organizations' => [],
            'pendingCount' => null,
            'cvDocument' => $cvDocument ? [
                'id' => $cvDocument->id,
                'original_name' => $cvDocument->original_name,
                'status' => $cvDocument->status,
                'failure_reason' => $cvDocument->failure_reason,
                'expires_at' => $cvDocument->expires_at,
            ] : null,
            'recentJobs' => $recentJobs,
            'jobFamilies' => $jobFamilies,
        ]);
    }
}
