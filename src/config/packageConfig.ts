export const packageConfigs = {
  /**
   * Define the different seller packages available on the platform.
   * Each package specifies its price, service limits, and media upload limits.
   * 'null' for limits indicates unlimited.
   */
  seller_packages: {
    basic: {
      name: 'Basic',
      price: 1.00, // Monthly fee in KES
      services_limit: 1, // Max number of services a seller can list
      photos_per_service: 2, // Max photos per single service listing
      video_per_service: 0,  // Max videos per single service listing
      listing_visibility: 'standard', // Describes visibility level (e.g., standard search results)
      support_level: 'standard', // Level of customer support
      features: [
        '1 Service Listing',
        '2 Photos per Service',
        'Standard Listing Visibility',
        'Standard Support',
      ],
    },
    standard: {
      name: 'Standard',
      price: 1500.00,
      services_limit: 2,
      photos_per_service: 3,
      video_per_service: 1,
      listing_visibility: 'enhanced', // Better placement/prominence
      support_level: 'priority',
      features: [
        '2 Service Listings',
        '3 Photos per Service',
        '1 Video per Service',
        'Enhanced Listing Visibility',
        'Priority Support',
      ],
    },
    premium: {
      name: 'Premium',
      price: 2500.00,
      services_limit: null, // Unlimited services
      photos_per_service: 5, // Unlimited photos
      video_per_service: null, // Unlimited videos
      listing_visibility: 'featured', // Featured on homepage, top search results
      support_level: 'premium',
      features: [
        'Unlimited Service Listings',
        '5 Photos per Service',
        'Unlimited Videos per Service',
        'Featured Listing Visibility',
        'Premium Support',
      ],
    },
  },

  /**
   * Duration of seller packages before renewal is required, in months.
   */
  package_duration_months: 1, // All packages are renewable on a monthly basis
};
