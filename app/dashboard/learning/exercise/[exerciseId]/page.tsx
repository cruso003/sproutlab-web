'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, Wrench, CheckCircle, ChevronRight } from 'lucide-react';
import api from '@/lib/api';

interface ExerciseStep {
  instruction: string;
  tips?: string;
  equipment?: string;
}

interface ExerciseData {
  id: string;
  title: string;
  description: string;
  steps: ExerciseStep[];
  expectedOutcome: string;
  estimatedTime: string;
  difficulty: string;
  skill: string;
}

export default function ExerciseViewerPage() {
  const router = useRouter();
  const params = useParams();
  const exerciseId = params.exerciseId as string;
  
  const [exercise, setExercise] = useState<ExerciseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [projectId, setProjectId] = useState<string | null>(null);

  useEffect(() => {
    // Get projectId from URL search params
    const urlParams = new URLSearchParams(window.location.search);
    const urlProjectId = urlParams.get('projectId');
    if (urlProjectId) {
      setProjectId(urlProjectId);
    }

    if (exerciseId) {
      fetchExercise();
    }
  }, [exerciseId]);

  const fetchExercise = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.learning.getExercise(exerciseId);
      if (response.success && response.data) {
        setExercise(response.data);
      } else {
        setError('Failed to load exercise content');
      }
    } catch (err: any) {
      console.error('Error fetching exercise:', err);
      setError(err.message || 'Failed to load exercise content');
    } finally {
      setLoading(false);
    }
  };

  const markAsCompleted = async () => {
    if (!exercise || !projectId) {
      console.error('Missing exercise or projectId:', { exercise: !!exercise, projectId });
      return;
    }
    
    try {
      const response = await api.learning.saveProgress({
        projectId,
        itemId: exercise.id,
        itemType: 'exercise',
        completed: true,
        xpEarned: 50
      });
      
      if (response.success) {
        setCompleted(true);
        console.log('Progress saved successfully! +50 XP earned');
      } else {
        console.error('Failed to save progress');
      }
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const nextStep = () => {
    if (exercise && currentStep < exercise.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-white hover:bg-white/10 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Learning
            </Button>
            <h1 className="text-3xl font-bold text-white mb-2">Loading Exercise...</h1>
          </div>
          
          <div className="space-y-6">
            <div className="h-20 bg-white/10 rounded-lg animate-pulse"></div>
            <div className="h-96 bg-white/10 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !exercise) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-red-900/30 border-red-400/20">
            <CardContent className="p-6 text-center">
              <h2 className="text-white font-semibold mb-2">Failed to Load Exercise</h2>
              <p className="text-gray-300 mb-4">{error || 'Exercise not found'}</p>
              <div className="flex gap-2 justify-center">
                <Button onClick={fetchExercise} variant="outline">
                  Try Again
                </Button>
                <Button onClick={() => router.back()}>
                  Go Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentStepData = exercise.steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-white hover:bg-white/10 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Learning
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{exercise.title}</h1>
              <p className="text-gray-300">{exercise.description}</p>
            </div>
            
            {completed && (
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span>Completed</span>
              </div>
            )}
          </div>
        </div>

        {/* Exercise Meta */}
        <Card className="bg-white/5 border-white/10 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">{exercise.estimatedTime}</span>
              </div>
              <Badge variant="secondary" className="bg-blue-600/20 text-blue-300">
                {exercise.difficulty}
              </Badge>
              <Badge variant="outline" className="border-purple-400/30 text-purple-300">
                {exercise.skill}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Progress Indicator */}
        <Card className="bg-white/5 border-white/10 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">Progress</span>
              <span className="text-gray-300 text-sm">
                Step {currentStep + 1} of {exercise.steps.length}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`bg-blue-500 h-2 rounded-full transition-all duration-300 ${
                  currentStep === 0 ? 'w-1/6' :
                  currentStep === 1 ? 'w-2/6' :
                  currentStep === 2 ? 'w-3/6' :
                  currentStep === 3 ? 'w-4/6' :
                  currentStep === 4 ? 'w-5/6' :
                  currentStep >= 5 ? 'w-full' : 'w-1/6'
                }`}
              ></div>
            </div>
          </CardContent>
        </Card>

        {/* Current Step */}
        <Card className="bg-white/5 border-white/10 mb-6">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Wrench className="w-5 h-5 text-blue-400" />
              <CardTitle className="text-white">Step {currentStep + 1}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-white font-medium mb-2">Instructions</h4>
              <p className="text-gray-300">{currentStepData.instruction}</p>
            </div>
            
            {currentStepData.tips && (
              <div>
                <h4 className="text-yellow-400 font-medium mb-2">💡 Tips</h4>
                <p className="text-gray-300">{currentStepData.tips}</p>
              </div>
            )}
            
            {currentStepData.equipment && (
              <div>
                <h4 className="text-blue-400 font-medium mb-2">🔧 Equipment Needed</h4>
                <p className="text-gray-300">{currentStepData.equipment}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="text-white border-white/20"
          >
            Previous Step
          </Button>
          
          {currentStep < exercise.steps.length - 1 ? (
            <Button
              onClick={nextStep}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Next Step
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={markAsCompleted}
              disabled={completed || !projectId}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {projectId ? 'Complete Exercise (+50 XP)' : 'Cannot Save Progress'}
            </Button>
          )}
        </div>

        {/* Expected Outcome */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Expected Outcome</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">{exercise.expectedOutcome}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
