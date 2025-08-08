import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { api } from './api';
import { useAuthStore } from './stores';
import { InnovationProject, Equipment, User, KnowledgeArticle, TrainingModule, AIClassification, AIClassificationRequest, ProjectCategory } from './types';

// Query Keys Factory
export const queryKeys = {
  auth: ['auth'] as const,
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
  profile: () => ['users', 'profile'] as const,
  
  projects: ['projects'] as const,
  project: (id: string) => ['projects', id] as const,
  userProjects: (userId: string) => ['projects', 'user', userId] as const,
  
  equipment: ['equipment'] as const,
  equipmentItem: (id: string) => ['equipment', id] as const,
  availableEquipment: () => ['equipment', 'available'] as const,
  
  knowledge: ['knowledge'] as const,
  knowledgeArticle: (id: string) => ['knowledge', 'articles', id] as const,
  knowledgeSearch: (query: string) => ['knowledge', 'search', query] as const,
  
  training: ['training'] as const,
  trainingModule: (id: string) => ['training', 'modules', id] as const,
  userTraining: (userId: string) => ['training', 'user', userId] as const,
  
  ai: ['ai'] as const,
  aiClassification: (data: { title: string; description: string; problemStatement: string }) => 
    ['ai', 'classification', data] as const,
  aiCategories: () => ['ai', 'categories'] as const,
};

// Authentication Hooks
export const useAuth = () => {
  const { user, token, isAuthenticated, setAuth, clearAuth, setLoading } = useAuthStore();
  
  const loginMutation = useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      api.auth.login(username, password),
    onMutate: () => setLoading(true),
    onSuccess: (response) => {
      console.log('Login successful:', response);
      if (response.success && response.data) {
        setAuth(response.data.user, response.data.token);
      }
      setLoading(false);
    },
    onError: () => setLoading(false),
  });

  const logoutMutation = useMutation({
    mutationFn: api.auth.logout,
    onSuccess: () => clearAuth(),
  });

  return {
    user,
    token,
    isAuthenticated,
    isLoading: useAuthStore(state => state.isLoading),
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    loginError: loginMutation.error,
  };
};

// Projects Hooks
export const useProjects = (params?: any) => {
  return useQuery({
    queryKey: [...queryKeys.projects, params],
    queryFn: () => api.projects.list(params),
    select: (data: any) => data.success ? data.data : null,
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: queryKeys.project(id),
    queryFn: () => api.projects.get(id),
    select: (data) => data.success ? data.data : null,
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<InnovationProject>) => api.projects.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InnovationProject> }) =>
      api.projects.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.project(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => api.projects.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
    },
  });
};

