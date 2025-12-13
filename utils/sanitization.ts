/**
 * Data Sanitization Utilities
 * XSS prevention and data cleaning before rendering
 */

/**
 * Sanitize HTML content (basic XSS prevention)
 */
export function sanitizeHTML(html: string): string {
  if (typeof html !== 'string') {
    return '';
  }

  // Remove script tags and event handlers
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '');
}

/**
 * Sanitize URL to prevent XSS
 */
export function sanitizeURL(url: string): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // Only allow http, https, and data URLs (for images)
  const urlPattern = /^(https?:\/\/|data:image)/i;
  if (!urlPattern.test(url)) {
    return null;
  }

  // Remove javascript: and other dangerous protocols
  if (url.toLowerCase().includes('javascript:') || url.toLowerCase().includes('vbscript:')) {
    return null;
  }

  return url;
}

/**
 * Sanitize object properties recursively
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const sanitized = { ...obj } as T;

  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      // Sanitize string values
      (sanitized as any)[key] = sanitizeHTML(sanitized[key] as string);
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      // Recursively sanitize nested objects
      (sanitized as any)[key] = sanitizeObject(sanitized[key] as any);
    }
  }

  return sanitized;
}

/**
 * Sanitize creator data before rendering
 */
export function sanitizeCreatorData(creator: {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  [key: string]: any;
}): typeof creator {
  return {
    ...creator,
    name: sanitizeHTML(creator.name || ''),
    bio: creator.bio ? sanitizeHTML(creator.bio) : undefined,
    avatar: creator.avatar ? sanitizeURL(creator.avatar) || undefined : undefined,
  };
}

/**
 * Sanitize show/project data before rendering
 */
export function sanitizeShowData(show: {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;
  [key: string]: any;
}): typeof show {
  return {
    ...show,
    title: sanitizeHTML(show.title || ''),
    description: show.description ? sanitizeHTML(show.description) : undefined,
    coverImage: show.coverImage ? sanitizeURL(show.coverImage) || undefined : undefined,
  };
}

/**
 * Sanitize comment text before rendering
 */
export function sanitizeComment(comment: {
  id: string;
  text: string;
  [key: string]: any;
}): typeof comment {
  return {
    ...comment,
    text: sanitizeHTML(comment.text || ''),
  };
}

