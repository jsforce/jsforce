/**
 * URL utility functions for query parameter handling
 */

/**
 * Builds URL query string from parameters object
 * Filters out undefined and null values automatically.
 * 
 * @param params - Object with query parameters
 * @returns Query string with leading '?' or empty string if no params
 * 
 * @example
 * buildQueryString({ page: 1, name: 'test' }) // "?page=1&name=test"
 * buildQueryString({ page: 1, filter: undefined }) // "?page=1"
 * buildQueryString({}) // ""
 */
export function buildQueryString(
  params: Record<string, string | number | boolean | undefined | null>
): string {
  const parts: string[] = [];

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      parts.push(`${key}=${encodeURIComponent(String(value))}`);
    }
  }

  return parts.length > 0 ? '?' + parts.join('&') : '';
}

