// Core API types based on our comprehensive backend
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'staff' | 'admin' | 'super_admin';
  discipline?: 'computer_science' | 'electrical_engineering' | 'mechanical_engineering' | 'civil_engineering';
  studentId?: string;
  profilePicture?: string;
  bio?: string;
  skills?: string[];
  interests?: string[];
  linkedinProfile?: string;
  githubProfile?: string;
  portfolioUrl?: string;
  graduationYear?: number;
  createdAt: string;
  updatedAt: string;
}

export interface InnovationProject {
  id: string;
  title: string;
  description: string;
  problemStatement?: string;
  solution?: string;
  
  // Project classification
  type?: 'healthcare' | 'agriculture' | 'infrastructure' | 'industrial' | 'environmental' | 'other';
  discipline?: 'computer_science' | 'electrical_engineering' | 'mechanical_engineering' | 'civil_engineering' | 'interdisciplinary';
  tags?: string[];
  
  // Status and timeline
  status: 'ideation' | 'design' | 'prototype' | 'testing' | 'complete' | 'showcase';
  startDate?: string;
  targetCompletionDate?: string;
  actualCompletionDate?: string;
  
  // Team information
  teamLeaderId: string;
  isTeamProject: boolean;
  maxTeamSize?: number;
  currentTeamSize?: number;
  spotsAvailable?: number;
  
  // Resources
  kitsUsed?: any[];
  componentsUsed?: any[];
  equipmentUsed?: any[];
  
  // Documentation
  repository?: string;
  documentationUrl?: string;
  demoUrl?: string;
  
  // Showcase and recognition
  isShowcased?: boolean;
  showcaseDate?: string;
  awards?: any[];
  
  // Industry connections
  mentorId?: string;
  industryPartner?: string;
  commercialPotential?: string;
  
  // Metrics
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  
  // Related data
  creator?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    discipline?: string;
    university?: string;
  };
  members?: User[];
  files?: ProjectFile[];
}

export interface IoTKit {
  id: string;
  name: string;
  description: string;
  type: 'iot_101' | 'iot_104' | 'iot_105' | 'custom';
  status: 'available' | 'checked_out' | 'maintenance' | 'damaged' | 'retired';
  location?: string;
  purchaseDate?: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  totalCheckouts: number;
  averageUsageDuration?: number;
  components?: KitComponent[];
  currentUser?: User;
  checkoutHistory?: CheckoutRecord[];
}

