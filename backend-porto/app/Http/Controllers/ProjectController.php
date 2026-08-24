<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    /**
     * Display a listing of projects.
     */
    public function index()
    {
        $projects = Project::latest()->get();

        return response()->json([
            'success' => true,
            'data'    => $projects,
        ]);
    }

    /**
     * Store a newly created project.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'github_url'  => 'nullable|string|max:255',
            'demo_url'    => 'nullable|string|max:255',
            'tech_stack'  => 'nullable',
        ]);

        // Handle tech_stack: accept JSON string or array
        if (isset($validated['tech_stack']) && is_string($validated['tech_stack'])) {
            $validated['tech_stack'] = json_decode($validated['tech_stack'], true);
        }

        // Handle project image upload
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = 'project_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            $file->storeAs('projects', $filename, 'public');
            $validated['image'] = $filename;
        }

        $project = Project::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Project created successfully.',
            'data'    => $project,
        ], 201);
    }

    /**
     * Display the specified project.
     */
    public function show(Project $project)
    {
        return response()->json([
            'success' => true,
            'data'    => $project,
        ]);
    }

    /**
     * Update the specified project.
     */
    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title'       => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'github_url'  => 'nullable|string|max:255',
            'demo_url'    => 'nullable|string|max:255',
            'tech_stack'  => 'nullable',
        ]);

        // Handle tech_stack: accept JSON string or array
        if (isset($validated['tech_stack']) && is_string($validated['tech_stack'])) {
            $validated['tech_stack'] = json_decode($validated['tech_stack'], true);
        }

        // Handle project image upload (delete old file first)
        if ($request->hasFile('image')) {
            if ($project->image) {
                Storage::disk('public')->delete('projects/' . $project->image);
            }
            $file = $request->file('image');
            $filename = 'project_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            $file->storeAs('projects', $filename, 'public');
            $validated['image'] = $filename;
        }

        $project->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Project updated successfully.',
            'data'    => $project,
        ]);
    }

    /**
     * Remove the specified project.
     */
    public function destroy(Project $project)
    {
        // Delete associated image file
        if ($project->image) {
            Storage::disk('public')->delete('projects/' . $project->image);
        }

        $project->delete();

        return response()->json([
            'success' => true,
            'message' => 'Project deleted successfully.',
        ]);
    }
}
