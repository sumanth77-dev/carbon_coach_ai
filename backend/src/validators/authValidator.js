/**
 * Validation helpers for authentication payloads.
 */
export const validateRegisterInput = (data) => {
  const errors = {};

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.name = 'Name is required';
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Valid email address is required';
  }

  if (!data.password || data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  if (data.accountType && !['individual', 'family', 'business'].includes(data.accountType)) {
    errors.accountType = 'Account type must be individual, family, or business';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateLoginInput = (data) => {
  const errors = {};

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Valid email is required';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
