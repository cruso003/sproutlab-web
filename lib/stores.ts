import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { AIClassification } from './types';

// UI State Store
interface UIState {
  // Navigation
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  
  // Theme
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Modals
  modals: {
    createProject: boolean;
    editProfile: boolean;
    equipmentReservation: boolean;
    inviteUser: boolean;
  };
  openModal: (modal: keyof UIState['modals']) => void;
  closeModal: (modal: keyof UIState['modals']) => void;
  closeAllModals: () => void;
  
  // Notifications
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: Date;
  }>;
  addNotification: (notification: Omit<UIState['notifications'][0], 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // Loading states
  loading: {
    global: boolean;
    projects: boolean;
    equipment: boolean;
  };
  setLoading: (key: keyof UIState['loading'], value: boolean) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set, get) => ({
        // Navigation
        sidebarOpen: true,
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        
        // Theme
        theme: 'system',
        setTheme: (theme) => set({ theme }),
        
        // Modals
        modals: {
          createProject: false,
          editProfile: false,
          equipmentReservation: false,
          inviteUser: false,
        },
        openModal: (modal) => 
          set((state) => ({
            modals: { ...state.modals, [modal]: true }
          })),
        closeModal: (modal) => 
          set((state) => ({
            modals: { ...state.modals, [modal]: false }
          })),
        closeAllModals: () => 
          set({
            modals: {
              createProject: false,
              editProfile: false,
              equipmentReservation: false,
              inviteUser: false,
            }
          }),
        
        // Notifications
        notifications: [],
        addNotification: (notification) => {
          const id = Date.now().toString();
          set((state) => ({
            notifications: [
              ...state.notifications,
              { ...notification, id, timestamp: new Date() }
            ]
          }));
          
          // Auto remove after 5 seconds
          setTimeout(() => {
            get().removeNotification(id);
          }, 5000);
        },
        removeNotification: (id) =>
          set((state) => ({
            notifications: state.notifications.filter(n => n.id !== id)
          })),
        clearNotifications: () => set({ notifications: [] }),
        
        // Loading states
        loading: {
          global: false,
          projects: false,
          equipment: false,
        },
        setLoading: (key, value) =>
          set((state) => ({
            loading: { ...state.loading, [key]: value }
          })),
      }),
      {
        name: 'sproutlab-ui-store',
        partialize: (state) => ({
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    ),
    { name: 'UIStore' }
  )
);

// Equipment Store (for complex equipment state)
interface EquipmentState {
  selectedEquipment: any | null;
  reservationCart: Array<{
    equipmentId: string;
    startDate: Date;
    endDate: Date;
    purpose: string;
  }>;
  filters: {
    category: string[];
    availability: 'all' | 'available' | 'reserved';
    location: string[];
  };
}

interface EquipmentActions {
  setSelectedEquipment: (equipment: any | null) => void;
  addToReservationCart: (reservation: EquipmentState['reservationCart'][0]) => void;
  removeFromReservationCart: (equipmentId: string) => void;
  clearReservationCart: () => void;
  setFilters: (filters: Partial<EquipmentState['filters']>) => void;
  resetFilters: () => void;
}

export const useEquipmentStore = create<EquipmentState & EquipmentActions>()(
  devtools(
    (set) => ({
      // State
      selectedEquipment: null,
      reservationCart: [],
      filters: {
        category: [],
        availability: 'all',
        location: [],
      },
      
      // Actions
      setSelectedEquipment: (equipment) => set({ selectedEquipment: equipment }),
      addToReservationCart: (reservation) =>
        set((state) => ({
          reservationCart: [...state.reservationCart, reservation]
        })),
      removeFromReservationCart: (equipmentId) =>
        set((state) => ({
          reservationCart: state.reservationCart.filter(r => r.equipmentId !== equipmentId)
        })),
      clearReservationCart: () => set({ reservationCart: [] }),
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters }
        })),
      resetFilters: () =>
        set({
          filters: {
            category: [],
            availability: 'all',
            location: [],
          }
        }),
    }),
    { name: 'EquipmentStore' }
  )
);

// Project Creation Store
interface ProjectCreationState {
  // Wizard state
  currentStep: number;
  maxStep: number;
  
  // Project data
  projectData: {
    // Basic info (Step 1)
    title: string;
    description: string;
    problemStatement: string;
    category: string;
    subcategory: string;
    complexity: 'beginner' | 'intermediate' | 'advanced';
    
    // Team info (Step 3)
    isTeamProject: boolean;
    maxTeamSize: number;
    requiredSkills: string[];
    skills: string[];
    teamMembers: Array<{
      userId: string;
      username: string;
      role: string;
    }>;
    workingAlone: boolean;
    mentorRequested: boolean;
    
    // Planning info (Step 4)
    startDate: string;
    targetCompletionDate: string;
    estimatedBudget: number;
    constraints: string[];
    milestones: Array<{
      id: string;
      title: string;
      description: string;
      targetDate: string;
      dependencies: string[];
      isCompleted: boolean;
    }>;
    riskAssessment: string;
    successMetrics: string[];
    
    // Launch info (Step 5)
    type: 'healthcare' | 'agriculture' | 'infrastructure' | 'industrial' | 'environmental' | 'other';
    discipline: 'computer_science' | 'electrical_engineering' | 'mechanical_engineering' | 'civil_engineering' | 'interdisciplinary';
    industry: string;
    tags: string[];
    repositoryUrl: string;
    documentationUrl: string;
    isPublic: boolean;
    
    // AI and other data
    aiAnalysis?: any;
    resources: string[];
  };
  
