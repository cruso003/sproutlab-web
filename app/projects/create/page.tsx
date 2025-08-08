"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight,
  Lightbulb,
  Brain,
  Users,
  Calendar,
  Rocket
} from 'lucide-react';

// Import step components
import { IdeationStep } from './components/IdeationStep';
import { AIAnalysisStep } from './components/AIAnalysisStep';
import { TeamSetupStep } from './components/TeamSetupStep';
import { PlanningStep } from './components/PlanningStep';
import { LaunchStep } from './components/LaunchStep';

// Import hooks and stores
import { useProjectCreationStore } from '@/lib/stores';
import { useProjectCreation, useAIInnovationAnalysis, useAITeamSuggestions } from '@/lib/hooks';

const STEPS = [
  { id: 1, title: 'Your Idea', icon: Lightbulb, description: 'Tell us your vision' },
  { id: 2, title: 'AI Insights', icon: Brain, description: 'Get smart suggestions' },
  { id: 3, title: 'Build Your Team', icon: Users, description: 'Find collaborators' },
  { id: 4, title: 'Plan & Resources', icon: Calendar, description: 'Set timeline & tools' },
  { id: 5, title: 'Launch', icon: Rocket, description: 'Start building!' }
];

export default function CreateProjectPage() {
  const router = useRouter();

  // Zustand store
  const {
    currentStep,
    projectData,
    nextStep,
    previousStep,
    resetWizard,
  } = useProjectCreationStore();

  // API hooks
  const { createProjectAsync, isCreating, createError, createSuccess } = useProjectCreation();
  const { analyzeInnovationAsync, isAnalyzing, analysisError } = useAIInnovationAnalysis();
  const { suggestTeamAsync, isSuggesting, suggestionsError } = useAITeamSuggestions();

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      // Optional: Reset wizard when leaving the page
      // resetWizard();
    };
  }, []);

  // Handle successful project creation
  useEffect(() => {
    if (createSuccess) {
      router.push('/projects');
    }
  }, [createSuccess, router]);

  const handleRunAIAnalysis = async () => {
    try {
      const analysis = await analyzeInnovationAsync({
        title: projectData.title,
        description: projectData.description,
        problemStatement: projectData.problemStatement,
        type: projectData.category, // Using category as type
        discipline: projectData.subcategory, // Using subcategory as discipline
        industry: projectData.category, // Using category as industry fallback
        tags: projectData.skills // Using skills as tags
      });

      if (analysis) {
        console.log('AI Analysis completed:', analysis);
      }
    } catch (error) {
      console.error('AI Analysis failed:', error);
    }
  };

  const handleGetTeamSuggestions = async () => {
    try {
      const suggestions = await suggestTeamAsync({
        title: projectData.title,
        description: projectData.description,
        requiredSkills: projectData.skills,
        maxTeamSize: 4, // Default team size
        type: projectData.category
      });

      if (suggestions) {
        console.log('Team suggestions completed:', suggestions);
      }
    } catch (error) {
      console.error('Team suggestions failed:', error);
    }
  };

  const handleCreateProject = async () => {
    try {
      const result = await createProjectAsync(projectData);
      if (result) {
        console.log('Project created:', result);
        // Success is handled by useEffect above
      }
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  // Navigation functions using store actions
  const handleNextStep = () => {
    nextStep();
  };

  const handlePrevStep = () => {
    previousStep();
  };

  const goToStep = (step: number) => {
    useProjectCreationStore.getState().goToStep(step);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return projectData.title && projectData.description && projectData.problemStatement;
      case 2:
        return true; // AI step can always proceed
      default:
        return true;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        // Will need to update IdeationStep to use store directly
        return <div>Ideation Step - TODO: Update to use store</div>;
      case 2:
        return <AIAnalysisStep onNext={handleNextStep} onPrevious={handlePrevStep} />;
      case 3:
        // Will need to update TeamSetupStep to use store directly  
        return <div>Team Setup Step - TODO: Update to use store</div>;
      case 4:
        // Will need to update PlanningStep to use store directly
        return <div>Planning Step - TODO: Update to use store</div>;
      case 5:
        // Will need to update LaunchStep to use store directly
        return <div>Launch Step - TODO: Update to use store</div>;
      default:
        return <div>Ideation Step - TODO: Update to use store</div>;
    }
  };  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Turn Your Idea Into Reality ✨
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start with your rough idea - our AI will help organize, analyze, and guide you through building it
          </p>
        </div>

        {/* Progress Steps */}
        <Card className="mb-8 max-w-5xl mx-auto">
          <CardContent className="pt-6">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-600">
                  Step {currentStep} of {STEPS.length}
                </span>
                <span className="text-sm font-medium text-gray-600">
                  {Math.round((currentStep / STEPS.length) * 100)}% Complete
                </span>
              </div>
              <Progress value={(currentStep / STEPS.length) * 100} className="h-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {STEPS.map((step) => {
                const Icon = step.icon;
                const isCompleted = currentStep > step.id;
                const isCurrent = currentStep === step.id;
                
                return (
                  <button
                    key={step.id}
                    onClick={() => goToStep(step.id)}
                    className={`p-4 rounded-lg text-center transition-all duration-200 ${
                      isCompleted
                        ? 'bg-green-100 text-green-800 border-2 border-green-200'
                        : isCurrent
                        ? 'bg-blue-100 text-blue-800 border-2 border-blue-200 ring-2 ring-blue-100'
                        : 'bg-gray-50 text-gray-500 border-2 border-gray-100 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-center mb-2">
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <h3 className="font-medium text-sm">{step.title}</h3>
                    <p className="text-xs mt-1 opacity-75">{step.description}</p>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Current Step Content */}
        <div className="mb-8">
          {renderCurrentStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center max-w-5xl mx-auto">
          <Button
            variant="outline"
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="text-center">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {STEPS[currentStep - 1]?.title || 'Unknown Step'}
            </Badge>
          </div>

          {currentStep < STEPS.length ? (
            <Button
              onClick={handleNextStep}
              disabled={!canProceed()}
              className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <div className="w-20" /> // Spacer for alignment
          )}
        </div>
      </div>
    </div>
  );
}
