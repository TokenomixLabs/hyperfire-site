
import { useCallback } from 'react';
import { ensureAdminExists } from '@/utils/authUtils';

/**
 * Hook for admin-specific functionality
 */
export const useAdmin = () => {
  /**
   * Ensure admin account exists
   */
  const verifyAdminAccount = useCallback(() => {
    ensureAdminExists();
  }, []);

  /**
   * Quick admin login function
   */
  const getAdminCredentials = useCallback(() => {
    return {
      email: 'admin@insiderlife.com',
      password: '773Pdq8908$#'
    };
  }, []);

  return {
    verifyAdminAccount,
    getAdminCredentials
  };
};
