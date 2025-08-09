'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Brain, 
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  Target,
  Lightbulb,
  Rocket,
  Star,
  ArrowRight,
  ArrowLeft,
  Wand2,
  Globe,
  Building,
  Home,
  User,
  Zap,
  CheckCircle,
  RefreshCw,
  Wrench
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useUIStore } from '@/lib/stores';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface InnovationForm {
  roughIdea: string;
}

interface AIResponse {
  opportunity: {
    title: string;
    description: string;
    marketSize: string;
    impact: string;
    uniqueValue: string;
    africanContext: string;
  };
  technical: {
    complexity: number;
    requiredSkills: string[];
    estimatedTime: string;
    keyTechnologies: string[];
    kitComponents: string[];
    machinesNeeded: string[];
  };
  commercial: {
    revenue: string;
    customers: string[];
    competition: string;
    moat: string;
    localAffordability: string;
    offlineCapability: string;
  };
  execution: {
    phases: Array<{
      name: string;
      duration: string;
      milestones: string[];
      resources: string[];
    }>;
    resourceOptimization: string;
    africaSpecificSolutions: string[];
  };
}

interface InnovationResponse {
  projectTitle: string;
  innovationLevel: string;
  commercialPotential: string;
  scalabilityFactor: number;
  marketSize: string;
  competitiveAdvantage: string;
  problemStatement: string;
  innovationUpgrade: string;
  solutionApproach: string;
  marketAnalysis: {
    existingSolutions: number;
    averageMarketPrice: string;
    marketGap: string;
    targetCustomers: string[];
  };
  recommendedComponents: Array<{
    category: string;
    component: string;
    purpose: string;
    estimatedCost: number;
    complexity: string;
  }>;
  estimatedTimeline: string;
  complexityLevel: number;
  teamRecommendations: Array<{
    role: string;
    skills: string[];
    responsibility: string;
    priority: string;
  }>;
  requiredSkills: string[];
  learningPath: Array<{
    module: string;
    duration: string;
    prerequisite: boolean;
    description: string;
  }>;
  commercialViability: {
    buildCost: number;
    marketPrice: number;
    roiTimeline: string;
    scalingPotential: string;
  };
}

interface SmartKit {
  kitCode: string;
  projectTitle: string;
  components: Array<{
    category: string;
    component: string;
    purpose: string;
    estimatedCost: number;
    complexity: string;
  }>;
  availability: {
    labReady: boolean;
    rentAvailable: boolean;
    purchaseAvailable: boolean;
  };
  pricing: {
    rentWeekly: number;
    purchasePrice: number;
  };
  assemblyInstructions: string;
  estimatedAssemblyTime: string;
  saharaSproutEligible: boolean;
}

