/**
 * Input Validation Utilities
 * Validates user inputs at component boundaries
 * Prevents invalid data from entering the system
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  return { isValid: true };
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): ValidationResult {
  if (!password || typeof password !== 'string') {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters' };
  }

  return { isValid: true };
}

/**
 * Validate username
 */
export function validateUsername(username: string): ValidationResult {
  if (!username || typeof username !== 'string') {
    return { isValid: false, error: 'Username is required' };
  }

  if (username.length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters' };
  }

  if (username.length > 30) {
    return { isValid: false, error: 'Username must be less than 30 characters' };
  }

  // Allow alphanumeric, underscore, hyphen
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(username)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, underscore, and hyphen' };
  }

  return { isValid: true };
}

/**
 * Validate category ID
 */
export function validateCategoryId(categoryId: string): ValidationResult {
  const validCategories = ['for-you', 'networks', 'drama', 'docu'];
  
  if (!categoryId || typeof categoryId !== 'string') {
    return { isValid: false, error: 'Category ID is required' };
  }

  if (!validCategories.includes(categoryId)) {
    return { isValid: false, error: 'Invalid category ID' };
  }

  return { isValid: true };
}

/**
 * Validate creator ID format
 */
export function validateCreatorId(creatorId: string): ValidationResult {
  if (!creatorId || typeof creatorId !== 'string') {
    return { isValid: false, error: 'Creator ID is required' };
  }

  if (creatorId.length === 0) {
    return { isValid: false, error: 'Creator ID cannot be empty' };
  }

  return { isValid: true };
}

/**
 * Validate show/project ID format
 */
export function validateShowId(showId: string): ValidationResult {
  if (!showId || typeof showId !== 'string') {
    return { isValid: false, error: 'Show ID is required' };
  }

  if (showId.length === 0) {
    return { isValid: false, error: 'Show ID cannot be empty' };
  }

  return { isValid: true };
}

/**
 * Sanitize string input (basic XSS prevention)
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove potentially dangerous characters
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate and sanitize text input
 */
export function validateAndSanitizeText(text: string, maxLength?: number): ValidationResult & { sanitized?: string } {
  if (!text || typeof text !== 'string') {
    return { isValid: false, error: 'Text is required' };
  }

  if (maxLength && text.length > maxLength) {
    return { isValid: false, error: `Text must be less than ${maxLength} characters` };
  }

  const sanitized = sanitizeString(text);
  return { isValid: true, sanitized };
}

