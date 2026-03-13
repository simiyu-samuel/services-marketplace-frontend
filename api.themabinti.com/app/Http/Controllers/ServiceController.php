<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\User; // Needed for policy check
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Auth\Access\AuthorizationException; // For manual policy denial messages
use App\Http\Requests\Service\StoreServiceRequest; // Import
use App\Http\Requests\Service\UpdateServiceRequest; // Import
use App\Http\Requests\Service\UploadServiceMediaRequest; // Import
use Illuminate\Support\Facades\Log; // For logging file operations

class ServiceController extends Controller
{
    public function __construct()
    {
        // Apply policies automatically for resource methods
        $this->authorizeResource(Service::class, 'service');
    }

    /**
     * Display a listing of services.
     * Publicly accessible, with filters.
     */
    public function index(Request $request)
    {
        $query = Service::query()->where('is_active', true); // Only active services by default
        
        $filterUserId = $request->input('filter.user_id'); // Accesses filter[user_id]
        if ($filterUserId) { // If it exists and is not empty
            $query->where('user_id', $filterUserId);
        }

        // Filter by featured status
        $filterIsFeatured = $request->input('filter.is_featured');
        if ($filterIsFeatured !== null) {
            $query->where('is_featured', $request->boolean('filter.is_featured'));
        }

        // Implement filtering
        if ($request->has('category')) {
            $query->where('category', $request->input('category'));
        }
        if ($request->has('subcategory')) {
            $query->where('subcategory', $request->input('subcategory'));
        }
        if ($request->has('location')) {
            $query->where('location', 'like', '%' . $request->input('location') . '%');
        }
        // Filter by price range (Min/Max price on service overlapping with requested range)
        if ($request->has('min_price') && is_numeric($request->input('min_price'))) {
            $minPriceFilter = (float)$request->input('min_price');
            $query->where(function ($q) use ($minPriceFilter) {
                // If service has a max price, its max_price must be >= filter's min_price
                // OR if service has only a min_price (max_price is null), its min_price must be >= filter's min_price
                $q->where('max_price', '>=', $minPriceFilter)
                  ->orWhere(function ($subQ) use ($minPriceFilter) {
                      $subQ->whereNull('max_price') // Service is fixed price
                           ->where('min_price', '>=', $minPriceFilter);
                  });
            });
        }
        if ($request->has('max_price') && is_numeric($request->input('max_price'))) {
            $maxPriceFilter = (float)$request->input('max_price');
            $query->where('min_price', '<=', $maxPriceFilter); // Service's min_price must be <= filter's max_price
        }
        if ($request->has('is_mobile')) {
            $query->where('is_mobile', $request->boolean('is_mobile'));
        }
        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', '%' . $searchTerm . '%')
                    ->orWhere('description', 'like', '%' . $searchTerm . '%')
                    ->orWhere('category', 'like', '%' . $searchTerm . '%')
                    ->orWhere('subcategory', 'like', '%' . $searchTerm . '%');
            });
        }

        // Sort featured services first if no specific sorting is requested
        if (!$request->has('sort')) {
            $query->orderBy('is_featured', 'desc')->orderBy('updated_at', 'desc');
        }

        // Eager load user for seller details
        $services = $query->with('user')->paginate($request->input('per_page', 10)); // Paginate results

        return response()->json($services, 200);
    }

    /**
     * Display the specified service.
     * Publicly accessible, but only if active.
     */
    public function show(Service $service)
    {
        // The policy `view` method handles `is_active` check.
        return response()->json($service->load('user'), 200); // Eager load user
    }

    /**
     * Store a newly created service in storage.
     * Only for authenticated sellers. Policy handles limits.
     */
    public function store(StoreServiceRequest $request) // Use Form Request
    {
        $user = $request->user();

        $serviceData = $request->validated();
        $serviceData['user_id'] = $user->id;
        $serviceData['is_active'] = true; // New services are active by default, admin can moderate
        
        // Only admins can set is_featured to true
        if (isset($serviceData['is_featured']) && $serviceData['is_featured'] && !$user->isAdmin()) {
            return response()->json([
                'message' => 'Only administrators can mark services as featured.',
            ], 403);
        }
        
        // Ensure max_price is explicitly null if not provided or empty
        if (!isset($serviceData['max_price']) || $serviceData['max_price'] === null || $serviceData['max_price'] === '') {
            $serviceData['max_price'] = null;
        }

        // Handle media files if present
        $mediaPaths = [];
        if ($request->hasFile('media_files')) {
            foreach ($request->file('media_files') as $file) {
                if ($file->isValid()) {
                    $path = $file->store('service_media', 'public'); // Store in 'public' disk
                    $mediaPaths[] = Storage::url($path); // Get public URL
                }
            }
        }
        $serviceData['media_files'] = $mediaPaths;

        $service = Service::create($serviceData);

        return response()->json([
            'message' => 'Service created successfully.',
            'service' => $service,
        ], 201);
    }

    /**
     * Store a draft service during seller onboarding.
     *
     * This allows a newly registered user with a pending_seller_package to
     * create a non-active service before payment. Public listing is still
     * protected because index() only returns is_active = true.
     */
    public function storeOnboarding(StoreServiceRequest $request)
    {
        $user = $request->user();

        if (!$user || !$user->pending_seller_package) {
            return response()->json([
                'message' => 'You must have a pending seller package to create an onboarding service.',
            ], 403);
        }

        $serviceData = $request->validated();
        $serviceData['user_id'] = $user->id;
        $serviceData['is_active'] = false;

        // Only admins can set is_featured to true
        if (isset($serviceData['is_featured']) && $serviceData['is_featured'] && !$user->isAdmin()) {
            return response()->json([
                'message' => 'Only administrators can mark services as featured.',
            ], 403);
        }

        // Ensure max_price is explicitly null if not provided or empty
        if (!isset($serviceData['max_price']) || $serviceData['max_price'] === null || $serviceData['max_price'] === '') {
            $serviceData['max_price'] = null;
        }

        // Handle media files if present
        $mediaPaths = [];
        if ($request->hasFile('media_files')) {
            foreach ($request->file('media_files') as $file) {
                if ($file->isValid()) {
                    $path = $file->store('service_media', 'public'); // Store in 'public' disk
                    $mediaPaths[] = Storage::url($path); // Get public URL
                }
            }
        }
        $serviceData['media_files'] = $mediaPaths;

        $service = Service::create($serviceData);

        return response()->json([
            'message' => 'Onboarding service created successfully.',
            'service' => $service,
        ], 201);
    }

    /**
     * Update the specified service in storage.
     * Only for service owner.
     */
    public function update(UpdateServiceRequest $request, Service $service) // Use Form Request
    {
        $user = $request->user();
        $serviceData = $request->validated();

        // Only admins can update is_featured status
        if (array_key_exists('is_featured', $serviceData) && !$user->isAdmin()) {
            return response()->json([
                'message' => 'Only administrators can update featured status.',
            ], 403);
        }

        // Handle max_price explicitly for update if provided or set to null/empty
        if (array_key_exists('max_price', $serviceData) && ($serviceData['max_price'] === null || $serviceData['max_price'] === '')) {
            $serviceData['max_price'] = null;
        }

        $service->update($serviceData);

        return response()->json([
            'message' => 'Service updated successfully.',
            'service' => $service,
        ], 200);
    }

    /**
     * Remove the specified service from storage.
     * Only for service owner.
     */
    public function destroy(Service $service)
    {
        // Policy 'delete' method has already authorized based on ownership.

        // Delete associated media files
        if (is_array($service->media_files)) {
            foreach ($service->media_files as $url) {
                $path = str_replace('/storage/', '', $url); // Convert URL back to path
                if (Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->delete($path);
                }
            }
        }

        $service->delete();

        return response()->json(['message' => 'Service deleted successfully.'], 200);
    }

    /**
     * Upload additional media files to an existing service.
     */
    public function uploadMedia(UploadServiceMediaRequest $request, Service $service)
    {
        // Authorization: Ensure user owns the service. Policy `update` handles this implicitly.
        $this->authorize('update', $service);

        $mediaPaths = $service->media_files ?? []; // Get existing media

        if ($request->hasFile('media_files')) {
            foreach ($request->file('media_files') as $file) {
                if ($file->isValid()) {
                    $path = $file->store('service_media', 'public');
                    $mediaPaths[] = Storage::url($path);
                }
            }
        }

        $service->update(['media_files' => $mediaPaths]);

        return response()->json([
            'message' => 'Media files uploaded successfully.',
            'service' => $service,
        ], 200);
    }

    // You might add a method to delete specific media files from a service too
    // public function deleteMedia(Request $request, Service $service, string $mediaUrl) { /* ... */ }
}