export default function InnovationCatalystPage() {
  const [formData, setFormData] = useState<InnovationForm>({
    roughIdea: ''
  });
  const [innovationData, setInnovationData] = useState<InnovationResponse | null>(null);
  const [smartKit, setSmartKit] = useState<SmartKit | null>(null);
  const [collaborationData, setCollaborationData] = useState<any>(null);
  const [responseType, setResponseType] = useState<'innovation' | 'collaboration'>('innovation');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  const { user } = useAuth();
  const { addNotification } = useUIStore();
  const router = useRouter();

  // Draft management
  const DRAFT_KEY = 'innovation-catalyst-draft';
  const [draftTimestamp, setDraftTimestamp] = useState<string | null>(null);
  
  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        if (draft.formData) {
          setFormData(draft.formData);
        }
        if (draft.innovationData && draft.smartKit) {
          setInnovationData(draft.innovationData);
          setSmartKit(draft.smartKit);
          setShowResult(true);
          setDraftTimestamp(draft.timestamp);
          addNotification({
            type: 'info',
            title: 'Draft Restored',
            message: 'Your previous innovation analysis has been restored.'
          });
        } else if (draft.timestamp) {
          setDraftTimestamp(draft.timestamp);
        }
      } catch (error) {
        console.error('Error loading draft:', error);
        localStorage.removeItem(DRAFT_KEY);
      }
    }
  }, [addNotification]);

  // Save draft whenever data changes
  useEffect(() => {
    if (formData.roughIdea || innovationData) {
      const draft = {
        formData,
        innovationData,
        smartKit,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      setDraftTimestamp(draft.timestamp);
    }
  }, [formData, innovationData, smartKit]);

  // Clear draft when project is created successfully
  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setDraftTimestamp(null);
  };

  const handleCreateProject = async () => {
    if (!innovationData || !user) return;
    
    setIsCreatingProject(true);
    try {
      const projectData = {
        title: innovationData.projectTitle,
        description: innovationData.innovationUpgrade,
        problemStatement: innovationData.problemStatement,
        solution: innovationData.solutionApproach,
        type: 'other' as const, // Default type, can be enhanced later
        discipline: 'interdisciplinary' as const,
        isTeamProject: innovationData.teamRecommendations && innovationData.teamRecommendations.length > 1,
        maxTeamSize: innovationData.teamRecommendations ? Math.min(innovationData.teamRecommendations.length + 2, 6) : 4,
        tags: [
          innovationData.innovationLevel,
          innovationData.commercialPotential,
          ...(innovationData.requiredSkills?.slice(0, 3) || [])
        ],
        commercialPotential: `${innovationData.commercialPotential} potential with estimated ${innovationData.estimatedTimeline} timeline`,
        startDate: new Date().toISOString().split('T')[0],
        // Transform the AI analysis data to match expected structure
        aiAnalysis: {
          opportunity: {
            title: innovationData.projectTitle,
            description: innovationData.innovationUpgrade,
            marketSize: innovationData.marketSize,
            impact: innovationData.competitiveAdvantage,
            uniqueValue: innovationData.solutionApproach,
            africanContext: innovationData.marketAnalysis?.marketGap || 'Local innovation opportunity'
          },
          technical: {
            complexity: innovationData.complexityLevel,
            requiredSkills: innovationData.requiredSkills || [],
            estimatedTime: innovationData.estimatedTimeline,
            keyTechnologies: innovationData.recommendedComponents?.map(c => c.component) || [],
            kitComponents: innovationData.recommendedComponents?.filter(c => c.category === 'microcontroller' || c.category === 'sensor').map(c => c.component) || [],
            machinesNeeded: innovationData.recommendedComponents?.filter(c => c.category === 'actuator').map(c => c.component) || []
          },
          commercial: {
            revenue: `Build cost: $${innovationData.commercialViability?.buildCost || 0}, Market price: $${innovationData.commercialViability?.marketPrice || 0}`,
            customers: innovationData.marketAnalysis?.targetCustomers || [],
            competition: `${innovationData.marketAnalysis?.existingSolutions || 0} existing solutions at ${innovationData.marketAnalysis?.averageMarketPrice || 'unknown price'}`,
            moat: innovationData.competitiveAdvantage,
            localAffordability: `Estimated cost: $${innovationData.commercialViability?.buildCost || 0}`,
            offlineCapability: 'To be determined during development'
          },
          execution: {
            phases: innovationData.learningPath?.map(item => ({
              name: item.module,
              duration: item.duration,
              milestones: [item.description],
              resources: item.prerequisite ? ['Prerequisites required'] : ['Direct implementation']
            })) || [],
            resourceOptimization: `Timeline: ${innovationData.estimatedTimeline}, Complexity: ${innovationData.complexityLevel}/10`,
            africaSpecificSolutions: [`Scalability: ${innovationData.commercialViability?.scalingPotential || 'TBD'}`, 'Local resource optimization needed']
          }
        },
        originalIdea: formData.roughIdea
      };

      const response = await api.projects.create(projectData);
      
      if (response.success && response.data) {
        // Clear the draft since project was created successfully
        clearDraft();
        
        addNotification({
          type: 'success',
          title: 'Project Created!',
          message: `${innovationData.projectTitle} has been added to your innovation projects.`
        });
        
        // Navigate to the project page
        router.push(`/dashboard/projects/${response.data.id}`);
      } else {
        throw new Error('Failed to create project');
      }
    } catch (error: any) {
      console.error('Project Creation Error:', error);
      addNotification({
        type: 'error',
        title: 'Project Creation Failed',
        message: error.response?.data?.message || error.message || 'Could not create project. Please try again.'
      });
    } finally {
      setIsCreatingProject(false);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const response = await api.ai.analyzeAdvanced({
        problemDescription: formData.roughIdea,
        context: 'SproutLab Innovation Ecosystem - Focus on collaboration opportunities',
        includeKit: true
      });

      console.log('AI Response:', response);
      
      if (response.success && response.data) {
        // Check if this is a collaboration opportunity response
        if (response.data.type === 'collaboration_opportunity') {
          // Show collaboration opportunities instead of innovation analysis
          setCollaborationData(response.data.collaboration);
          setResponseType('collaboration');
          setIsAnalyzing(false);
          setTimeout(() => {
            setShowResult(true);
          }, 500);
        } else {
          // Standard innovation analysis response
          setInnovationData(response.data.innovation);
          setSmartKit(response.data.smartKit);
          // Also store any collaboration data if present
          if (response.data.collaboration) {
            setCollaborationData(response.data.collaboration);
          }
          setResponseType('innovation');
          setIsAnalyzing(false);
          setTimeout(() => {
            setShowResult(true);
          }, 500);
        }
      } else {
        throw new Error(response.message || 'Analysis failed');
      }
    } catch (error: any) {
      console.error('Analysis Error:', error);
      setIsAnalyzing(false);
      addNotification({
        type: 'error',
        title: 'Analysis Failed',
        message: error.response?.data?.message || error.message || 'Could not analyze your innovation. Please try again.'
      });
    }
  };

  const FloatingElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            delay: i * 1.5,
          }}
          style={{
            left: `${10 + i * 15}%`,
            top: `${20 + i * 10}%`,
          }}
        />
      ))}
    </div>
  );

  const AnalyzingAnimation = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-blue-900/95 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 mx-auto mb-8"
        >
          <div className="w-full h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full p-1">
            <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
              <Brain className="w-12 h-12 text-blue-400" />
            </div>
          </div>
        </motion.div>
        
        <motion.h2
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-3xl font-bold text-white mb-4"
        >
          AI Innovation Catalyst Analyzing...
        </motion.h2>
        
        <div className="space-y-2 text-gray-300">
          <motion.p
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
          >
            🔍 Analyzing market opportunities...
          </motion.p>
          <motion.p
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          >
            🧠 Processing technical feasibility...
          </motion.p>
          <motion.p
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
          >
            💰 Calculating commercial potential...
          </motion.p>
        </div>
      </div>
    </motion.div>
  );

  const ResultCard = ({ icon: Icon, title, value, description, gradient }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="relative group"
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity`} />
      <Card className="relative border-0 bg-white/10 backdrop-blur-md">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-lg flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-1">{title}</h3>
              {value ? (
                <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2 break-words">
                  {value}
                </p>
              ) : (
                <div className="h-6 w-24 bg-gray-600/30 animate-pulse rounded mb-2" />
              )}
              <p className="text-gray-300 text-xs">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 relative overflow-hidden">
      <FloatingElements />
      
      {isAnalyzing && <AnalyzingAnimation />}
      
      <div className="relative z-10 p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-block mb-6"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full p-1 mx-auto">
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                <Wand2 className="w-10 h-10 text-blue-400" />
              </div>
            </div>
          </motion.div>
          
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4">
            AI Innovation Catalyst
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Transform your rough ideas into billion-dollar breakthrough opportunities with our revolutionary AI system
          </p>
        </motion.div>

        {!showResult ? (
          /* Simple Idea Input */
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <Card className="border-0 bg-white/10 backdrop-blur-md">
                <CardContent className="p-12">
                  <div className="text-center mb-8">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Lightbulb className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                      Share Any Idea - We'll Make It African-Ready
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                      Don't worry about complexity, cost, or your experience level. Our AI will transform your idea into something 
                      <span className="text-blue-400 font-semibold"> scalable</span>, 
                      <span className="text-green-400 font-semibold"> commercially viable</span>, and 
                      <span className="text-purple-400 font-semibold"> ready for Africa</span>.
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <Textarea
                      value={formData.roughIdea}
                      onChange={(e) => setFormData({ ...formData, roughIdea: e.target.value })}
                      placeholder="Describe any problem you see or idea you have... 

Examples:
• 'Traffic jams are terrible in Kampala'
• 'Power keeps going out during exams'
• 'Water pumps break and villages have no clean water'
• 'Farmers don't know when to plant crops'
• 'Students can't afford textbooks'

Don't hold back - share whatever comes to mind!"
                      className="min-h-48 bg-white/5 border-white/20 text-white placeholder:text-gray-400 text-lg resize-none"
                    />
                    
                    {/* Draft Auto-Save Indicator */}
                    {(formData.roughIdea || innovationData) && (
                      <div className="flex items-center justify-center text-xs text-gray-400">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Draft saved automatically
                      </div>
                    )}
                    
                    <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-6">
                      <div className="flex items-start space-x-3">
                        <Brain className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-blue-300 mb-2">Our AI Will Automatically:</h3>
                          <ul className="text-gray-300 space-y-1 text-sm">
                            <li>• Find prototype solutions using our makerspace resources</li>
                            <li>• Design for scalability from campus to continental impact</li>
                            <li>• Connect you to SaharaSpout manufacturing opportunities</li>
                            <li>• Calculate realistic development and scaling costs</li>
                            <li>• Suggest funding pathways and partnership opportunities</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 text-center">
                    <Button
                      onClick={handleAnalyze}
                      disabled={!formData.roughIdea.trim()}
                      className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 hover:from-green-600 hover:via-blue-600 hover:to-purple-700 text-white px-12 py-4 text-xl font-semibold rounded-xl shadow-2xl transform transition-transform hover:scale-105"
                    >
                      <Sparkles className="w-6 h-6 mr-3" />
                      Transform Into Scalable Innovation
                    </Button>
                    <p className="text-gray-400 text-sm mt-3">
                      ⚡ Our AI analyzes in seconds - no limits, no barriers
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        ) : responseType === 'collaboration' ? (
          /* Collaboration Opportunities Display */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-6xl mx-auto space-y-8"
          >
            {/* Collaboration Header */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center mb-12"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 mx-auto mb-6"
              >
                <div className="w-full h-full bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 rounded-full p-1">
                  <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                    <Users className="w-12 h-12 text-orange-400" />
                  </div>
                </div>
              </motion.div>
              
              <h2 className="text-4xl font-bold text-white mb-4">
                🤝 Collaboration Opportunities Found!
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Great minds think alike! We found existing projects similar to your idea. Consider joining forces to accelerate innovation.
              </p>
            </motion.div>

            {/* Similar Projects */}
            {collaborationData?.similarProjects?.length > 0 && (
              <Card className="border-0 bg-white/5 backdrop-blur-md">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Target className="w-6 h-6 mr-3 text-orange-400" />
                    Similar Projects You Could Join
                  </h3>
                  
                  <div className="grid gap-6">
                    {collaborationData.similarProjects.map((project: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 rounded-xl p-6 border border-white/10"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-xl font-semibold text-white mb-2">
                              {project.projectTitle}
                            </h4>
                            <p className="text-gray-300 text-sm">
                              Led by {project.teamLeaderName} ({project.teamLeaderDiscipline})
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={`${
                              project.collaborationPotential === 'high' ? 'bg-green-600' :
                              project.collaborationPotential === 'medium' ? 'bg-yellow-600' :
                              'bg-gray-600'
                            } text-white`}>
                              {project.collaborationPotential} potential
                            </Badge>
                            <Badge className="bg-blue-600 text-white">
                              {Math.round(project.similarityScore * 100)}% match
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h5 className="text-sm font-semibold text-gray-300 mb-2">Why this is a great match:</h5>
                          <ul className="text-sm text-gray-400 space-y-1">
                            {project.similarityReasons.map((reason: string, reasonIndex: number) => (
                              <li key={reasonIndex} className="flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2 text-green-400 flex-shrink-0" />
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Collaboration Suggestions */}
            {collaborationData?.collaborationSuggestions?.length > 0 && (
              <Card className="border-0 bg-white/5 backdrop-blur-md">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Lightbulb className="w-6 h-6 mr-3 text-yellow-400" />
                    Collaboration Recommendations
                  </h3>
                  
                  <div className="space-y-6">
                    {collaborationData.collaborationSuggestions.map((suggestion: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 rounded-xl p-6 border border-white/10"
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`p-3 rounded-full ${
                            suggestion.type === 'join_existing' ? 'bg-green-500/20 text-green-400' :
                            suggestion.type === 'start_new' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-purple-500/20 text-purple-400'
                          }`}>
                            {suggestion.type === 'join_existing' ? <Users className="w-6 h-6" /> :
                             suggestion.type === 'start_new' ? <Rocket className="w-6 h-6" /> :
                             <Zap className="w-6 h-6" />}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-white mb-2">
                              {suggestion.recommendation}
                            </h4>
                            <p className="text-gray-300 mb-3">
                              {suggestion.reasoning}
                            </p>
                            <p className="text-sm text-gray-400 mb-4">
                              <strong>Benefits:</strong> {suggestion.benefitsForBoth}
                            </p>
                            <div>
                              <h5 className="text-sm font-semibold text-gray-300 mb-2">Next Steps:</h5>
                              <ul className="text-sm text-gray-400 space-y-1">
                                {suggestion.nextSteps?.map((step: string, stepIndex: number) => (
                                  <li key={stepIndex} className="flex items-center">
                                    <ArrowRight className="w-3 h-3 mr-2 text-blue-400 flex-shrink-0" />
                                    {step}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lab Visit Info Card */}
            <Card className="border-0 bg-gradient-to-r from-orange-500/10 to-pink-500/10 backdrop-blur-md border border-orange-400/20">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-full bg-orange-500/20 text-orange-400">
                    <Users className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-3">
                      🏢 Visit SproutLab for Team Introductions
                    </h3>
                    <p className="text-gray-300 mb-4">
                      The best collaborations happen in person! Come to our lab where we'll introduce you to the team leaders and help you explore how your skills and ideas can contribute to existing projects.
                    </p>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <h4 className="text-sm font-semibold text-orange-300 mb-2">What happens at the lab:</h4>
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li className="flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-400 flex-shrink-0" />
                          Meet team leaders and current project members
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-400 flex-shrink-0" />
                          Discuss how your idea can enhance existing projects
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-400 flex-shrink-0" />
                          Explore collaboration opportunities and team roles
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-400 flex-shrink-0" />
                          Get hands-on with the actual project prototypes
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => {
                  setFormData({ roughIdea: '' });
                  setShowResult(false);
                  setCollaborationData(null);
                  setResponseType('innovation');
                  // Clear draft
                  localStorage.removeItem('innovation-catalyst-draft');
                  setDraftTimestamp(null);
                }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-xl"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Try Different Idea
              </Button>
              <Button
                onClick={async () => {
                  // Force AI analysis even when collaboration opportunities exist
                  setIsAnalyzing(true);
                  try {
                    // Send the same request as the original analysis, but skip collaboration check
                    const response = await api.ai.analyzeAdvanced({
                      problemDescription: formData.roughIdea,
                      context: 'SproutLab Innovation Ecosystem - Focus on collaboration opportunities',
                      includeKit: true,
                      skipCollaborationCheck: true // Skip collaboration check this time
                    });

                    if (response.success && response.data) {
                      // Should get innovation analysis since we skipped collaboration check
                      if (response.data.type === 'innovation_analysis') {
                        setInnovationData(response.data.innovation);
                        setSmartKit(response.data.smartKit);
                      } else {
                        // Fallback - treat as innovation data directly
                        setInnovationData(response.data.innovation || response.data);
                        setSmartKit(response.data.smartKit);
                      }
                      setResponseType('innovation');
                      setIsAnalyzing(false);
                      setTimeout(() => {
                        setShowResult(true);
                      }, 500);
                    }
                  } catch (error) {
                    console.error('AI Analysis failed:', error);
                    setIsAnalyzing(false);
                  }
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-xl"
              >
                <Lightbulb className="w-5 h-5 mr-2" />
                Create My Own Project Instead
              </Button>
            </div>
          </motion.div>
        ) : (
          /* AI Results Display */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-6xl mx-auto space-y-8"
          >
            {/* Hero Result */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 mx-auto mb-6"
              >
                <div className="w-full h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-full p-1">
                  <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-12 h-12 text-green-400" />
                  </div>
                </div>
              </motion.div>
              
              <h2 className="text-4xl font-bold text-white mb-4">
                🎉 Innovation Opportunity Discovered!
              </h2>
              <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-4">
                {innovationData?.projectTitle}
              </h3>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                {innovationData?.innovationUpgrade}
              </p>
              
              {/* Innovation Level Badge */}
              {innovationData?.innovationLevel && (
                <div className="flex justify-center mt-4">
                  <Badge 
                    className={`px-4 py-2 text-sm font-semibold ${
                      innovationData.innovationLevel === 'breakthrough' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' :
                      innovationData.innovationLevel === 'advanced' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' :
                      innovationData.innovationLevel === 'intermediate' ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white' :
                      'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                    }`}
                  >
                    {innovationData.innovationLevel.charAt(0).toUpperCase() + innovationData.innovationLevel.slice(1)} Innovation
                  </Badge>
                </div>
              )}
            </motion.div>

            {/* Problem & Solution Analysis */}
            {(innovationData?.problemStatement || innovationData?.solutionApproach || innovationData?.competitiveAdvantage) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-12"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {innovationData?.problemStatement && (
                    <Card className="border-0 bg-red-500/10 backdrop-blur-md border-red-400/20">
                      <CardContent className="p-6">
                        <h4 className="font-bold text-red-400 mb-3 flex items-center">
                          <Target className="w-5 h-5 mr-2" />
                          Problem Analysis
                        </h4>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {innovationData.problemStatement}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                  
                  {innovationData?.solutionApproach && (
                    <Card className="border-0 bg-blue-500/10 backdrop-blur-md border-blue-400/20">
                      <CardContent className="p-6">
                        <h4 className="font-bold text-blue-400 mb-3 flex items-center">
                          <Lightbulb className="w-5 h-5 mr-2" />
                          Solution Approach
                        </h4>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {innovationData.solutionApproach}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                  
                  {innovationData?.competitiveAdvantage && (
                    <Card className="border-0 bg-green-500/10 backdrop-blur-md border-green-400/20">
                      <CardContent className="p-6">
                        <h4 className="font-bold text-green-400 mb-3 flex items-center">
                          <Star className="w-5 h-5 mr-2" />
                          Competitive Edge
                        </h4>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {innovationData.competitiveAdvantage}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </motion.div>
            )}

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <ResultCard
                icon={DollarSign}
                title="Market Size"
                value={innovationData?.marketSize}
                description="Total addressable market"
                gradient="from-green-500 to-emerald-600"
              />
              <ResultCard
                icon={Users}
                title="Commercial Potential"
                value={innovationData?.commercialPotential}
                description="Business viability level"
                gradient="from-blue-500 to-cyan-600"
              />
              <ResultCard
                icon={Clock}
                title="Timeline"
                value={innovationData?.estimatedTimeline}
                description="Estimated development time"
                gradient="from-purple-500 to-violet-600"
              />
              <ResultCard
                icon={TrendingUp}
                title="Complexity"
                value={innovationData?.complexityLevel ? `${innovationData.complexityLevel}/10` : undefined}
                description="Technical difficulty level"
                gradient="from-orange-500 to-red-600"
              />
            </div>

            {/* Detailed Innovation Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Technical & Kit Details */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-0 bg-white/10 backdrop-blur-md h-full">
                  <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Wrench className="w-5 h-5 mr-2 text-orange-400" />
                    Your Innovation Development Kit
                  </h3>                    <div className="space-y-4">
                      {smartKit?.components && (
                        <div>
                          <h4 className="font-semibold text-gray-300 mb-2">🔧 SproutLab Makerspace Components</h4>
                          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                            {smartKit.components.map((component, i) => (
                              <Badge key={i} variant="outline" className="border-orange-400/50 text-orange-300 text-xs">
                                {component.component}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {innovationData?.requiredSkills && (
                        <div>
                          <h4 className="font-semibold text-gray-300 mb-2">📚 Skills You'll Learn</h4>
                          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                            {innovationData.requiredSkills.map((skill, i) => (
                              <Badge key={i} variant="outline" className="border-green-400/50 text-green-300 text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {smartKit?.pricing && (
                        <div>
                          <h4 className="font-semibold text-gray-300 mb-2">� Kit Pricing</h4>
                          <div className="space-y-2">
                            <p className="text-blue-400">Weekly Rent: ${smartKit.pricing.rentWeekly}</p>
                            <p className="text-green-400">Purchase: ${smartKit.pricing.purchasePrice}</p>
                            {smartKit.saharaSproutEligible && (
                              <Badge className="bg-purple-600">SaharaSpout Manufacturing Ready</Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* African Context & Commercial */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="border-0 bg-white/10 backdrop-blur-md h-full">
                  <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-green-400" />
                    Scaling & Impact Potential
                  </h3>                    <div className="space-y-4">
                      {innovationData?.marketAnalysis?.marketGap && (
                        <div>
                          <h4 className="font-semibold text-gray-300 mb-2">🌍 Market Context</h4>
                          <p className="text-gray-300 text-sm">
                            {innovationData.marketAnalysis.marketGap}
                          </p>
                        </div>
                      )}

                      {innovationData?.marketAnalysis?.existingSolutions !== undefined && (
                        <div>
                          <h4 className="font-semibold text-gray-300 mb-2">🔍 Market Landscape</h4>
                          <div className="space-y-1">
                            <p className="text-blue-400">Existing Solutions: {innovationData.marketAnalysis.existingSolutions}</p>
                            {innovationData?.marketAnalysis?.averageMarketPrice && (
                              <p className="text-green-400">Average Market Price: {innovationData.marketAnalysis.averageMarketPrice}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {innovationData?.marketAnalysis?.targetCustomers && (
                        <div>
                          <h4 className="font-semibold text-gray-300 mb-2">🎯 Target Market</h4>
                          <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                            {innovationData.marketAnalysis.targetCustomers.map((customer: string, i: number) => (
                              <Badge key={i} variant="outline" className="border-blue-400/50 text-blue-300 text-xs">
                                {customer}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {innovationData?.commercialViability?.buildCost && (
                        <div>
                          <h4 className="font-semibold text-gray-300 mb-2">💰 Market Affordability</h4>
                          <div className="space-y-1">
                            <p className="text-green-400 font-bold">Build Cost: ${innovationData.commercialViability.buildCost}</p>
                            <p className="text-blue-400 font-bold">Market Price: ${innovationData.commercialViability.marketPrice}</p>
                            <p className="text-purple-400">ROI: {innovationData.commercialViability.roiTimeline}</p>
                          </div>
                        </div>
                      )}

                      {innovationData?.scalabilityFactor && (
                        <div>
                          <h4 className="font-semibold text-gray-300 mb-2">� Scalability Score</h4>
                          <div className="flex items-center space-x-2">
                            <div className="text-purple-400 font-bold text-lg">
                              {innovationData.scalabilityFactor}/10
                            </div>
                            <div className="flex-1 bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                                style={{ width: `${(innovationData.scalabilityFactor / 10) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {innovationData?.commercialViability?.scalingPotential && (
                        <div>
                          <h4 className="font-semibold text-gray-300 mb-2">🌍 Scaling Strategy</h4>
                          <p className="text-blue-400 font-semibold">
                            {innovationData.commercialViability.scalingPotential}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Technical Components */}
            {innovationData?.recommendedComponents && innovationData.recommendedComponents.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-12"
              >
                <Card className="border-0 bg-white/10 backdrop-blur-md">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                      <Wrench className="w-5 h-5 mr-2 text-orange-400" />
                      Technical Components Required
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {innovationData.recommendedComponents.map((component, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          className="relative"
                        >
                          <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-lg p-4 border border-white/10 h-full">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-white text-sm">{component.component}</h4>
                              <Badge 
                                className={`text-xs ${
                                  component.complexity === 'advanced' ? 'bg-red-600' :
                                  component.complexity === 'intermediate' ? 'bg-orange-600' :
                                  'bg-green-600'
                                }`}
                              >
                                {component.complexity}
                              </Badge>
                            </div>
                            <p className="text-gray-400 text-xs mb-2 capitalize">{component.category}</p>
                            <p className="text-gray-300 text-xs mb-3">{component.purpose}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-green-400 font-semibold text-sm">${component.estimatedCost}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Learning Roadmap */}
            {innovationData?.learningPath && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-12"
              >
                <Card className="border-0 bg-white/10 backdrop-blur-md">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                      <Rocket className="w-5 h-5 mr-2 text-pink-400" />
                      Learning & Development Roadmap
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {innovationData.learningPath.map((module, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 + i * 0.1 }}
                          className="relative"
                        >
                          <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-lg p-4 border border-white/10">
                            <div className="flex items-center mb-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                                {i + 1}
                              </div>
                              <div>
                                <h4 className="font-semibold text-white">{module.module}</h4>
                                <p className="text-gray-400 text-sm">{module.duration}</p>
                              </div>
                            </div>
                            <p className="text-gray-300 text-sm">{module.description}</p>
                            {module.prerequisite && (
                              <Badge className="mt-2 bg-yellow-600 text-xs">Prerequisite Required</Badge>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center space-x-4"
            >
              <Button
                onClick={() => {
                  setShowResult(false);
                  setFormData({ roughIdea: '' });
                  setInnovationData(null);
                  setSmartKit(null);
                  clearDraft(); // Clear saved draft
                  setDraftTimestamp(null);
                }}
                variant="outline"
                className="bg-accent-foreground border-white/20 text-white hover:bg-white/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Another Idea
              </Button>
              <Button 
                onClick={handleCreateProject}
                disabled={isCreatingProject || !innovationData}
                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreatingProject ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Creating Project...
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4 mr-2" />
                    Start This Project
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
