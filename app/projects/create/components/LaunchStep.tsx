import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { InnovationProject } from '@/lib/types';
import { 
  Rocket, 
  Users, 
  Calendar, 
  DollarSign, 
  AlertTriangle,
  Globe,
  FileText,
  Crown,
  Zap
} from 'lucide-react';

interface ProjectFormData {
  title: string;
  description: string;
  problemStatement: string;
  type: InnovationProject['type'];
  discipline: InnovationProject['discipline'];
  industry: string;
  tags: string[];
  isTeamProject: boolean;
  maxTeamSize: number;
  requiredSkills: string[];
  teamMembers?: any[];
  startDate: string;
  targetCompletionDate: string;
  estimatedBudget: number;
  constraints: string[];
  milestones?: any[];
  successMetrics?: string[];
  riskAssessment?: string;
  aiAnalysis?: any;
  repositoryUrl?: string;
  documentationUrl?: string;
  isPublic?: boolean;
}

interface LaunchStepProps {
  formData: ProjectFormData;
  onFormDataChange: (updates: Partial<ProjectFormData>) => void;
  onCreateProject: () => void;
  isCreating: boolean;
}

export function LaunchStep({ formData, onFormDataChange, onCreateProject, isCreating }: LaunchStepProps) {
  const calculateDuration = () => {
    if (formData.startDate && formData.targetCompletionDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.targetCompletionDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const getCompletionScore = () => {
    let score = 0;
    let total = 0;

    // Basic info (required)
    if (formData.title) score += 15;
    if (formData.description) score += 15;
    if (formData.problemStatement) score += 10;
    total += 40;

    // Classification
    if (formData.type) score += 5;
    if (formData.discipline) score += 5;
    if (formData.tags.length > 0) score += 5;
    total += 15;

    // AI Analysis
    if (formData.aiAnalysis) score += 10;
    total += 10;

    // Team Setup
    if (formData.isTeamProject && formData.teamMembers && formData.teamMembers.length > 0) {
      score += 10;
    } else if (!formData.isTeamProject) {
      score += 10;
    }
    total += 10;

    // Planning
    if (formData.startDate) score += 5;
    if (formData.targetCompletionDate) score += 5;
    if (formData.estimatedBudget > 0) score += 5;
    if (formData.milestones && formData.milestones.length > 0) score += 5;
    if (formData.successMetrics && formData.successMetrics.length > 0) score += 5;
    total += 25;

    return Math.round((score / total) * 100);
  };

  const completionScore = getCompletionScore();
  const duration = calculateDuration();

  const isReadyToLaunch = completionScore >= 80 && formData.title && formData.description;

  return (
    <Card className="mx-auto max-w-5xl">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center text-2xl">
          <Rocket className="w-8 h-8 mr-3 text-orange-600" />
          Ready for Launch! 🚀
        </CardTitle>
        <CardDescription>
          Review your project setup and launch your innovation journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Completion Score */}
          <Card className={`border-2 ${isReadyToLaunch ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                  isReadyToLaunch ? 'bg-green-200' : 'bg-yellow-200'
                }`}>
                  <span className={`text-2xl font-bold ${
                    isReadyToLaunch ? 'text-green-700' : 'text-yellow-700'
                  }`}>
                    {completionScore}%
                  </span>
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${
                  isReadyToLaunch ? 'text-green-900' : 'text-yellow-900'
                }`}>
                  Project Setup {isReadyToLaunch ? 'Complete!' : 'Almost Ready'}
                </h3>
                <p className={`text-sm ${
                  isReadyToLaunch ? 'text-green-700' : 'text-yellow-700'
                }`}>
                  {isReadyToLaunch 
                    ? 'Your project is fully configured and ready to launch!'
                    : 'Complete a few more steps to optimize your project setup.'
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Project Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Project Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Project Title</Label>
                    <p className="text-lg font-semibold text-gray-900">{formData.title || 'Untitled Project'}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Description</Label>
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {formData.description || 'No description provided'}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">Type & Industry</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formData.type && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {formData.type}
                        </Badge>
                      )}
                      {formData.discipline && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                          {formData.discipline}
                        </Badge>
                      )}
                      {formData.industry && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {formData.industry}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {formData.tags.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Technologies</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {formData.tags.slice(0, 6).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {formData.tags.length > 6 && (
                          <Badge variant="outline" className="text-xs">
                            +{formData.tags.length - 6} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Team Info */}
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">
                        {formData.isTeamProject ? 'Team Project' : 'Solo Project'}
                      </p>
                      <p className="text-sm text-blue-700">
                        {formData.isTeamProject 
                          ? `${formData.teamMembers?.length || 0}/${formData.maxTeamSize} members`
                          : 'Individual project'
                        }
                      </p>
                    </div>
                  </div>

                  {/* Timeline */}
                  {duration > 0 && (
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">Timeline</p>
                        <p className="text-sm text-green-700">
                          {duration} days ({Math.ceil(duration / 7)} weeks)
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Budget */}
                  {formData.estimatedBudget > 0 && (
                    <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-purple-900">Budget</p>
                        <p className="text-sm text-purple-700">
                          ${formData.estimatedBudget.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* AI Analysis */}
                  {formData.aiAnalysis && (
                    <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                      <Zap className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="font-medium text-orange-900">AI Analysis</p>
                        <p className="text-sm text-orange-700">
                          Confidence: {formData.aiAnalysis.confidence}%
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Globe className="w-5 h-5 mr-2 text-green-600" />
                Project Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="repo-url">Repository URL (Optional)</Label>
                    <Input
                      id="repo-url"
                      placeholder="https://github.com/username/repo"
                      value={formData.repositoryUrl || ''}
                      onChange={(e) => onFormDataChange({ repositoryUrl: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="docs-url">Documentation URL (Optional)</Label>
                    <Input
                      id="docs-url"
                      placeholder="https://docs.yourproject.com"
                      value={formData.documentationUrl || ''}
                      onChange={(e) => onFormDataChange({ documentationUrl: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-base font-medium">Project Visibility</Label>
                      <Badge variant={formData.isPublic ? "default" : "secondary"}>
                        {formData.isPublic ? "Public" : "Private"}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <button
                        onClick={() => onFormDataChange({ isPublic: true })}
                        className={`w-full p-3 text-left border rounded-lg transition-colors ${
                          formData.isPublic 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">Public Project</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Visible in SproutLab showcase and searchable by others
                        </p>
                      </button>

                      <button
                        onClick={() => onFormDataChange({ isPublic: false })}
                        className={`w-full p-3 text-left border rounded-lg transition-colors ${
                          !formData.isPublic 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Crown className="w-4 h-4 text-purple-600" />
                          <span className="font-medium">Private Project</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Only visible to you and your team members
                        </p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warnings */}
          {!isReadyToLaunch && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900 mb-2">
                      Recommendations Before Launch
                    </h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      {!formData.title && <li>• Add a descriptive project title</li>}
                      {!formData.description && <li>• Provide a detailed project description</li>}
                      {!formData.aiAnalysis && <li>• Run AI analysis for insights and recommendations</li>}
                      {formData.isTeamProject && (!formData.teamMembers || formData.teamMembers.length === 0) && (
                        <li>• Invite team members or switch to solo project</li>
                      )}
                      {!formData.startDate && <li>• Set project start date</li>}
                      {!formData.targetCompletionDate && <li>• Set target completion date</li>}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Launch Button */}
          <div className="text-center">
            <Button
              onClick={onCreateProject}
              disabled={isCreating || !formData.title || !formData.description}
              size="lg"
              className={`bg-gradient-to-r ${
                isReadyToLaunch 
                  ? 'from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700' 
                  : 'from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
              } px-8 py-3 text-lg`}
            >
              {isCreating ? (
                <>
                  <div className="w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Project...
                </>
              ) : (
                <>
                  <Rocket className="w-5 h-5 mr-3" />
                  {isReadyToLaunch ? 'Launch Project!' : 'Create Project Anyway'}
                </>
              )}
            </Button>
            
            <p className="text-sm text-gray-500 mt-4">
              {isReadyToLaunch 
                ? 'Your project will be created and you\'ll be redirected to the project dashboard'
                : 'You can complete remaining steps later from your project dashboard'
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
