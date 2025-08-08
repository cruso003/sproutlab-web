'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Save,
  Plus,
  X,
  Lightbulb
} from 'lucide-react';
import { useProject, useAuth } from '@/lib/hooks';
import { useUIStore } from '@/lib/stores';

export default function ProjectEditPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { data: project, isLoading } = useProject(params.id as string);
  const { addNotification } = useUIStore();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    problemStatement: '',
    solution: '',
    type: '',
    discipline: '',
    status: '',
    startDate: '',
    targetCompletionDate: '',
    isTeamProject: false,
    maxTeamSize: 4,
    repository: '',
    documentationUrl: '',
    demoUrl: '',
    tags: [] as string[]
  });
  
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        problemStatement: project.problemStatement || '',
        solution: project.solution || '',
        type: project.type || '',
        discipline: project.discipline || '',
        status: project.status || '',
        startDate: project.startDate || '',
        targetCompletionDate: project.targetCompletionDate || '',
        isTeamProject: project.isTeamProject || false,
        maxTeamSize: project.maxTeamSize || 4,
        repository: project.repository || '',
        documentationUrl: project.documentationUrl || '',
        demoUrl: project.demoUrl || '',
        tags: project.tags || []
      });
    }
  }, [project]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-4">The project you're trying to edit doesn't exist.</p>
          <Button onClick={() => router.push('/projects')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  // Check if user can edit this project
  const isProjectOwner = user?.id === project.teamLeaderId;
  const isTeamMember = false; // TODO: Check if user is in project team
  const canEdit = isProjectOwner || isTeamMember;
  
  if (!canEdit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to edit this project.</p>
          <Button onClick={() => router.push(`/projects/${project.id}`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Project
          </Button>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // TODO: Implement API call to update project
      console.log('Updating project with data:', formData);
      
      addNotification({
        type: 'success',
        title: 'Project Updated',
        message: 'Your project has been successfully updated.'
      });
      
      router.push(`/projects/${project.id}`);
    } catch (error) {
      console.error('Error updating project:', error);
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update the project. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <Button 
              variant="ghost" 
              onClick={() => router.push(`/projects/${project.id}`)}
              className="text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Project
            </Button>
            
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Lightbulb className="w-8 h-8 mr-3 text-blue-600" />
              Edit Project
            </h1>
            <p className="text-gray-600 mt-2">
              Update your project information and details
            </p>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Core details about your innovation project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter your project title"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your project in detail"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Project Type</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="agriculture">Agriculture</SelectItem>
                        <SelectItem value="infrastructure">Infrastructure</SelectItem>
                        <SelectItem value="industrial">Industrial</SelectItem>
                        <SelectItem value="environmental">Environmental</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="discipline">Discipline</Label>
                    <Select value={formData.discipline} onValueChange={(value) => handleInputChange('discipline', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select discipline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="computer_science">Computer Science</SelectItem>
                        <SelectItem value="electrical_engineering">Electrical Engineering</SelectItem>
                        <SelectItem value="mechanical_engineering">Mechanical Engineering</SelectItem>
                        <SelectItem value="civil_engineering">Civil Engineering</SelectItem>
                        <SelectItem value="interdisciplinary">Interdisciplinary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="status">Project Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ideation">Ideation</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="prototype">Prototype</SelectItem>
                      <SelectItem value="testing">Testing</SelectItem>
                      <SelectItem value="complete">Complete</SelectItem>
                      <SelectItem value="showcase">Showcase</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Problem & Solution */}
            <Card>
              <CardHeader>
                <CardTitle>Problem & Solution</CardTitle>
                <CardDescription>
                  Define the problem you're solving and your approach
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="problemStatement">Problem Statement</Label>
                  <Textarea
                    id="problemStatement"
                    value={formData.problemStatement}
                    onChange={(e) => handleInputChange('problemStatement', e.target.value)}
                    placeholder="What problem are you trying to solve?"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="solution">Solution</Label>
                  <Textarea
                    id="solution"
                    value={formData.solution}
                    onChange={(e) => handleInputChange('solution', e.target.value)}
                    placeholder="How does your project solve this problem?"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Timeline & Team */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline & Team</CardTitle>
                <CardDescription>
                  Project schedule and team configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="targetCompletionDate">Target Completion Date</Label>
                    <Input
                      id="targetCompletionDate"
                      type="date"
                      value={formData.targetCompletionDate}
                      onChange={(e) => handleInputChange('targetCompletionDate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isTeamProject"
                      checked={formData.isTeamProject}
                      onChange={(e) => handleInputChange('isTeamProject', e.target.checked)}
                      className="rounded border-gray-300"
                      aria-label="Team project checkbox"
                    />
                    <Label htmlFor="isTeamProject">This is a team project</Label>
                  </div>
                  
                  {formData.isTeamProject && (
                    <div>
                      <Label htmlFor="maxTeamSize">Maximum Team Size</Label>
                      <Input
                        id="maxTeamSize"
                        type="number"
                        min="2"
                        max="10"
                        value={formData.maxTeamSize}
                        onChange={(e) => handleInputChange('maxTeamSize', parseInt(e.target.value))}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
                <CardDescription>
                  Add relevant tags to help others discover your project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-red-600"
                            aria-label={`Remove ${tag} tag`}
                            title={`Remove ${tag} tag`}
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

            {/* Links & Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Links & Resources</CardTitle>
                <CardDescription>
                  External links and resources for your project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="repository">Repository URL</Label>
                  <Input
                    id="repository"
                    value={formData.repository}
                    onChange={(e) => handleInputChange('repository', e.target.value)}
                    placeholder="https://github.com/username/repo"
                  />
                </div>
                
                <div>
                  <Label htmlFor="documentationUrl">Documentation URL</Label>
                  <Input
                    id="documentationUrl"
                    value={formData.documentationUrl}
                    onChange={(e) => handleInputChange('documentationUrl', e.target.value)}
                    placeholder="https://your-docs-url.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="demoUrl">Demo URL</Label>
                  <Input
                    id="demoUrl"
                    value={formData.demoUrl}
                    onChange={(e) => handleInputChange('demoUrl', e.target.value)}
                    placeholder="https://your-demo-url.com"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/projects/${project.id}`)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