export interface Equipment {
  id: string;
  name: string;
  description: string;
  type: 'printer_3d' | 'laser_cutter' | 'soldering_station' | 'oscilloscope' | 'multimeter' | 'power_supply' | 'function_generator' | 'pcb_mill' | 'pick_place' | 'reflow_oven' | 'other';
  brand?: string;
  model?: string;
  status: 'available' | 'in_use' | 'maintenance' | 'damaged' | 'retired';
  location: string;
  requiresTraining: boolean;
  maxBookingDuration?: number;
  bookingLeadTime?: number;
  specifications?: Record<string, any>;
  manualUrl?: string;
  safetyRequirements?: string[];
  totalBookings: number;
  averageUsageTime?: number;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  summary?: string;
  category: 'tutorial' | 'reference' | 'troubleshooting' | 'best_practices' | 'case_study' | 'component_guide' | 'project_example';
  subcategory?: string;
  tags?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedReadTime?: number;
  prerequisites?: string[];
  relatedComponents?: string[];
  targetAudience?: ('computer_science' | 'electrical_engineering' | 'mechanical_engineering' | 'civil_engineering')[];
  isPublic: boolean;
  featuredImageUrl?: string;
  attachments?: string[];
  viewCount: number;
  likeCount: number;
  authorId: string;
  author: User;
  createdAt: string;
  updatedAt: string;
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  content: string;
  category: 'safety' | 'equipment_training' | 'software_tutorial' | 'technical_skills' | 'project_management' | 'innovation_methodology';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration?: number;
  prerequisites?: string[];
  learningObjectives?: string[];
  isRequired: boolean;
  certificateAwarded: boolean;
  interactiveContent?: Record<string, any>;
  assessmentCriteria?: Record<string, any>;
  maxAttempts?: number;
  passingScore?: number;
  tags?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFile {
  id: string;
  filename: string;
  originalFilename: string;
  fileUrl: string;
  fileType: 'document' | 'image' | 'video' | 'audio' | 'cad' | 'code' | 'data' | 'archive' | 'other';
  category: 'design' | 'documentation' | 'code' | 'test_results' | 'presentation' | 'other';
  description?: string;
  uploadedBy: string;
  projectId: string;
  createdAt: string;
}

export interface KitComponent {
  id: string;
  name: string;
  type: string;
  specifications?: Record<string, any>;
  quantity: number;
  isWorking: boolean;
}

export interface CheckoutRecord {
  id: string;
  userId: string;
  kitId: string;
  checkoutDate: string;
  expectedReturnDate: string;
  actualReturnDate?: string;
  purpose?: string;
  condition?: string;
  user: User;
}

export interface Booking {
  id: string;
  userId: string;
  equipmentId: string;
  startTime: string;
  endTime: string;
  purpose?: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  user: User;
  equipment: Equipment;
}

export interface FabricationOrder {
  id: string;
  userId: string;
  type: 'pcb' | '3d_print' | 'laser_cut' | 'cnc' | 'other';
  title: string;
  description: string;
  specifications: Record<string, any>;
  files: string[];
  estimatedCost?: number;
  actualCost?: number;
  status: 'quote_requested' | 'quoted' | 'approved' | 'in_production' | 'quality_check' | 'completed' | 'delivered' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requestedDelivery?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  providerId?: string;
  providerOrderId?: string;
  qualityNotes?: string;
  trackingInfo?: Record<string, any>;
  user: User;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  discipline?: string;
  studentId?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: number;
}

// Filter and Search Types
export interface ProjectFilters {
  search?: string;
  type?: string;
  discipline?: string;
  status?: string;
  team_projects?: boolean;
  created_by?: string;
  tags?: string[];
  page?: number;
  limit?: number;
}

export interface KitFilters {
  search?: string;
  type?: string;
  status?: string;
  location?: string;
  available_only?: boolean;
}

export interface EquipmentFilters {
  search?: string;
  type?: string;
  status?: string;
  location?: string;
  requires_training?: boolean;
  available_only?: boolean;
}

export interface KnowledgeFilters {
  search?: string;
  category?: string;
  difficulty?: string;
  tags?: string[];
  target_audience?: string;
}

// Dashboard Analytics Types
export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalUsers: number;
  activeKits: number;
  availableEquipment: number;
  totalKnowledgeArticles: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'project_created' | 'kit_checkout' | 'equipment_booking' | 'knowledge_published' | 'training_completed';
  description: string;
  userId: string;
  user: User;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Real-time Types
export interface NotificationItem {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface SystemStatus {
  status: 'operational' | 'degraded' | 'maintenance' | 'incident';
  services: {
    api: 'operational' | 'degraded' | 'down';
    database: 'operational' | 'degraded' | 'down';
    fileStorage: 'operational' | 'degraded' | 'down';
    fabricationServices: 'operational' | 'degraded' | 'down';
  };
  lastUpdated: string;
}

// AI Classification Types
export interface AIClassification {
  category: string;
  subcategory: string;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  skills: string[];
  resources: string[];
  reasoning: string;
}

export interface ProjectCategory {
  name: string;
  subcategories: string[];
}

export interface AIClassificationRequest {
  title: string;
  description: string;
  problemStatement: string;
}

export interface AIClassificationResponse {
  category: string;
  subcategory: string;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  skills: string[];
  resources: string[];
  reasoning: string;
}
