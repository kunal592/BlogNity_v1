export const API_ENDPOINTS = {
  POSTS: '/api/posts',
  USERS: '/api/users',
  COMMENTS: '/api/comments',
  LIKES: '/api/likes',
  BOOKMARKS: '/api/bookmarks',
  FOLLOWS: '/api/follows',
  NOTIFICATIONS: '/api/notifications',
  DASHBOARD: '/api/dashboard',
  ADMIN: '/api/admin',
  AUTH: '/api/auth',
  CONTACT: '/api/contact',
};

/**
 * Simulates network latency for mock API calls.
 * @param delay The delay in milliseconds. Defaults to 500ms.
 * @returns A promise that resolves after the specified delay.
 */
export const simulateLatency = (delay: number = 500): Promise<void> => 
  new Promise(res => setTimeout(res, delay));
