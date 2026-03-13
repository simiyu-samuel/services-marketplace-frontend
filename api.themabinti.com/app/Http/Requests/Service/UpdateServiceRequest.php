<?php

namespace App\Http\Requests\Service;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Authorization handled by ServicePolicy 'update' method
        return true;
    }

    public function rules(): array
    {
        $user = $this->user();
        
        $rules = [
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string', 'max:5000'],
            'category' => ['sometimes', 'string', 'max:255'],
            'subcategory' => ['nullable', 'string', 'max:255'],
            'min_price' => ['sometimes', 'numeric', 'min:0', 'max:1000000'],
            // When updating max_price, ensure it's >= current min_price or the submitted min_price
            'max_price' => ['nullable', 'numeric', 'min:' . ($this->min_price ?? $this->service->min_price ?? 0), 'max:1000000'],
            'duration' => ['sometimes', 'integer', 'min:5', 'max:1440'],
            'location' => ['sometimes', 'string', 'max:255'],
            'is_mobile' => ['sometimes', 'boolean'],
            'is_active' => ['sometimes', 'boolean'], // Allow seller to activate/deactivate
        ];

        // Only admins can update is_featured
        if ($user && $user->isAdmin()) {
            $rules['is_featured'] = ['sometimes', 'boolean'];
        }

        return $rules;
    }
}