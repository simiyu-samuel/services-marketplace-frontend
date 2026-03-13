<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            // Check if 'price' column exists before dropping (for idempotency)
            if (Schema::hasColumn('services', 'price')) {
                // First, ensure existing 'price' data is migrated to 'min_price' if needed
                // (For clean fresh start, this isn't strictly needed, but for existing data, it is)
                // DB::statement("UPDATE services SET min_price = price WHERE price IS NOT NULL");

                $table->dropColumn('price'); // Remove the single price column
            }

            // Add new 'min_price' and 'max_price' columns
            // min_price is required, max_price is nullable (for single fixed prices)
            $table->decimal('min_price', 10, 2)->after('subcategory')->default(0); // Set a default for existing rows if needed
            $table->decimal('max_price', 10, 2)->nullable()->after('min_price');

            // Add index for price range queries (optional, but good for performance)
            $table->index(['min_price', 'max_price']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            // Drop the new columns
            $table->dropColumn('max_price');
            $table->dropColumn('min_price');

            // Re-add the old 'price' column (for rollback compatibility)
            $table->decimal('price', 10, 2)->nullable()->after('subcategory'); // Make it nullable if original was, or default
        });
    }
};