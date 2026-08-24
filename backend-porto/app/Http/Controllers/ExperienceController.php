<?php

namespace App\Http\Controllers;

use App\Models\Experience;
use Illuminate\Http\Request;

class ExperienceController extends Controller
{
    /**
     * Display a listing of experiences.
     */
    public function index()
    {
        $experiences = Experience::orderBy('start_date', 'desc')->get();

        return response()->json([
            'success' => true,
            'data'    => $experiences,
        ]);
    }

    /**
     * Store a newly created experience.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'company'    => 'required|string|max:255',
            'position'   => 'required|string|max:255',
            'start_date' => 'required|string|max:255',
            'end_date'   => 'nullable|string|max:255',
            'is_current' => 'boolean',
            'description'=> 'nullable|string',
            'category'   => 'required|in:pendidikan,organisasi,profesional',
        ]);

        $experience = Experience::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Experience created successfully.',
            'data'    => $experience,
        ], 201);
    }

    /**
     * Display the specified experience.
     */
    public function show(Experience $experience)
    {
        return response()->json([
            'success' => true,
            'data'    => $experience,
        ]);
    }

    /**
     * Update the specified experience.
     */
    public function update(Request $request, Experience $experience)
    {
        $validated = $request->validate([
            'company'    => 'sometimes|required|string|max:255',
            'position'   => 'sometimes|required|string|max:255',
            'start_date' => 'sometimes|required|string|max:255',
            'end_date'   => 'nullable|string|max:255',
            'is_current' => 'boolean',
            'description'=> 'nullable|string',
            'category'   => 'sometimes|required|in:pendidikan,organisasi,profesional',
        ]);

        $experience->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Experience updated successfully.',
            'data'    => $experience,
        ]);
    }

    /**
     * Remove the specified experience.
     */
    public function destroy(Experience $experience)
    {
        $experience->delete();

        return response()->json([
            'success' => true,
            'message' => 'Experience deleted successfully.',
        ]);
    }
}
