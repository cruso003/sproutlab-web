import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { 
  User, 
  InnovationProject, 
  IoTKit, 
  Equipment, 
  KnowledgeArticle, 
  TrainingModule,
  AuthResponse,
  ApiResponse,
  PaginatedResponse,
  AIClassificationRequest,
  AIClassificationResponse,
  ProjectCategory,
  CollaborationAnalysis,
  JoinRequest
} from './types';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Enhanced API Client with Axios interceptors, caching, and error handling
class APIClient {
  private axiosInstance: AxiosInstance;
  private token: string | null = null;
  private refreshPromise: Promise<string> | null = null;

  constructor(baseURL: string) {
    // Initialize axios instance
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 60000, // 60 seconds for AI operations
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Initialize token from localStorage
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }

    // Request interceptor for auth
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401 && this.token) {
          // Token expired - comprehensive cleanup
          this.clearToken();
          
          if (typeof window !== 'undefined') {
            // Clear any React Query cache
            if (window.location.pathname !== '/auth/login') {
              // Force a hard reload to clear all state
              window.location.replace('/auth/login');
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Set authentication token
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  // Clear authentication token
  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      // Clear all localStorage items that might contain auth data
      localStorage.removeItem('sproutlab-auth-store');
      // Clear any session storage as well
      sessionStorage.clear();
    }
  }

  // Get stored user data
  getStoredUser() {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  // Store user data
  setStoredUser(user: any) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  // Handle API responses
  private handleResponse<T>(response: AxiosResponse): ApiResponse<T> {
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message,
    };
  }

  private handleError(error: AxiosError): ApiResponse<never> {
    const errorMessage = (error.response?.data as any)?.message || error.message || 'An error occurred';
    
    return {
      success: false,
      error: errorMessage,
    };
  }

  // HTTP Methods
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.get<T>(endpoint, { params });
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.post<T>(endpoint, data);
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.put<T>(endpoint, data);
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.patch<T>(endpoint, data);
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.delete<T>(endpoint);
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  // File upload method
  async uploadFile<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      if (additionalData) {
        Object.entries(additionalData).forEach(([key, value]) => {
          formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
        });
      }

      const response = await this.axiosInstance.post<T>(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  // Cloudinary upload method
  async uploadToCloudinary(file: File, options?: any): Promise<ApiResponse<any>> {
    return this.uploadFile('/upload/cloudinary', file, options);
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.get('/health');
  }

  // Authentication methods
  async login(username: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const response = await this.post<AuthResponse>('/auth/login', {
      username,
      password,
    });

    if (response.success && response.data) {
      this.setToken(response.data.token);
      this.setStoredUser(response.data.user);
    }

    return response;
  }

  async register(userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
  }): Promise<ApiResponse<AuthResponse>> {
    const response = await this.post<AuthResponse>('/auth/register', userData);

    if (response.success && response.data) {
      this.setToken(response.data.token);
      this.setStoredUser(response.data.user);
    }

    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearToken();
    }
  }

  async refreshToken(): Promise<boolean> {
    // No refresh endpoint available - just check if token is still valid
    return this.isAuthenticated();
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Get current user from storage
  getCurrentUser() {
    return this.getStoredUser();
  }
}

// Create and export singleton instance
export const apiClient = new APIClient(API_BASE_URL);

// Export for testing or custom instances
export { APIClient };

