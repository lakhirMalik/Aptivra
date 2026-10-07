<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrganizationController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate(['name' => 'required|string|max:150']);

        $organization = DB::transaction(function () use ($request, $data) {
            $org = Organization::create(['name' => $data['name']]);
            $org->memberships()->create(['user_id' => $request->user()->id, 'role' => 'owner']);

            return $org;
        });

        return response()->json($organization, 201);
    }

    public function approve(Request $request, Organization $organization): JsonResponse
    {
        abort_unless($request->user()->is_admin, 403);
        $organization->update(['status' => 'approved']);

        return response()->json($organization);
    }
}
