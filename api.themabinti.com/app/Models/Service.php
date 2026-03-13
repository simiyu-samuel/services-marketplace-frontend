<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'category',
        'subcategory',
        'min_price',
        'max_price',
        'duration',
        'location',
        'is_mobile',
        'media_files',
        'is_active',
        'is_featured',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'media_files' => 'array', // Cast JSON column to array
        'is_mobile' => 'boolean',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
         'min_price' => 'float',
        'max_price' => 'float',
    ];

    /**
     * Get the user (seller) that owns the service.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the appointments for the service.
     */
    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }
    
    /**
     * Accessor to get an average price for sorting/filtering consistency, if needed.
     * This is an internal helper, not exposed by default in API unless explicitly appended.
     */
    public function getAveragePriceAttribute(): float
    {
        if ($this->min_price > 0 && $this->max_price > $this->min_price) {
            return ($this->min_price + $this->max_price) / 2;
        }
        return (float)$this->min_price;
    }
}