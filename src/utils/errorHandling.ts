/**
 * Error handling utilities for service display functionality
 */

export interface ServiceDisplayError {
  type: 'FILTER_ERROR' | 'TYPE_MISMATCH' | 'API_ERROR' | 'VALIDATION_ERROR';
  message: string;
  details?: any;
  timestamp?: string;
  context?: string;
}

/**
 * Creates a standardized ServiceDisplayError
 */
export const createServiceDisplayError = (
  type: ServiceDisplayError['type'],
  message: string,
  details?: any,
  context?: string
): ServiceDisplayError => {
  return {
    type,
    message,
    details,
    context,
    timestamp: new Date().toISOString()
  };
};

/**
 * Handles service display errors with appropriate logging and user feedback
 */
export const handleServiceDisplayError = (error: ServiceDisplayError): void => {
  // Always log the error for debugging
  console.error('Service Display Error:', {
    type: error.type,
    message: error.message,
    context: error.context,
    timestamp: error.timestamp,
    details: error.details
  });

  // Log additional debugging information based on error type
  switch (error.type) {
    case 'TYPE_MISMATCH':
      console.warn('Type mismatch detected in service data. Check API response format.');
      if (error.details) {
        console.log('Problematic data:', error.details);
      }
      break;
    
    case 'FILTER_ERROR':
      console.warn('Service filtering failed. Check filter criteria and data format.');
      break;
    
    case 'API_ERROR':
      console.error('API request failed. Check network connection and API status.');
      break;
    
    case 'VALIDATION_ERROR':
      console.warn('Data validation failed. Check data structure and required fields.');
      break;
  }
};

/**
 * Wraps a function with error handling for service operations
 */
export const withServiceErrorHandling = <T extends any[], R>(
  fn: (...args: T) => R,
  context: string
) => {
  return (...args: T): R | null => {
    try {
      return fn(...args);
    } catch (error) {
      const serviceError = createServiceDisplayError(
        'FILTER_ERROR',
        `Error in ${context}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error,
        context
      );
      handleServiceDisplayError(serviceError);
      return null;
    }
  };
};

/**
 * Validates service data and creates appropriate errors
 */
export const validateServiceData = (data: any, context: string = 'service validation'): ServiceDisplayError | null => {
  if (!data) {
    return createServiceDisplayError(
      'VALIDATION_ERROR',
      'Service data is null or undefined',
      { data },
      context
    );
  }

  if (!Array.isArray(data) && typeof data !== 'object') {
    return createServiceDisplayError(
      'VALIDATION_ERROR',
      'Service data is not an object or array',
      { data, type: typeof data },
      context
    );
  }

  if (Array.isArray(data)) {
    const invalidServices = data.filter(service => !service || typeof service !== 'object');
    if (invalidServices.length > 0) {
      return createServiceDisplayError(
        'VALIDATION_ERROR',
        `Found ${invalidServices.length} invalid service objects in array`,
        { invalidServices },
        context
      );
    }
  }

  return null; // No errors found
};

/**
 * Logs meaningful debugging information for service filtering
 */
export const logServiceFilteringDebug = (
  services: any[],
  adminId: any,
  filteredCount: number,
  context: string = 'service filtering'
): void => {
  console.group(`🔍 Service Filtering Debug - ${context}`);
  
  console.log('📊 Filtering Summary:', {
    totalServices: services.length,
    filteredServices: filteredCount,
    adminId: adminId,
    adminIdType: typeof adminId
  });

  if (services.length > 0) {
    console.log('📋 Sample Service Data:', {
      firstService: {
        id: services[0]?.id,
        user_id: services[0]?.user_id,
        user_id_type: typeof services[0]?.user_id,
        title: services[0]?.title
      },
      userIdTypes: services.slice(0, 5).map(s => ({
        id: s?.id,
        user_id: s?.user_id,
        type: typeof s?.user_id
      }))
    });
  }

  if (filteredCount === 0 && services.length > 0) {
    console.warn('⚠️ No services matched the filter criteria. Possible issues:');
    console.log('- Admin ID type mismatch');
    console.log('- Incorrect admin ID value');
    console.log('- Services belong to different users');
  }

  console.groupEnd();
};