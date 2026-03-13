<?php
// public/link_storage.php (place this in your Laravel project's PUBLIC directory)
// Make sure this file is deleted IMMEDIATELY after use due to security risks.

// Bootstrap Laravel application
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

// Run the Artisan command
try {
    // Change directory to the project root before running the command
    chdir(__DIR__.'/../');
    \Artisan::call('storage:link');
    echo "<h1>Storage link created successfully!</h1>";
    echo "<p>Please **IMMEDIATELY DELETE THIS FILE** (public/link_storage.php) for security reasons.</p>";
} catch (\Exception $e) {
    echo "<h1>Error creating storage link:</h1>";
    echo "<p>Please ensure permissions are correct and `public/storage` doesn't exist as a regular directory.</p>";
    echo "<pre>" . $e->getMessage() . "</pre>";
}

$kernel->terminate($request, $response);