<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'headline',
        'sub_headline',
        'description',
        'profile_photo',
        'resume_pdf',
        'github_link',
        'linkedin_link',
    ];
}
