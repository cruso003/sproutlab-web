import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Sparkles, Zap, Clock, Users, Brain } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ProjectFormData {
  title: string;
  description: string;
  problemStatement: string;
}

interface IdeationStepProps {
  formData: ProjectFormData;
  onFormDataChange: (updates: Partial<ProjectFormData>) => void;
}

export function IdeationStep({ formData, onFormDataChange }: IdeationStepProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [quickSuggestions, setQuickSuggestions] = useState<string[]>([]);

  // Smart suggestions based on what they're typing
  useEffect(() => {
    if (formData.description.length > 20) {
      // Simulate AI-powered suggestions based on their description
      const suggestions = generateQuickSuggestions(formData.description);
      setQuickSuggestions(suggestions);
    }
  }, [formData.description]);

  const generateQuickSuggestions = (description: string): string[] => {
    const text = description.toLowerCase();
    const suggestions: string[] = [];

    // Smart keyword detection for project type suggestions
    if (text.includes('bridge') || text.includes('infrastructure') || text.includes('building')) {
      suggestions.push('Civil Engineering Focus', 'Structural Monitoring', 'IoT Sensors');
    }
    if (text.includes('agriculture') || text.includes('farm') || text.includes('crop')) {
      suggestions.push('AgriTech Innovation', 'Environmental Sensors', 'Automation');
    }
    if (text.includes('health') || text.includes('medical') || text.includes('patient')) {
      suggestions.push('HealthTech Solution', 'Wearable Devices', 'Data Analytics');
    }
    if (text.includes('smart') || text.includes('automated') || text.includes('ai')) {
      suggestions.push('AI Integration', 'Automation System', 'Smart Controls');
    }
    if (text.includes('mobile') || text.includes('app') || text.includes('phone')) {
      suggestions.push('Mobile App', 'User Interface', 'Real-time Data');
    }

    return suggestions.slice(0, 6); // Max 6 suggestions
  };

  const handleQuickFill = (type: string) => {
    const templates = {
      'Smart Campus': {
        title: 'Smart Campus Monitoring System',
        description: 'An IoT-based system to monitor and optimize campus resources like energy usage, air quality, and space utilization.',
        problemStatement: 'Campus facilities lack real-time monitoring, leading to energy waste and inefficient resource allocation.'
      },
      'AgriTech Solution': {
        title: 'Smart Farming Assistant',
        description: 'A comprehensive agriculture monitoring system using sensors and mobile apps to help farmers optimize crop yields.',
        problemStatement: 'Small-scale farmers lack access to modern monitoring tools, resulting in suboptimal farming practices and reduced yields.'
      },
      'Infrastructure Monitor': {
        title: 'Smart Infrastructure Health Monitor',
        description: 'An AI-powered system to continuously monitor the structural health of bridges, buildings, and critical infrastructure.',
        problemStatement: 'Aging infrastructure poses safety risks, but traditional inspection methods are costly and infrequent.'
      }
    };

    const template = templates[type as keyof typeof templates];
    if (template) {
      onFormDataChange(template);
    }
  };

  return (
    <Card className="mx-auto max-w-4xl">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center text-2xl">
          <Lightbulb className="w-8 h-8 mr-3 text-yellow-600" />
          What's Your Innovation Idea?
        </CardTitle>
        <CardDescription>
          Don't worry about the details yet - just tell us what you want to build and why it matters
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Quick Start Templates */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-blue-900">Quick Start Ideas</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {['Smart Campus', 'AgriTech Solution', 'Infrastructure Monitor'].map((template) => (
                <Button
                  key={template}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickFill(template)}
                  className="text-left h-auto p-3 border-blue-200 hover:bg-blue-50"
                >
                  <div>
                    <p className="font-medium text-blue-900">{template}</p>
                    <p className="text-xs text-blue-600 mt-1">Click to use as template</p>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Project Title */}
          <div className="space-y-3">
            <Label htmlFor="title" className="text-lg font-semibold text-gray-900">
              What do you want to call your project? 💡
            </Label>
            <Input
              id="title"
              placeholder="e.g., Smart Bridge Monitor, Campus Energy Optimizer, Farming Assistant..."
              value={formData.title}
              onChange={(e) => onFormDataChange({ title: e.target.value })}
              className="text-lg h-12"
            />
            <p className="text-sm text-gray-500">
              Keep it simple - you can always refine it later
            </p>
          </div>

          {/* Project Description */}
          <div className="space-y-3">
            <Label htmlFor="description" className="text-lg font-semibold text-gray-900">
              Describe your idea in your own words 🗣️
            </Label>
            <Textarea
              id="description"
              placeholder="Just explain what you want to build... For example: 'I want to create a system that helps monitor bridge safety using sensors and sends alerts when there might be problems. It would help prevent accidents and save money on inspections.'"
              value={formData.description}
              onChange={(e) => onFormDataChange({ description: e.target.value })}
              rows={6}
              className="resize-none"
            />
            <p className="text-sm text-gray-500">
              Write naturally - our AI will help organize this later
            </p>
          </div>

          {/* Smart Suggestions (appear as they type) */}
          {quickSuggestions.length > 0 && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-3">
                <Zap className="w-5 h-5 text-green-600" />
                <h4 className="font-medium text-green-900">AI Detected Keywords</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickSuggestions.map((suggestion) => (
                  <Badge key={suggestion} variant="secondary" className="bg-green-100 text-green-800">
                    {suggestion}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-green-600 mt-2">
                These will help us suggest the right tools and team members in the next steps
              </p>
            </div>
          )}

          {/* Problem Statement */}
          <div className="space-y-3">
            <Label htmlFor="problem" className="text-lg font-semibold text-gray-900">
              What problem are you solving? 🎯
            </Label>
            <Textarea
              id="problem"
              placeholder="What's the current situation that bothers you? Who faces this problem? Why does it matter? For example: 'Bridge inspections only happen every few years, but problems can develop quickly. When bridges fail, people get hurt and it costs millions to fix.'"
              value={formData.problemStatement}
              onChange={(e) => onFormDataChange({ problemStatement: e.target.value })}
              rows={4}
              className="resize-none"
            />
            <p className="text-sm text-gray-500">
              Think about the 'why' behind your idea
            </p>
          </div>

          {/* Progress Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className={`p-4 rounded-lg border-2 transition-colors ${
              formData.title ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${formData.title ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-sm font-medium">Project Name</span>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg border-2 transition-colors ${
              formData.description.length > 50 ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${formData.description.length > 50 ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-sm font-medium">Description</span>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg border-2 transition-colors ${
              formData.problemStatement.length > 30 ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${formData.problemStatement.length > 30 ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-sm font-medium">Problem Defined</span>
              </div>
            </div>
          </div>

          {/* Next Step Preview */}
          {formData.title && formData.description.length > 50 && formData.problemStatement.length > 30 && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="w-5 h-5 text-blue-600" />
                <h4 className="font-medium text-blue-900">Ready for AI Analysis!</h4>
              </div>
              <p className="text-sm text-blue-700">
                Great start! Our AI will analyze your idea and suggest:
              </p>
              <ul className="text-sm text-blue-600 mt-2 space-y-1">
                <li>• Best project category and engineering disciplines</li>
                <li>• Recommended technologies and tools</li>
                <li>• Potential team member roles</li>
                <li>• Timeline and resource estimates</li>
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
