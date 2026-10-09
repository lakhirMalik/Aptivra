<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('dashboard', [
            'organizations' => Organization::query()
                ->whereIn('id', $user->memberships()->pluck('organization_id'))
                ->withCount('vacancies')
                ->get(['id', 'name', 'status']),
            'pendingCount' => $user->is_admin
                ? Organization::query()->where('status', 'pending')->count()
                : null,
        ]);
    }
}
