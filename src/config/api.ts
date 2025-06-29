// API Configuration
// This file centralizes all API-related configuration

// Get API base URL from environment variable or use production URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://safedoser.onrender.com';

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
  
  // Supplement logs
  SUPPLEMENT_LOGS: {
    BASE: '/supplement-logs',
    BY_ID: (id: string) => `/supplement-logs/${id}`,
    MARK_COMPLETED: '/supplement-logs/mark-completed',
    TODAY: '/supplement-logs/today',
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

// Request timeout in milliseconds (10 seconds)
export const REQUEST_TIMEOUT = 10000;

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

// Create AbortController for timeout
const createTimeoutController = (timeoutMs: number = REQUEST_TIMEOUT) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  return {
    controller,
    cleanup: () => clearTimeout(timeoutId)
  };
};

// API request helper with timeout and better error handling
export const apiRequest = async (
  endpoint: string,
  options: {
    method?: string;
    body?: any;
    token?: string;
    headers?: Record<string, string>;
    timeout?: number;
  } = {}
) => {
  const {
    method = 'GET',
    body,
    token,
    headers: customHeaders = {},
    timeout = REQUEST_TIMEOUT,
  } = options;

  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    ...getAuthHeaders(token),
    ...customHeaders,
  };

  // Create timeout controller
  const { controller, cleanup } = createTimeoutController(timeout);

  const config: RequestInit = {
    method,
    headers,
    signal: controller.signal,
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    
    // Clean up timeout
    cleanup();
    
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
  } catch (error: any) {
    // Clean up timeout
    cleanup();
    
    // Handle timeout errors
    if (error.name === 'AbortError') {
      console.error(`API request timeout: ${method} ${url}`);
      throw new Error('Request timeout. Please check your internet connection and try again.');
    }
    
    // Handle network errors
    if (error.message === 'Failed to fetch' || error.message.includes('fetch')) {
      console.error(`Network error: ${method} ${url}`, error);
      throw new Error('Network error. Please check your internet connection and try again.');
    }
    
    console.error(`API request failed: ${method} ${url}`, error);
    throw error;
  }
};

// Specific API functions with timeout support
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

export const supplementLogsAPI = {
  getTodayLogs: (token: string) =>
    apiRequest(API_ENDPOINTS.SUPPLEMENT_LOGS.TODAY, { token }),

  markCompleted: (token: string, logData: {
    supplement_id: number;
    scheduled_time: string;
    status: 'taken' | 'missed' | 'skipped';
    notes?: string;
  }) => apiRequest(API_ENDPOINTS.SUPPLEMENT_LOGS.MARK_COMPLETED, {
    method: HTTP_METHODS.POST,
    body: logData,
    token,
  }),

  updateLog: (token: string, logId: string, updateData: {
    status?: 'pending' | 'taken' | 'missed' | 'skipped';
    taken_at?: string;
    notes?: string;
  }) => apiRequest(API_ENDPOINTS.SUPPLEMENT_LOGS.BY_ID(logId), {
    method: HTTP_METHODS.PUT,
    body: updateData,
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