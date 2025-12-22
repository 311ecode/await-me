import { 
  createAsyncHandler, 
  RETURN_STYLES, 
  valueOf, 
  isSuccess, 
  toResult 
} from 'await-me-ts';

/**
 * Symmetric Reflection: 
 * We export the exact functions from the core engine.
 */
export {
  createAsyncHandler,
  valueOf,
  isSuccess,
  toResult,
  RETURN_STYLES as STYLES // Alias for convenience, while keeping core name
};

/**
 * Optional: The Barrel Namespace
 * Provides the same symmetry for those who prefer dot-notation.
 */
export const WaitForMe = {
  create: createAsyncHandler,
  valueOf,
  isSuccess,
  toResult,
  STYLES: RETURN_STYLES
} as const;

// Re-export all types from core for full IDE support
export * from 'await-me-ts';
