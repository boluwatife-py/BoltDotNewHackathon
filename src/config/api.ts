// API Configuration
// This file centralizes all API-related configuration

// Get API base URL from environment variable or default to localhost
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // User profile
  USER: {
    PROFILE: '/user/profile',
  },
  
  // Supplements
  SUPPLEMENTS: {
    BASE: '/supplements',
    BY_ID: (id: number) => `/supplements/${id}`,
  },
  
  // Chat
  CHAT: {
    SEND: '/chat',
    HISTORY: '/chat/history',
    CLEAR: '/chat/clear',
  },
  
  // Health check
  HEALTH: '/health',
  
  // Email status
  EMAIL: {
    STATUS: '/email/status',
  },
} as const;

// HTTP methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
} as const;

// Request headers
export const getAuthHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// API request helper with better error handling
export const apiRequest = async (
  endpoint: string,
  options: {
    method?: string;
    body?: any;
    token?: string;
    headers?: Record<string, string>;
  } = {}
) => {
  const {
    method = 'GET',
    body,
    token,
    headers: customHeaders = {},
  } = options;

  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    ...getAuthHeaders(token),
    ...customHeaders,
  };

  const config: RequestInit = {
    method,
    headers,
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    
    // Handle different response types
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`);
    }

    return { data, response };
  } catch (error) {
    console.error(`API request failed: ${method} ${url}`, error);
    throw error;
  }
};

// Specific API functions
export const authAPI = {
  signup: (userData: {
    email: string;
    password: string;
    name: string;
    age: number;
    avatar?: string;
  }) => apiRequest(API_ENDPOINTS.AUTH.SIGNUP, {
    method: HTTP_METHODS.POST,
    body: userData,
  }),

  login: (credentials: { email: string; password: string }) =>
    apiRequest(API_ENDPOINTS.AUTH.LOGIN, {
      method: HTTP_METHODS.POST,
      body: credentials,
    }),

  refresh: (refreshToken: string) =>
    apiRequest(API_ENDPOINTS.AUTH.REFRESH, {
      method: HTTP_METHODS.POST,
      token: refreshToken,
    }),

  forgotPassword: (email: string) =>
    apiRequest(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      method: HTTP_METHODS.POST,
      body: { email },
    }),

  verifyEmail: (email: string, token: string) =>
    apiRequest(API_ENDPOINTS.AUTH.VERIFY_EMAIL, {
      method: HTTP_METHODS.POST,
      body: { email, token },
    }),

  resendVerification: (email: string) =>
    apiRequest(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, {
      method: HTTP_METHODS.POST,
      body: { email },
    }),

  resetPassword: (email: string, token: string, new_password: string) =>
    apiRequest(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      method: HTTP_METHODS.POST,
      body: { email, token, new_password },
    }),
};

export const userAPI = {
  getProfile: (token: string) =>
    apiRequest(API_ENDPOINTS.USER.PROFILE, { token }),

  updateProfile: (token: string, profileData: {
    name?: string;
    age?: number;
    avatar?: string;
  }) => apiRequest(API_ENDPOINTS.USER.PROFILE, {
    method: HTTP_METHODS.PUT,
    body: profileData,
    token,
  }),
};

export const supplementsAPI = {
  getAll: (token: string) =>
    apiRequest(API_ENDPOINTS.SUPPLEMENTS.BASE, { token }),

  create: (token: string, supplementData: any) =>
    apiRequest(API_ENDPOINTS.SUPPLEMENTS.BASE, {
      method: HTTP_METHODS.POST,
      body: supplementData,
      token,
    }),

  update: (token: string, id: number, supplementData: any) =>
    apiRequest(API_ENDPOINTS.SUPPLEMENTS.BY_ID(id), {
      method: HTTP_METHODS.PUT,
      body: supplementData,
      token,
    }),

  delete: (token: string, id: number) =>
    apiRequest(API_ENDPOINTS.SUPPLEMENTS.BY_ID(id), {
      method: HTTP_METHODS.DELETE,
      token,
    }),
};

export const chatAPI = {
  sendMessage: (token: string, message: string) =>
    apiRequest(API_ENDPOINTS.CHAT.SEND, {
      method: HTTP_METHODS.POST,
      body: { message },
      token,
    }),

  getHistory: (token: string, limit?: number) => {
    const endpoint = limit 
      ? `${API_ENDPOINTS.CHAT.HISTORY}?limit=${limit}`
      : API_ENDPOINTS.CHAT.HISTORY;
    
    return apiRequest(endpoint, { token });
  },

  clearHistory: (token: string) =>
    apiRequest(API_ENDPOINTS.CHAT.CLEAR, {
      method: HTTP_METHODS.DELETE,
      token,
    }),
};

// Health check
export const healthCheck = () => apiRequest(API_ENDPOINTS.HEALTH);

// Email status check
export const emailStatusCheck = () => apiRequest(API_ENDPOINTS.EMAIL.STATUS);