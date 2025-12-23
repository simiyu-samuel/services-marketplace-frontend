import { Service, compareUserIds, isValidService } from '@/types';
import { 
  handleServiceDisplayError, 
  createServiceDisplayError, 
  validateServiceData,
  logServiceFilteringDebug 
} from './errorHandling';

/**
 * Creates a type-aware filter function for admin services
 * Handles both string and number user_id formats safely
 */
export const createTypeAwareFilter = (adminId: string | number) => {
  return (service: Service): boolean => {
    // Validate the service object first
    if (!isValidService(service)) {
      console.warn('Invalid service object detected:', service);
      return false;
    }

    // Use the type-safe comparison utility from types
    return compareUserIds(service.user_id, adminId);
  };
};

/**
 * Safe type conversion utilities for user IDs
 */
export const safeTypeConversion = {
  /**
   * Safely converts a value to string, handling null/undefined
   */
  toString: (value: unknown): string => {
    if (value === null || value === undefined) {
      return '';
    }
    return String(value);
  },

  /**
   * Safely converts a value to number, with fallback
   */
  toNumber: (value: unknown, fallback: number = 0): number => {
    if (value === null || value === undefined) {
      return fallback;
    }
    
    const num = Number(value);
    return isNaN(num) ? fallback : num;
  },

  /**
   * Checks if two values are equal when converted to the same type
   */
  areEqual: (value1: unknown, value2: unknown): boolean => {
    return safeTypeConversion.toString(value1) === safeTypeConversion.toString(value2);
  }
};

/**
 * Enhanced filtering function with error handling and logging
 */
export const filterAdminServices = (
  services: Service[], 
  adminId: string | number,
  options: {
    enableLogging?: boolean;
    fallbackToAll?: boolean;
  } = {}
): Service[] => {
  const { enableLogging = false, fallbackToAll = false } = options;

  try {
    // Validate input data
    const validationError = validateServiceData(services, 'filterAdminServices');
    if (validationError) {
      handleServiceDisplayError(validationError);
      return fallbackToAll ? services || [] : [];
    }

    if (!services || !Array.isArray(services)) {
      const error = createServiceDisplayError(
        'VALIDATION_ERROR',
        'Invalid services array provided to filterAdminServices',
        { services, type: typeof services },
        'filterAdminServices'
      );
      handleServiceDisplayError(error);
      return [];
    }

    if (!adminId) {
      const error = createServiceDisplayError(
        'FILTER_ERROR',
        'No admin ID provided to filterAdminServices',
        { adminId },
        'filterAdminServices'
      );
      handleServiceDisplayError(error);
      return fallbackToAll ? services : [];
    }

    const filter = createTypeAwareFilter(adminId);
    const filtered = services.filter(filter);

    if (enableLogging) {
      logServiceFilteringDebug(services, adminId, filtered.length, 'filterAdminServices');
    }

    return filtered;
  } catch (error) {
    const serviceError = createServiceDisplayError(
      'FILTER_ERROR',
      `Unexpected error in filterAdminServices: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error,
      'filterAdminServices'
    );
    handleServiceDisplayError(serviceError);
    return fallbackToAll ? services || [] : [];
  }
};