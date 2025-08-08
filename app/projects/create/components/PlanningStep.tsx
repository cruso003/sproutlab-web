import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Target, 
  DollarSign, 
  AlertTriangle, 
  Plus,
  X,
  Clock,
  FileText,
  CheckCircle,
  Brain
} from 'lucide-react';
import { useState } from 'react';

interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  dependencies: string[];
  isCompleted: boolean;
}

interface ProjectFormData {
  title: string;
  startDate: string;
  targetCompletionDate: string;
  estimatedBudget: number;
  constraints: string[];
  milestones?: Milestone[];
  riskAssessment?: string;
  successMetrics?: string[];
}

interface PlanningStepProps {
  formData: ProjectFormData;
  onFormDataChange: (updates: Partial<ProjectFormData>) => void;
}

export function PlanningStep({ formData, onFormDataChange }: PlanningStepProps) {
  const [newConstraint, setNewConstraint] = useState('');
  const [newMetric, setNewMetric] = useState('');
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    targetDate: ''
  });

  const addConstraint = () => {
    if (newConstraint.trim() && !formData.constraints.includes(newConstraint.trim())) {
      onFormDataChange({
        constraints: [...formData.constraints, newConstraint.trim()]
      });
      setNewConstraint('');
    }
  };

  const removeConstraint = (constraint: string) => {
    onFormDataChange({
      constraints: formData.constraints.filter(c => c !== constraint)
    });
  };

  const addMetric = () => {
    if (newMetric.trim() && !(formData.successMetrics || []).includes(newMetric.trim())) {
      onFormDataChange({
        successMetrics: [...(formData.successMetrics || []), newMetric.trim()]
      });
      setNewMetric('');
    }
  };

  const removeMetric = (metric: string) => {
    onFormDataChange({
      successMetrics: (formData.successMetrics || []).filter(m => m !== metric)
    });
  };

  const addMilestone = () => {
    if (newMilestone.title.trim() && newMilestone.targetDate) {
      const milestone: Milestone = {
        id: Date.now().toString(),
        title: newMilestone.title.trim(),
        description: newMilestone.description.trim(),
        targetDate: newMilestone.targetDate,
        dependencies: [],
        isCompleted: false
      };
      
      onFormDataChange({
        milestones: [...(formData.milestones || []), milestone]
      });
      
      setNewMilestone({ title: '', description: '', targetDate: '' });
    }
  };

  const removeMilestone = (milestoneId: string) => {
    onFormDataChange({
      milestones: (formData.milestones || []).filter(m => m.id !== milestoneId)
    });
  };

  // Calculate project duration
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

  const duration = calculateDuration();

  return (
    <Card className="mx-auto max-w-5xl">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center text-2xl">
          <Target className="w-8 h-8 mr-3 text-green-600" />
          Project Planning & Timeline
        </CardTitle>
        <CardDescription>
          Set your project timeline, budget, milestones, and success metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="timeline" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="metrics">Success Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  Project Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => onFormDataChange({ startDate: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="end-date">Target Completion Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={formData.targetCompletionDate}
                      onChange={(e) => onFormDataChange({ targetCompletionDate: e.target.value })}
                      min={formData.startDate}
                    />
                  </div>
                </div>

                {duration > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900">
                          Project Duration: {duration} days
                        </p>
                        <p className="text-sm text-blue-700">
                          Approximately {Math.ceil(duration / 7)} weeks or {Math.ceil(duration / 30)} months
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Constraints */}
                <div className="mt-6 space-y-4">
                  <Label className="text-base font-medium">Project Constraints</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add constraint (e.g., Limited budget, Remote team only)"
                      value={newConstraint}
                      onChange={(e) => setNewConstraint(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addConstraint()}
                    />
                    <Button onClick={addConstraint} disabled={!newConstraint.trim()}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>

                  {formData.constraints.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.constraints.map((constraint) => (
                        <Badge 
                          key={constraint} 
                          variant="secondary"
                          className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                        >
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {constraint}
                          <button
                            onClick={() => removeConstraint(constraint)}
                            className="ml-2 hover:text-yellow-900"
                            title={`Remove ${constraint} constraint`}
                            aria-label={`Remove ${constraint} constraint`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budget" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  Budget Planning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Estimated Budget (USD)</Label>
                    <Input
                      id="budget"
                      type="number"
                      min="0"
                      step="100"
                      value={formData.estimatedBudget}
                      onChange={(e) => onFormDataChange({ estimatedBudget: parseInt(e.target.value) || 0 })}
                      placeholder="Enter estimated budget"
                    />
                  </div>

                  {formData.estimatedBudget > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-green-50 rounded-lg text-center">
                        <h4 className="font-medium text-green-900">Development</h4>
                        <p className="text-2xl font-bold text-green-700">
                          ${Math.round(formData.estimatedBudget * 0.6).toLocaleString()}
                        </p>
                        <p className="text-sm text-green-600">60% allocation</p>
                      </div>
                      
                      <div className="p-4 bg-blue-50 rounded-lg text-center">
                        <h4 className="font-medium text-blue-900">Tools & Services</h4>
                        <p className="text-2xl font-bold text-blue-700">
                          ${Math.round(formData.estimatedBudget * 0.25).toLocaleString()}
                        </p>
                        <p className="text-sm text-blue-600">25% allocation</p>
                      </div>
                      
                      <div className="p-4 bg-purple-50 rounded-lg text-center">
                        <h4 className="font-medium text-purple-900">Marketing</h4>
                        <p className="text-2xl font-bold text-purple-700">
                          ${Math.round(formData.estimatedBudget * 0.15).toLocaleString()}
                        </p>
                        <p className="text-sm text-purple-600">15% allocation</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="risk-assessment">Risk Assessment</Label>
                    <Textarea
                      id="risk-assessment"
                      placeholder="Identify potential risks and mitigation strategies..."
                      value={formData.riskAssessment || ''}
                      onChange={(e) => onFormDataChange({ riskAssessment: e.target.value })}
                      rows={4}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="milestones" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <CheckCircle className="w-5 h-5 mr-2 text-purple-600" />
                  Project Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Add New Milestone */}
                  <div className="space-y-4 p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900">Add Milestone</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        placeholder="Milestone title"
                        value={newMilestone.title}
                        onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                      />
                      <Input
                        type="date"
                        value={newMilestone.targetDate}
                        onChange={(e) => setNewMilestone({ ...newMilestone, targetDate: e.target.value })}
                        min={formData.startDate}
                        max={formData.targetCompletionDate}
                      />
                    </div>
                    <Textarea
                      placeholder="Milestone description (optional)"
                      value={newMilestone.description}
                      onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                      rows={2}
                    />
                    <Button 
                      onClick={addMilestone}
                      disabled={!newMilestone.title.trim() || !newMilestone.targetDate}
                      className="w-full md:w-auto"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Milestone
                    </Button>
                  </div>

                  {/* Current Milestones */}
                  {formData.milestones && formData.milestones.length > 0 ? (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Project Milestones ({formData.milestones.length})</h4>
                      {formData.milestones
                        .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())
                        .map((milestone, index) => (
                          <div key={milestone.id} className="flex items-start justify-between p-4 border rounded-lg">
                            <div className="flex items-start space-x-4">
                              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-medium">
                                {index + 1}
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-900">{milestone.title}</h5>
                                {milestone.description && (
                                  <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                                )}
                                <p className="text-xs text-gray-400 mt-1">
                                  Target: {new Date(milestone.targetDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMilestone(milestone.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No milestones added yet</p>
                      <p className="text-sm">Break your project into achievable milestones</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Target className="w-5 h-5 mr-2 text-orange-600" />
                  Success Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Define Success Metrics</Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add success metric (e.g., 1000 active users, 95% uptime)"
                        value={newMetric}
                        onChange={(e) => setNewMetric(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addMetric()}
                      />
                      <Button onClick={addMetric} disabled={!newMetric.trim()}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>

                  {formData.successMetrics && formData.successMetrics.length > 0 ? (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Success Metrics ({formData.successMetrics.length})</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {formData.successMetrics.map((metric, index) => (
                          <div key={metric} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0 w-6 h-6 bg-orange-200 text-orange-700 rounded-full flex items-center justify-center text-sm font-medium">
                                {index + 1}
                              </div>
                              <p className="text-sm text-orange-800">{metric}</p>
                            </div>
                            <button
                              onClick={() => removeMetric(metric)}
                              className="text-orange-600 hover:text-orange-700"
                              title={`Remove ${metric} metric`}
                              aria-label={`Remove ${metric} metric`}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Target className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No success metrics defined yet</p>
                      <p className="text-sm">Define how you'll measure project success</p>
                    </div>
                  )}

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-2">AI Suggestion</h4>
                        <p className="text-sm text-blue-700">
                          Consider including both quantitative metrics (numbers, percentages) and qualitative metrics 
                          (user satisfaction, code quality) to get a complete picture of project success.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
