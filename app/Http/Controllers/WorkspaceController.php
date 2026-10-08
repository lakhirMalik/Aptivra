<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WorkspaceController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('workspace', [
            'organizations' => Organization::query()
                ->whereIn('id', $user->memberships()->pluck('organization_id'))
                ->get(['id', 'name', 'status']),
            'pending' => $user->is_admin
                ? Organization::query()->where('status', 'pending')->get(['id', 'name'])
                : [],
            'isAdmin' => (bool) $user->is_admin,
        ]);
    }
}
