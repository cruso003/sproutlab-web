'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge'; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Brain, 
  CheckCircle, 
  AlertTriangle, 
  Settings, 
  Lightbulb, 
  Target, 
  TrendingUp,
  Loader2,
  RefreshCw,
  Sparkles,
  Zap
} from 'lucide-react';
import { useAIClassification } from '@/lib/hooks';
import { useProjectCreationStore } from '@/lib/stores';
import { AIClassification } from '@/lib/types';

interface AIAnalysisStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

const projectCategories = [
  { value: 'iot-hardware', label: 'IoT Hardware System' },
  { value: 'smart-infrastructure', label: 'Smart Infrastructure' },
  { value: 'monitoring-system', label: 'Monitoring System' },
  { value: 'mobile-application', label: 'Mobile Application' },
  { value: 'ai-ml-system', label: 'AI/ML System' },
  { value: 'automation-system', label: 'Automation System' },
  { value: 'web-platform', label: 'Web Platform' },
];

const complexityLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export function AIAnalysisStep({ onNext, onPrevious }: AIAnalysisStepProps) {
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedComplexity, setSelectedComplexity] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  
  // Zustand store
  const {
    projectData,
    aiClassification,
    updateProjectData,
    setAIClassification,
    isClassifying,
    classificationError,
    setClassifying,
    setClassificationError,
  } = useProjectCreationStore();

  // AI hooks
  const {
    classifyProjectAsync,
    categories,
    categoriesLoading,
  } = useAIClassification();

  // Auto-classify when component mounts if data is available
  useEffect(() => {
    if (projectData.title && projectData.description && projectData.problemStatement && !aiClassification && !isClassifying) {
      handleAutoClassify();
    }
  }, [projectData.title, projectData.description, projectData.problemStatement]);

  const handleAutoClassify = async () => {
    if (!projectData.title || !projectData.description || !projectData.problemStatement) {
      return;
    }

    try {
      setClassifying(true);
      setClassificationError(null);
      
      const result = await classifyProjectAsync({
        title: projectData.title,
        description: projectData.description,
        problemStatement: projectData.problemStatement,
      });

      if (result?.data) {
        console.log('AI Classification Result:', result.data);
        console.log('Category:', result.data.category, typeof result.data.category);
        console.log('Subcategory:', result.data.subcategory, typeof result.data.subcategory);
        console.log('Complexity:', result.data.complexity, typeof result.data.complexity);
        
        setAIClassification(result.data);
        // Also update the project data with AI suggestions
        updateProjectData({
          category: result.data.category,
          subcategory: result.data.subcategory,
          complexity: result.data.complexity,
          skills: result.data.skills,
          resources: result.data.resources,
        });
      } else {
        console.warn('No data in AI classification result:', result);
      }
    } catch (error: any) {
      console.error('AI Classification failed:', error);
      setClassificationError(
        error?.response?.data?.message || 
        'AI analysis is currently unavailable. You can proceed and refine your project classification later.'
      );
    } finally {
      setClassifying(false);
    }
  };

  const handleCustomize = () => {
    setCustomizeOpen(true);
    if (aiClassification) {
      setSelectedCategory(aiClassification.category);
      setSelectedSubcategory(aiClassification.subcategory || '');
      setSelectedComplexity(aiClassification.complexity);
    }
  };

  const handleSaveCustomization = () => {
    if (!aiClassification) return;
    
    const customClassification: AIClassification = {
      category: selectedCategory,
      subcategory: selectedSubcategory,
      complexity: selectedComplexity,
      skills: aiClassification.skills,
      resources: aiClassification.resources,
      reasoning: 'Manually customized by user',
    };
    
    setAIClassification(customClassification);
    updateProjectData({
      category: selectedCategory,
      subcategory: selectedSubcategory,
      complexity: selectedComplexity,
    });
    
    setCustomizeOpen(false);
  };

  const handleRetry = () => {
    setClassificationError(null);
    handleAutoClassify();
  };

  const handleContinueWithoutAI = () => {
    const manualClassification: AIClassification = {
      category: 'General',
      subcategory: 'Other',
      complexity: 'beginner',
      skills: [],
      resources: [],
      reasoning: 'Proceeded without AI classification - can be refined later',
    };
    
    setAIClassification(manualClassification);
    updateProjectData({
      category: 'General',
      subcategory: 'Other',
      complexity: 'beginner',
    });
  };

  const formatLabel = (value: string | undefined) => {
    console.log('formatLabel called with:', value, typeof value);
    if (!value || typeof value !== 'string') {
      console.warn('formatLabel received invalid value:', value);
      return 'Unknown';
    }
    return value.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const renderAnalysisStatus = () => {
    if (isClassifying) {
      return (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-4">
            <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Analyzing Your Project...
          </h3>
          <p className="text-gray-600">
            Our AI is examining your project details and determining the best classification.
          </p>
        </div>
      );
    }

    if (classificationError) {
      return (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="text-xl font-semibold text-amber-900 mb-2">
            AI Analysis Unavailable
          </h3>
          <p className="text-amber-700 mb-6 max-w-md mx-auto">
            {classificationError}
          </p>
          <div className="flex justify-center space-x-3">
            <Button onClick={handleRetry} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button onClick={handleContinueWithoutAI} className="bg-green-600 hover:bg-green-700">
              Continue Anyway
            </Button>
          </div>
        </div>
      );
    }

    if (aiClassification) {
      return (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            AI Analysis Complete!
          </h3>
          <div className="flex items-center justify-center space-x-4 mb-6">
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              AI Powered
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Smart Classification
            </Badge>
          </div>
        </div>
      );
    }

    // Initial prompt state
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-4">
          <Brain className="w-10 h-10 text-purple-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Ready for AI Analysis
        </h3>
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          Let our AI analyze your project and automatically categorize it with intelligent suggestions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Lightbulb className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h4 className="font-medium text-blue-900 mb-2">Smart Categorization</h4>
            <p className="text-sm text-blue-700">
              Automatically classify your project type and complexity
            </p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h4 className="font-medium text-green-900 mb-2">Skill Mapping</h4>
            <p className="text-sm text-green-700">
              Identify required skills and learning opportunities
            </p>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <Target className="w-8 h-8 text-orange-600 mx-auto mb-3" />
            <h4 className="font-medium text-orange-900 mb-2">Resource Planning</h4>
            <p className="text-sm text-orange-700">
              Suggest equipment and materials needed
            </p>
          </div>
        </div>

        <Button 
          onClick={handleAutoClassify}
          disabled={!projectData.title || !projectData.description || !projectData.problemStatement}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Zap className="w-5 h-5 mr-3" />
          Start AI Analysis
        </Button>

        {(!projectData.title || !projectData.description || !projectData.problemStatement) && (
          <p className="text-sm text-amber-600 mt-4">
            Complete your project details in the previous step to enable AI analysis
          </p>
        )}
      </div>
    );
  };

  const renderClassificationResults = () => {
    if (!aiClassification) return null;

    return (
      <div className="mb-8 p-6 rounded-lg border bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-semibold text-purple-900">Smart Project Classification</h3>
          </div>
          
          <Dialog open={customizeOpen} onOpenChange={setCustomizeOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" onClick={handleCustomize}>
                <Settings className="w-4 h-4 mr-2" />
                Customize
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Customize Classification</DialogTitle>
                <DialogDescription>
                  Adjust the AI's suggestions to better match your vision
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectCategories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Complexity</label>
                  <Select value={selectedComplexity} onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => setSelectedComplexity(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select complexity" />
                    </SelectTrigger>
                    <SelectContent>
                      {complexityLevels.map(level => (
                        <SelectItem key={level.value} value={level.value as 'beginner' | 'intermediate' | 'advanced'}>{level.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setCustomizeOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveCustomization}>
                  Apply Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="p-4 bg-white rounded-lg border border-purple-200">
            <h4 className="font-medium text-purple-900 mb-2">Category</h4>
            <Badge className="bg-blue-600">{formatLabel(aiClassification.category)}</Badge>
          </div>
          
          {aiClassification.subcategory && (
            <div className="p-4 bg-white rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-900 mb-2">Subcategory</h4>
              <Badge className="bg-green-600">{formatLabel(aiClassification.subcategory)}</Badge>
            </div>
          )}
          
          <div className="p-4 bg-white rounded-lg border border-purple-200">
            <h4 className="font-medium text-purple-900 mb-2">Complexity</h4>
            <Badge className="bg-purple-600">{formatLabel(aiClassification.complexity)}</Badge>
          </div>
        </div>

        {aiClassification.skills && aiClassification.skills.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-purple-900 mb-2">Required Skills:</h4>
            <div className="flex flex-wrap gap-2">
              {aiClassification.skills.map((skill: string) => (
                <Badge key={skill} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {aiClassification.resources && aiClassification.resources.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-purple-900 mb-2">Suggested Resources:</h4>
            <div className="flex flex-wrap gap-2">
              {aiClassification.resources.map((resource: string) => (
                <Badge key={resource} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {resource}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div className="p-3 bg-white rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-1">AI Reasoning:</h4>
          <p className="text-sm text-gray-700">{aiClassification.reasoning}</p>
        </div>
      </div>
    );
  };

  return (
    <Card className="mx-auto max-w-5xl">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center text-2xl">
          <Brain className="w-8 h-8 mr-3 text-purple-600" />
          AI Project Analysis & Smart Classification
        </CardTitle>
        <CardDescription>
          Let our AI analyze your project and provide intelligent categorization
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderClassificationResults()}
        {renderAnalysisStatus()}

        <div className="flex justify-between items-center mt-8">
          <Button onClick={onPrevious} variant="outline">
            Previous
          </Button>
          
          <Button 
            onClick={onNext}
            disabled={!aiClassification}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Continue to Team Setup
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default AIAnalysisStep;