export const useProjectStats = () => {
  return useQuery({
    queryKey: ['projectStats'],
    queryFn: () => api.projects.getStats(),
    select: (data) => data.success ? data.data : null,
    staleTime: 5 * 60 * 1000, // Consider fresh for 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

// Equipment Hooks
export const useEquipment = (params?: any) => {
  return useQuery({
    queryKey: ['equipment', params],
    queryFn: () => api.equipment.list(params),
    select: (data) => data.success ? data.data : [],
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// IoT Kits hooks
export const useIoTKits = (params?: any) => {
  return useQuery({
    queryKey: ['iot-kits', params],
    queryFn: () => api.iotKits.list(params),
    select: (data) => data.success ? data.data : [],
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// User management hooks
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => api.users.list(),
    select: (data) => data.success ? data : null,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useEquipmentItem = (id: string) => {
  return useQuery({
    queryKey: queryKeys.equipmentItem(id),
    queryFn: () => api.equipment.get(id),
    select: (data) => data.success ? data.data : null,
    enabled: !!id,
  });
};

export const useReserveEquipment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      id, 
      data 
    }: { 
      id: string; 
      data: { startDate: string; endDate: string; purpose: string } 
    }) => api.equipment.reserve(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.equipmentItem(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.equipment });
    },
  });
};

// User/Profile Hooks
export const useProfile = () => {
  return useQuery({
    queryKey: queryKeys.profile(),
    queryFn: () => api.users.profile(),
    select: (data) => data.success ? data.data : null,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore(state => state.updateUser);
  
  return useMutation({
    mutationFn: (data: Partial<User>) => api.users.updateProfile(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        updateUser(response.data);
        queryClient.setQueryData(queryKeys.profile(), response);
      }
    },
  });
};

export const useSearchUsers = (query: string) => {
  return useQuery({
    queryKey: ['users', 'search', query],
    queryFn: () => api.users.search(query, 10),
    select: (data) => data.success && data.data ? data.data.users : [],
    enabled: query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Knowledge Base Hooks
export const useKnowledgeArticles = (params?: any) => {
  return useQuery({
    queryKey: [...queryKeys.knowledge, 'articles', params],
    queryFn: () => api.knowledge.articles.list(params),
    select: (data) => data.success ? data.data : null,
  });
};

export const useKnowledgeArticle = (id: string) => {
  return useQuery({
    queryKey: queryKeys.knowledgeArticle(id),
    queryFn: () => api.knowledge.articles.get(id),
    select: (data) => data.success ? data.data : null,
    enabled: !!id,
  });
};

export const useSearchKnowledge = (query: string) => {
  return useQuery({
    queryKey: queryKeys.knowledgeSearch(query),
    queryFn: () => api.knowledge.articles.search(query),
    select: (data) => data.success ? data.data : [],
    enabled: query.length > 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Training hooks
export const useTrainingModules = (filters?: any) => {
  return useQuery({
    queryKey: ['training', 'modules', filters],
    queryFn: () => api.training.modules.list(filters),
  });
};

export const useTrainingProgress = (moduleId?: string) => {
  return useQuery({
    queryKey: ['training', 'progress', moduleId],
    queryFn: () => api.training.modules.get(moduleId!),
    enabled: !!moduleId,
  });
};

export const useTrainingCertificates = () => {
  return useQuery({
    queryKey: ['training', 'certificates'],
    queryFn: () => api.training.modules.list({ completed: true }),
  });
};

// Analytics hooks
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: async () => {
      // Fetch multiple endpoints concurrently for dashboard stats
      const [projectsRes, equipmentRes, usersRes] = await Promise.all([
        api.projects.list({ limit: 1000 }), // Get all projects
        api.equipment.list(),
        api.users.list()
      ]);

      // Calculate stats from the responses
      const activeProjects = projectsRes.data?.data?.filter((p: any) => p.status === 'active' || p.status === 'in_progress') || [];
      const availableEquipment = equipmentRes.data?.data?.filter((e: any) => e.status === 'available') || [];
      const totalUsers = usersRes.data?.data?.length || 0;
      const teamMembers = usersRes.data?.data?.filter((u: any) => u.role === 'student' || u.role === 'staff') || [];

      return {
        activeProjects: activeProjects.length,
        equipmentReserved: Math.floor(Math.random() * 5) + 1, // Placeholder until we have booking stats
        totalUsers,
        teamMembers: teamMembers.length,
        // Additional calculated metrics
        projectsThisMonth: activeProjects.filter((p: any) => {
          const createdAt = new Date(p.createdAt);
          const now = new Date();
          return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
        }).length,
        equipmentUtilization: availableEquipment.length > 0 ? Math.round((1 - availableEquipment.length / (equipmentRes.data?.data?.length || 1)) * 100) : 0
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds for real-time feel
    staleTime: 20000, // Consider data stale after 20 seconds
  });
};

export const useEquipmentBookings = (equipmentId?: string) => {
  return useQuery({
    queryKey: ['equipment', 'bookings', equipmentId],
    queryFn: async () => {
      if (!equipmentId) return { success: true, data: null, message: 'No equipment ID provided' };
      return api.equipment.get(equipmentId);
    },
    enabled: !!equipmentId,
  });
};

// File Upload Hooks
export const useFileUpload = () => {
  return useMutation({
    mutationFn: ({ file, options }: { file: File; options?: any }) =>
      api.upload.cloudinary(file, options),
  });
};

// Custom hook for optimistic updates
export const useOptimisticUpdate = <T>(
  queryKey: readonly unknown[],
  updateFn: (oldData: T, newData: Partial<T>) => T
) => {
  const queryClient = useQueryClient();

  return (newData: Partial<T>) => {
    queryClient.setQueryData(queryKey, (oldData: T) => 
      oldData ? updateFn(oldData, newData) : oldData
    );
  };
};

// AI Hooks
export const useAIClassification = () => {
  const classifyProjectMutation = useMutation({
    mutationFn: (data: { title: string; description: string; problemStatement: string }) =>
      api.ai.classifyProject(data),
    retry: 1,
    retryDelay: 1000,
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: queryKeys.aiCategories(),
    queryFn: () => api.ai.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes - categories don't change often
  });

  return {
    classifyProject: classifyProjectMutation.mutate,
    classifyProjectAsync: classifyProjectMutation.mutateAsync,
    classification: classifyProjectMutation.data,
    isClassifying: classifyProjectMutation.isPending,
    classificationError: classifyProjectMutation.error,
    categories: categories?.data?.categories || [],
    categoriesLoading,
  };
};

// Additional AI Hooks for Project Creation
export const useAIInnovationAnalysis = () => {
  const analyzeInnovationMutation = useMutation({
    mutationFn: (data: { title: string; description: string; problemStatement: string; type?: string; discipline?: string; industry?: string; tags?: string[] }) =>
      api.ai.analyzeInnovation(data),
    retry: 1,
    retryDelay: 1000,
  });

  return {
    analyzeInnovation: analyzeInnovationMutation.mutate,
    analyzeInnovationAsync: analyzeInnovationMutation.mutateAsync,
    analysis: analyzeInnovationMutation.data,
    isAnalyzing: analyzeInnovationMutation.isPending,
    analysisError: analyzeInnovationMutation.error,
  };
};

export const useAITeamSuggestions = () => {
  const suggestTeamMutation = useMutation({
    mutationFn: (data: { title: string; description: string; requiredSkills: string[]; maxTeamSize: number; type: string }) =>
      api.ai.suggestTeam(data),
    retry: 1,
    retryDelay: 1000,
  });

  return {
    suggestTeam: suggestTeamMutation.mutate,
    suggestTeamAsync: suggestTeamMutation.mutateAsync,
    suggestions: suggestTeamMutation.data,
    isSuggesting: suggestTeamMutation.isPending,
    suggestionsError: suggestTeamMutation.error,
  };
};

// Project Creation Hooks
export const useProjectCreation = () => {
  const createProjectMutation = useMutation({
    mutationFn: (data: Partial<InnovationProject>) => api.projects.create(data),
    onSuccess: () => {
      // Invalidate and refetch projects list
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
    },
  });

  const queryClient = useQueryClient();

  return {
    createProject: createProjectMutation.mutate,
    createProjectAsync: createProjectMutation.mutateAsync,
    isCreating: createProjectMutation.isPending,
    createError: createProjectMutation.error,
    createSuccess: createProjectMutation.isSuccess,
  };
};

// Prefetch utility
export const usePrefetch = () => {
  const queryClient = useQueryClient();

  const prefetchProject = (id: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.project(id),
      queryFn: () => api.projects.get(id),
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  const prefetchEquipment = (id: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.equipmentItem(id),
      queryFn: () => api.equipment.get(id),
      staleTime: 10 * 60 * 1000,
    });
  };

  return {
    prefetchProject,
    prefetchEquipment,
  };
};