  // AI classification
  aiClassification: AIClassification | null;
  
  // UI state
  isClassifying: boolean;
  classificationError: string | null;
}

interface ProjectCreationActions {
  // Wizard navigation
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  resetWizard: () => void;
  
  // Project data
  updateProjectData: (data: Partial<ProjectCreationState['projectData']>) => void;
  resetProjectData: () => void;
  
  // AI classification
  setAIClassification: (classification: ProjectCreationState['aiClassification']) => void;
  setClassifying: (isClassifying: boolean) => void;
  setClassificationError: (error: string | null) => void;
}

export const useProjectCreationStore = create<ProjectCreationState & ProjectCreationActions>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentStep: 1,
      maxStep: 5,
      projectData: {
        // Basic info (Step 1)
        title: '',
        description: '',
        problemStatement: '',
        category: '',
        subcategory: '',
        complexity: 'beginner',
        
        // Team info (Step 3)
        isTeamProject: false,
        maxTeamSize: 4,
        requiredSkills: [],
        skills: [],
        teamMembers: [],
        workingAlone: false,
        mentorRequested: false,
        
        // Planning info (Step 4)
        startDate: '',
        targetCompletionDate: '',
        estimatedBudget: 0,
        constraints: [],
        milestones: [],
        riskAssessment: '',
        successMetrics: [],
        
        // Launch info (Step 5)
        type: 'other',
        discipline: 'interdisciplinary',
        industry: '',
        tags: [],
        repositoryUrl: '',
        documentationUrl: '',
        isPublic: true,
        
        // AI and other data
        aiAnalysis: null,
        resources: [],
      },
      aiClassification: null,
      isClassifying: false,
      classificationError: null,
      
      // Wizard navigation
      nextStep: () => set((state) => ({
        currentStep: Math.min(state.currentStep + 1, state.maxStep)
      })),
      previousStep: () => set((state) => ({
        currentStep: Math.max(state.currentStep - 1, 1)
      })),
      goToStep: (step) => set({
        currentStep: Math.max(1, Math.min(step, get().maxStep))
      }),
      resetWizard: () => set({
        currentStep: 1,
        projectData: {
          // Basic info (Step 1)
          title: '',
          description: '',
          problemStatement: '',
          category: '',
          subcategory: '',
          complexity: 'beginner',
          
          // Team info (Step 3)
          isTeamProject: false,
          maxTeamSize: 4,
          requiredSkills: [],
          skills: [],
          teamMembers: [],
          workingAlone: false,
          mentorRequested: false,
          
          // Planning info (Step 4)
          startDate: '',
          targetCompletionDate: '',
          estimatedBudget: 0,
          constraints: [],
          milestones: [],
          riskAssessment: '',
          successMetrics: [],
          
          // Launch info (Step 5)
          type: 'other' as const,
          discipline: 'interdisciplinary' as const,
          industry: '',
          tags: [],
          repositoryUrl: '',
          documentationUrl: '',
          isPublic: true,
          
          // AI and other data
          aiAnalysis: null,
          resources: [],
        },
        aiClassification: null,
        isClassifying: false,
        classificationError: null,
      }),
      
      // Project data
      updateProjectData: (data) => set((state) => ({
        projectData: { ...state.projectData, ...data }
      })),
      resetProjectData: () => set({
        projectData: {
          // Basic info (Step 1)
          title: '',
          description: '',
          problemStatement: '',
          category: '',
          subcategory: '',
          complexity: 'beginner',
          
          // Team info (Step 3)
          isTeamProject: false,
          maxTeamSize: 4,
          requiredSkills: [],
          skills: [],
          teamMembers: [],
          workingAlone: false,
          mentorRequested: false,
          
          // Planning info (Step 4)
          startDate: '',
          targetCompletionDate: '',
          estimatedBudget: 0,
          constraints: [],
          milestones: [],
          riskAssessment: '',
          successMetrics: [],
          
          // Launch info (Step 5)
          type: 'other' as const,
          discipline: 'interdisciplinary' as const,
          industry: '',
          tags: [],
          repositoryUrl: '',
          documentationUrl: '',
          isPublic: true,
          
          // AI and other data
          aiAnalysis: null,
          resources: [],
        }
      }),
      
      // AI classification
      setAIClassification: (classification) => set({ aiClassification: classification }),
      setClassifying: (isClassifying) => set({ isClassifying }),
      setClassificationError: (error) => set({ classificationError: error }),
    }),
    { name: 'ProjectCreationStore' }
  )
);