// Convenience hooks for common operations
export const api = {
  // Auth
  auth: {
    login: (username: string, password: string) => apiClient.login(username, password),
    register: (userData: any) => apiClient.register(userData),
    logout: () => apiClient.logout(),
    refresh: () => apiClient.refreshToken(),
    isAuthenticated: () => apiClient.isAuthenticated(),
    getCurrentUser: () => apiClient.getCurrentUser(),
  },

  // Users
  users: {
    list: (params?: any) => apiClient.get<PaginatedResponse<User>>('/users', params),
    get: (id: string) => apiClient.get<User>(`/users/${id}`),
    update: (id: string, data: Partial<User>) => apiClient.put<User>(`/users/${id}`, data),
    delete: (id: string) => apiClient.delete(`/users/${id}`),
    profile: () => apiClient.get<User>('/users/profile'),
    updateProfile: (data: Partial<User>) => apiClient.put<User>('/users/profile', data),
    search: (query: string, limit?: number) => apiClient.get<{ success: boolean; users: User[] }>('/users/search', { q: query, limit: limit || 10 }),
  },

  // Innovation Projects
  projects: {
    list: (params?: any) => apiClient.get<PaginatedResponse<InnovationProject>>('/projects', params),
    get: (id: string) => apiClient.get<InnovationProject>(`/projects/${id}`),
    create: (data: Partial<InnovationProject>) => apiClient.post<InnovationProject>('/projects', data),
    update: (id: string, data: Partial<InnovationProject>) => apiClient.put<InnovationProject>(`/projects/${id}`, data),
    delete: (id: string) => apiClient.delete(`/projects/${id}`),
    getStats: () => apiClient.get<any>('/projects/stats'),
    addCollaborator: (id: string, userId: string) => 
      apiClient.post(`/projects/${id}/collaborators`, { userId }),
    removeCollaborator: (id: string, userId: string) => 
      apiClient.delete(`/projects/${id}/collaborators/${userId}`),
  },

  // Equipment
  equipment: {
    list: (params?: any) => apiClient.get<PaginatedResponse<Equipment>>('/equipment', params),
    get: (id: string) => apiClient.get<Equipment>(`/equipment/${id}`),
    create: (data: Partial<Equipment>) => apiClient.post<Equipment>('/equipment', data),
    update: (id: string, data: Partial<Equipment>) => apiClient.put<Equipment>(`/equipment/${id}`, data),
    delete: (id: string) => apiClient.delete(`/equipment/${id}`),
    reserve: (id: string, data: { startDate: string; endDate: string; purpose: string }) =>
      apiClient.post(`/equipment/${id}/reserve`, data),
    return: (id: string) => apiClient.post(`/equipment/${id}/return`),
  },

  // IoT Kits
  iotKits: {
    list: (params?: any) => apiClient.get<PaginatedResponse<IoTKit>>('/iot-kits', params),
    get: (id: string) => apiClient.get<IoTKit>(`/iot-kits/${id}`),
    create: (data: Partial<IoTKit>) => apiClient.post<IoTKit>('/iot-kits', data),
    update: (id: string, data: Partial<IoTKit>) => apiClient.put<IoTKit>(`/iot-kits/${id}`, data),
    delete: (id: string) => apiClient.delete(`/iot-kits/${id}`),
    checkout: (id: string, data: { borrowerId: string; expectedReturnDate: string }) =>
      apiClient.post(`/iot-kits/${id}/checkout`, data),
    checkin: (id: string) => apiClient.post(`/iot-kits/${id}/checkin`),
  },

  // Knowledge Base
  knowledge: {
    articles: {
      list: (params?: any) => apiClient.get<PaginatedResponse<KnowledgeArticle>>('/knowledge/articles', params),
      get: (id: string) => apiClient.get<KnowledgeArticle>(`/knowledge/articles/${id}`),
      create: (data: Partial<KnowledgeArticle>) => apiClient.post<KnowledgeArticle>('/knowledge/articles', data),
      update: (id: string, data: Partial<KnowledgeArticle>) => 
        apiClient.put<KnowledgeArticle>(`/knowledge/articles/${id}`, data),
      delete: (id: string) => apiClient.delete(`/knowledge/articles/${id}`),
      search: (query: string) => apiClient.get<KnowledgeArticle[]>('/knowledge/articles/search', { query }),
    },
  },

  // Training
  training: {
    modules: {
      list: (params?: any) => apiClient.get<PaginatedResponse<TrainingModule>>('/training/modules', params),
      get: (id: string) => apiClient.get<TrainingModule>(`/training/modules/${id}`),
      create: (data: Partial<TrainingModule>) => apiClient.post<TrainingModule>('/training/modules', data),
      update: (id: string, data: Partial<TrainingModule>) => 
        apiClient.put<TrainingModule>(`/training/modules/${id}`, data),
      delete: (id: string) => apiClient.delete(`/training/modules/${id}`),
      enroll: (id: string) => apiClient.post(`/training/modules/${id}/enroll`),
      complete: (id: string) => apiClient.post(`/training/modules/${id}/complete`),
    },
  },

  // Learning
  learning: {
    generateContent: (data: { projectId: string; skills?: string[]; focus?: string; difficulty?: string }) =>
      apiClient.post<{ 
        // Legacy format
        modules: any[]; 
        videoResources: any[]; 
        exercises: any[]; 
        totalDuration: string; 
        cached: boolean;
        
        // New enhanced format
        tracks?: any[];
        missions?: any[];
        gamification?: any;
        phaseProgress?: any;
        projectMetadata?: any;
        contentSummary?: any;
      }>('/learning/generate-content', data),
    generateExercises: (data: { projectId: string; focus?: string; difficulty?: string }) =>
      apiClient.post<{ exercises: any[] }>('/learning/generate-exercises', data),
    videoResources: (data: { projectId: string; topic: string; difficulty?: string }) =>
      apiClient.post<{ videos: any[] }>('/learning/video-resources', data),
    clearCache: (projectId: string) => apiClient.delete(`/learning/clear-cache/${projectId}`),
    
    // Content delivery endpoints
    getModule: (moduleId: string) => 
      apiClient.get<{ 
        id: string; 
        title: string; 
        description: string; 
        content: string; 
        duration: string; 
        difficulty: string; 
        type: string; 
        confidence: string; 
      }>(`/learning/modules/${moduleId}`),
    getExercise: (exerciseId: string) => 
      apiClient.get<{ 
        id: string; 
        title: string; 
        description: string; 
        steps: any[]; 
        expectedOutcome: string; 
        estimatedTime: string; 
        difficulty: string; 
        skill: string; 
      }>(`/learning/exercises/${exerciseId}`),
    getVideo: (videoId: string) => 
      apiClient.get<{ 
        id: string; 
        title: string; 
        description: string; 
        url: string; 
        duration: string; 
        difficulty: string; 
        skill: string; 
        topic: string; 
        projectRelevance: string; 
        instructor?: string; 
      }>(`/learning/videos/${videoId}`),
    
    // Progress tracking endpoints
    saveProgress: (data: { projectId: string; itemId: string; itemType: 'module' | 'exercise' | 'video'; completed: boolean; xpEarned?: number }) =>
      apiClient.post<{ success: boolean; xpEarned: number }>('/learning/progress', data),
    getProgress: (projectId: string) => 
      apiClient.get<{ 
        projectId: string; 
        totalCompleted: number; 
        totalXP: number; 
        progress: any[]; 
        summary: any; 
      }>(`/learning/progress/${projectId}`),
  },

  // Analytics
  analytics: {
    dashboard: () => apiClient.get('/analytics/dashboard'),
    userActivity: () => apiClient.get('/analytics/user-activity'),
    admin: () => apiClient.get('/analytics/admin'),
  },

  // AI Services
  ai: {
    classifyProject: (data: AIClassificationRequest) => 
      apiClient.post<AIClassificationResponse>('/ai/classify-project', data),
    getCategories: () => 
      apiClient.get<{ categories: ProjectCategory[] }>('/ai/categories'),
    analyzeInnovation: (data: { title: string; description: string; problemStatement: string; type?: string; discipline?: string; industry?: string; tags?: string[] }) =>
      apiClient.post<any>('/ai/innovation/analyze', data),
    analyzeAdvanced: (data: { problemDescription: string; context?: string; includeKit?: boolean; skipCollaborationCheck?: boolean }) =>
      apiClient.post<any>('/ai/innovation/analyze-advanced', {
        roughIdea: data.problemDescription,
        problemScope: 'building', // Default scope
        experienceLevel: 'intermediate', // Default level
        timeframe: 'semester',
        teamPreference: 'small_team',
        skipCollaborationCheck: data.skipCollaborationCheck || false
      }),
    suggestTeam: (data: { title: string; description: string; requiredSkills: string[]; maxTeamSize: number; type: string }) =>
      apiClient.post<any>('/ai/team/suggest', data),
  },

  // Collaboration & Team Formation
  collaboration: {
    findOpportunities: (data: { idea: string; includeCompleted?: boolean }) =>
      apiClient.post<CollaborationAnalysis>('/collaboration/find-opportunities', data),
    requestToJoin: (data: JoinRequest) =>
      apiClient.post<any>('/collaboration/request-to-join', data),
  },

  // File uploads
  upload: {
    cloudinary: (file: File, options?: any) => apiClient.uploadToCloudinary(file, options),
    direct: (endpoint: string, file: File, metadata?: any) => 
      apiClient.uploadFile(endpoint, file, metadata),
  },

  // System
  system: {
    health: () => apiClient.healthCheck(),
    status: () => apiClient.get('/system/status'),
  },
};

export default api;
