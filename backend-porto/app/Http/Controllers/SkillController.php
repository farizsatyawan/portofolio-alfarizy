<?php

namespace App\Http\Controllers;

use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SkillController extends Controller
{
    /**
     * Display a listing of skills/certifications.
     */
    public function index()
    {
        $skills = Skill::orderBy('category')->orderBy('name')->get();

        return response()->json([
            'success' => true,
            'data'    => $skills,
        ]);
    }

    /**
     * Store a newly created certification.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'            => 'required|string|max:255',
            'issuer'          => 'nullable|string|max:255',
            'category'        => 'required|string|max:255',
            'link_sertifikat' => 'nullable|string|max:2048',
        ]);

        $skill = Skill::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Certification created successfully.',
            'data'    => $skill,
        ], 201);
    }

    /**
     * Display the specified certification.
     */
    public function show(Skill $skill)
    {
        return response()->json([
            'success' => true,
            'data'    => $skill,
        ]);
    }

    /**
     * Update the specified certification.
     */
    public function update(Request $request, Skill $skill)
    {
        $validated = $request->validate([
            'name'            => 'sometimes|required|string|max:255',
            'issuer'          => 'nullable|string|max:255',
            'category'        => 'sometimes|required|string|max:255',
            'link_sertifikat' => 'nullable|string|max:2048',
        ]);

        $skill->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Certification updated successfully.',
            'data'    => $skill,
        ]);
    }

    /**
     * Remove the specified certification.
     */
    public function destroy(Skill $skill)
    {
        $skill->delete();

        return response()->json([
            'success' => true,
            'message' => 'Certification deleted successfully.',
        ]);
    }

    /**
     * Stream a certificate PDF inline (IDM-safe).
     */
    public function viewCertificate($filename)
    {
        // Append .pdf if stripped by frontend (IDM workaround)
        $actualFilename = str_ends_with($filename, '.pdf') ? $filename : $filename . '.pdf';
        $path = storage_path('app/public/certificates/' . $actualFilename);

        if (!file_exists($path)) {
            abort(404, 'Certificate not found.');
        }

        return response()->file($path, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . $filename . '"',
        ]);
    }
}
