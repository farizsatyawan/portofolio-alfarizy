<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProfileController extends Controller
{
    /**
     * Display a listing of profiles.
     */
    public function index()
    {
        $profiles = Profile::all();

        return response()->json([
            'success' => true,
            'data'    => $profiles,
        ]);
    }

    /**
     * Store a newly created profile.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'headline'       => 'required|string|max:255',
            'sub_headline'   => 'nullable|string|max:255',
            'description'    => 'nullable|string',
            'profile_photo'  => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'resume_pdf'     => 'nullable|mimes:pdf|max:5120',
            'github_link'    => 'nullable|string|max:255',
            'linkedin_link'  => 'nullable|string|max:255',
        ]);

        // Handle profile photo upload
        if ($request->hasFile('profile_photo')) {
            $file = $request->file('profile_photo');
            $filename = 'profile_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            $file->storeAs('profiles', $filename, 'public');
            $validated['profile_photo'] = $filename;
        }

        // Handle resume PDF upload
        if ($request->hasFile('resume_pdf')) {
            $file = $request->file('resume_pdf');
            $filename = 'resume_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            $file->storeAs('resumes', $filename, 'public');
            $validated['resume_pdf'] = $filename;
        }

        $profile = Profile::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Profile created successfully.',
            'data'    => $profile,
        ], 201);
    }

    /**
     * Display the specified profile.
     */
    public function show(Profile $profile)
    {
        return response()->json([
            'success' => true,
            'data'    => $profile,
        ]);
    }

    /**
     * Update the specified profile.
     */
    public function update(Request $request, Profile $profile)
    {
        $validated = $request->validate([
            'headline'       => 'sometimes|required|string|max:255',
            'sub_headline'   => 'nullable|string|max:255',
            'description'    => 'nullable|string',
            'profile_photo'  => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'resume_pdf'     => 'nullable|mimes:pdf|max:5120',
            'github_link'    => 'nullable|string|max:255',
            'linkedin_link'  => 'nullable|string|max:255',
        ]);

        // Handle profile photo upload (delete old file first)
        if ($request->hasFile('profile_photo')) {
            // Delete old photo if exists
            if ($profile->profile_photo) {
                Storage::disk('public')->delete('profiles/' . $profile->profile_photo);
            }
            $file = $request->file('profile_photo');
            $filename = 'profile_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            $file->storeAs('profiles', $filename, 'public');
            $validated['profile_photo'] = $filename;
        }

        // Handle resume PDF upload (delete old file first)
        if ($request->hasFile('resume_pdf')) {
            // Delete old resume if exists
            if ($profile->resume_pdf) {
                Storage::disk('public')->delete('resumes/' . $profile->resume_pdf);
            }
            $file = $request->file('resume_pdf');
            $filename = 'resume_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            $file->storeAs('resumes', $filename, 'public');
            $validated['resume_pdf'] = $filename;
        }

        $profile->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully.',
            'data'    => $profile,
        ]);
    }

    /**
     * Remove the specified profile.
     */
    public function destroy(Profile $profile)
    {
        // Delete associated files from storage
        if ($profile->profile_photo) {
            Storage::disk('public')->delete('profiles/' . $profile->profile_photo);
        }
        if ($profile->resume_pdf) {
            Storage::disk('public')->delete('resumes/' . $profile->resume_pdf);
        }

        $profile->delete();

        return response()->json([
            'success' => true,
            'message' => 'Profile deleted successfully.',
        ]);
    }
}
