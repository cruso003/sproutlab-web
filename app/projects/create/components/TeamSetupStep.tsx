import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  UserPlus, 
  Zap, 
  Star,
  Brain,
  CheckCircle,
  X,
  Plus,
  Loader2,
  Clock,
  Shield,
  GraduationCap,
  AlertCircle,
  Mail,
  UserCheck
} from 'lucide-react';
import { useSearchUsers } from '@/lib/hooks';
import { useAuth } from '@/lib/auth-context';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  username?: string;
  role: string;
  type: 'creator' | 'student' | 'mentor' | 'staff';
  skills: string[];
  availability: string;
  isConfirmed: boolean;
  status?: 'pending' | 'confirmed';
  profilePicture?: string;
  tempUserId?: string; // For pending invitations during project creation
}

interface PendingInvitation {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  type: 'student' | 'staff';
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  sentAt: string;
  message?: string;
}

interface ProjectFormData {
  title: string;
  description: string;
  isTeamProject: boolean;
  maxTeamSize: number;
  requiredSkills: string[];
  teamMembers?: TeamMember[];
  pendingInvitations?: PendingInvitation[];
  teamSuggestions?: any;
  workingAlone?: boolean;
  mentorRequested?: boolean;
}

interface TeamSetupStepProps {
  formData: ProjectFormData;
  onFormDataChange: (updates: Partial<ProjectFormData>) => void;
  onGetTeamSuggestions: () => void;
  isLoadingSuggestions: boolean;
}

export function TeamSetupStep({ 
  formData, 
  onFormDataChange, 
  onGetTeamSuggestions, 
  isLoadingSuggestions 
}: TeamSetupStepProps) {
  const [newSkill, setNewSkill] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [inviteType, setInviteType] = useState<'student' | 'mentor' | 'staff'>('student');
  const [searchQuery, setSearchQuery] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Use the search hook instead of manual fetch
  const { data: searchResults = [], isLoading: isSearching } = useSearchUsers(searchQuery);

  // Get current user from auth context
  const { user } = useAuth();
  
  // Create current user object from auth data
  const currentUser: TeamMember = user ? {
    id: user.id,
    name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'Unknown User',
    email: user.email,
    role: 'Project Creator',
    type: 'creator',
    skills: [], // This could be populated from user profile if available
    availability: 'Available',
    isConfirmed: true
  } : {
    id: 'guest-user',
    name: 'Guest User',
    email: 'guest@example.com',
    role: 'Project Creator',
    type: 'creator',
    skills: [],
    availability: 'Available',
    isConfirmed: true
  };

  // Initialize with current user if not already present
  React.useEffect(() => {
    if (!formData.teamMembers || formData.teamMembers.length === 0) {
      onFormDataChange({
        teamMembers: [currentUser],
        isTeamProject: false,
        workingAlone: true
      });
    }
  }, []);

  const searchUsers = (query: string) => {
    setSearchQuery(query);
    if (query.length === 0) {
      setValidationMessage('');
    } else if (query.length < 3) {
      setValidationMessage('Please enter at least 3 characters to search');
    } else {
      // Clear any previous validation message
      setValidationMessage('');
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.requiredSkills.includes(newSkill.trim())) {
      onFormDataChange({
        requiredSkills: [...formData.requiredSkills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    onFormDataChange({
      requiredSkills: formData.requiredSkills.filter((s: string) => s !== skill)
    });
  };

  const sendInvitation = async (user: any) => {
    if (!user) return;
    
    // Check if user is already in team
    const isAlreadyInTeam = (formData.teamMembers || []).some((member: any) => 
      member.id === user.id || member.email === user.email
    );
    
    if (isAlreadyInTeam) {
      setValidationMessage(`${user.username} is already in the team`);
      return;
    }
    
    // For project creation, we'll store invitations locally until project is created
    // Then send actual invitations after project creation
    const userName = user.firstName && user.lastName 
      ? `${user.firstName} ${user.lastName}`.trim()
      : user.username || user.email;

    const newTeamMember = {
      id: `temp-${Date.now()}`,
      name: userName,
      email: user.email,
      username: user.username,
      role: 'Team Member',
      type: (user.role === 'staff' ? 'staff' : 'student') as 'student' | 'staff',
      skills: [],
      availability: 'Available',
      isConfirmed: false,
      status: 'pending' as 'pending',
      tempUserId: user.id
    };
    
    onFormDataChange({
      teamMembers: [...(formData.teamMembers || []), newTeamMember],
      isTeamProject: true,
      workingAlone: false
    });
    
    setSearchQuery('');
    setValidationMessage(`${user.username} will be invited when the project is created`);
    
    // Clear validation message after 3 seconds
    setTimeout(() => setValidationMessage(''), 3000);
  };

  const removeTeamMember = (memberId: string) => {
    const updatedMembers = (formData.teamMembers || []).filter((m: any) => m.id !== memberId);
    const isStillTeamProject = updatedMembers.length > 1;
    
    onFormDataChange({
      teamMembers: updatedMembers,
      isTeamProject: isStillTeamProject,
      workingAlone: !isStillTeamProject
    });
  };

  const handleWorkingAloneToggle = (workingAlone: boolean) => {
    onFormDataChange({
      workingAlone,
      isTeamProject: !workingAlone,
      teamMembers: workingAlone ? [currentUser] : formData.teamMembers
    });
  };

  return (
    <Card className="mx-auto max-w-5xl">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center text-2xl">
          <Users className="w-8 h-8 mr-3 text-blue-600" />
          Build Your Dream Team
        </CardTitle>
        <CardDescription>
          Start solo or collaborate - you can always invite teammates later!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Working Style Selection */}
          <Card className="border-2 border-blue-100">
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How do you want to work?</h3>
                <p className="text-sm text-gray-600">Choose your preferred working style - you can change this anytime</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleWorkingAloneToggle(true)}
                  className={`p-6 text-left border-2 rounded-lg transition-all ${
                    formData.workingAlone 
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <Star className="w-6 h-6 text-orange-600" />
                    <span className="font-semibold text-gray-900">Start Solo</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Begin working on your own and invite teammates when you're ready
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>Perfect for early exploration and prototyping</span>
                  </div>
                </button>

                <button
                  onClick={() => handleWorkingAloneToggle(false)}
                  className={`p-6 text-left border-2 rounded-lg transition-all ${
                    !formData.workingAlone 
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <Users className="w-6 h-6 text-blue-600" />
                    <span className="font-semibold text-gray-900">Build a Team</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Invite classmates and mentors to collaborate from the start
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Zap className="w-3 h-3" />
                    <span>Great for complex cross-disciplinary projects</span>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>

          {!formData.workingAlone && (
            <Tabs defaultValue="invite" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="invite">Invite Teammates</TabsTrigger>
                <TabsTrigger value="team">Current Team</TabsTrigger>
                <TabsTrigger value="suggestions">AI Suggestions</TabsTrigger>
              </TabsList>

              <TabsContent value="invite" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <UserPlus className="w-5 h-5 mr-2 text-green-600" />
                      Invite Team Members
                    </CardTitle>
                    <CardDescription>
                      Search for IUEA students and staff to invite to your project
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* User Search */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <div className="md:col-span-2">
                            <Label htmlFor="search-users" className="text-sm font-medium">
                              Search by name or email
                            </Label>
                            <Input
                              id="search-users"
                              placeholder="Start typing to search..."
                              value={inviteEmail}
                              onChange={(e) => {
                                setInviteEmail(e.target.value);
                                searchUsers(e.target.value);
                              }}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="role" className="text-sm font-medium">
                              Role
                            </Label>
                            <Input
                              id="role"
                              placeholder="e.g., Frontend Developer"
                              value={inviteRole}
                              onChange={(e) => setInviteRole(e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium">Type</Label>
                            <div className="flex space-x-2 mt-1">
                              <Button
                                type="button"
                                variant={inviteType === 'student' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setInviteType('student')}
                              >
                                <GraduationCap className="w-4 h-4 mr-1" />
                                Student
                              </Button>
                              <Button
                                type="button"
                                variant={inviteType === 'mentor' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setInviteType('mentor')}
                              >
                                <Shield className="w-4 h-4 mr-1" />
                                Mentor
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Search Results */}
                        {isSearching && (
                          <div className="flex items-center space-x-2 text-gray-500">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Searching users...</span>
                          </div>
                        )}

                        {searchResults.length > 0 && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Search Results:</Label>
                            {searchResults
                              .filter(user => 
                                // Exclude current user
                                user.id !== currentUser.id && 
                                user.email !== currentUser.email &&
                                // Exclude already invited members
                                !formData.teamMembers?.some(member => 
                                  member.id === user.id || member.email === user.email
                                )
                              )
                              .map((user) => (
                              <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                    <UserCheck className="w-4 h-4 text-gray-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {user.firstName && user.lastName 
                                        ? `${user.firstName} ${user.lastName}`.trim()
                                        : user.username || user.email}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {user.email}
                                      {user.discipline && ` • ${user.discipline}`}
                                      {user.studentId && ` • ${user.studentId}`}
                                    </p>
                                  </div>
                                  <Badge variant={user.role === 'staff' ? 'default' : 'secondary'}>
                                    {user.role === 'staff' ? 'Staff' : 'Student'}
                                  </Badge>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => sendInvitation(user)}
                                >
                                  <Mail className="w-4 h-4 mr-2" />
                                  Invite
                                </Button>
                              </div>
                            ))}
                            {searchResults
                              .filter(user => 
                                user.id !== currentUser.id && 
                                user.email !== currentUser.email &&
                                !formData.teamMembers?.some(member => 
                                  member.id === user.id || member.email === user.email
                                )
                              ).length === 0 && searchResults.length > 0 && (
                              <p className="text-sm text-gray-500 py-4 text-center">
                                No available users found. All users are either already invited or cannot be invited.
                              </p>
                            )}
                          </div>
                        )}

                        {validationMessage && (
                          <div className={`p-4 rounded-lg ${
                            validationMessage.includes('Error') || validationMessage.includes('No users')
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-green-50 text-green-700 border border-green-200'
                          }`}>
                            <div className="flex items-start space-x-3">
                              {validationMessage.includes('Error') || validationMessage.includes('No users') ? (
                                <AlertCircle className="w-5 h-5 mt-0.5" />
                              ) : (
                                <CheckCircle className="w-5 h-5 mt-0.5" />
                              )}
                              <div className="flex-1">
                                <p className="text-sm font-medium">{validationMessage}</p>
                                {validationMessage.includes('No users found') && (
                                  <div className="mt-2 text-sm">
                                    <p className="mb-2">Your teammate might need to:</p>
                                    <ul className="list-disc list-inside space-y-1 text-amber-700">
                                      <li>Register for a SproutLab account at the university</li>
                                      <li>Contact the IT department for system access</li>
                                      <li>Reach out to SproutLab administrators for enrollment</li>
                                    </ul>
                                    <p className="mt-2 text-xs text-amber-600">
                                      💡 You can still proceed and invite them once they're enrolled
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Required Skills */}
                      <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-medium text-blue-900">Skills Needed for This Project</h4>
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Add required skill (e.g., React, Civil Engineering, PCB Design)"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                            className="flex-1"
                          />
                          <Button onClick={addSkill} disabled={!newSkill.trim()}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add
                          </Button>
                        </div>

                        {formData.requiredSkills.length > 0 && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-blue-700">Required Skills:</Label>
                            <div className="flex flex-wrap gap-2">
                              {formData.requiredSkills.map((skill) => (
                                <Badge 
                                  key={skill} 
                                  variant="secondary"
                                  className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                                >
                                  {skill}
                                  <button
                                    onClick={() => removeSkill(skill)}
                                    className="ml-2 hover:text-blue-900"
                                    aria-label={`Remove ${skill} skill`}
                                    title={`Remove ${skill} skill`}
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {formData.requiredSkills.length > 0 && (
                          <Button 
                            onClick={onGetTeamSuggestions}
                            disabled={isLoadingSuggestions}
                            variant="outline"
                            className="w-full border-blue-200 text-blue-700 hover:bg-blue-100"
                          >
                            {isLoadingSuggestions ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Getting AI Team Suggestions...
                              </>
                            ) : (
                              <>
                                <Brain className="w-4 h-4 mr-2" />
                                Get AI Team Recommendations
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Current Team Tab */}
              <TabsContent value="team" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Users className="w-5 h-5 mr-2 text-blue-600" />
                      Current Team ({formData.teamMembers?.length || 0} members)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {formData.teamMembers && formData.teamMembers.length > 0 ? (
                      <div className="space-y-3">
                        {formData.teamMembers.map((member) => (
                          <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                                {member.name.charAt(0)}
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <p className="font-medium text-gray-900">{member.name}</p>
                                  {member.type === 'creator' && (
                                    <Badge className="bg-green-600">Creator</Badge>
                                  )}
                                  {member.type === 'mentor' && (
                                    <Badge className="bg-purple-600">Mentor</Badge>
                                  )}
                                  {member.type === 'staff' && (
                                    <Badge className="bg-blue-600">Staff</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500">
                                  {member.email} • {member.role}
                                </p>
                                <p className="text-xs text-gray-400">
                                  Status: {member.isConfirmed ? (
                                    <span className="text-green-600 font-medium">Confirmed</span>
                                  ) : member.status === 'pending' ? (
                                    <span className="text-orange-600 font-medium">Pending Invitation</span>
                                  ) : (
                                    <span className="text-yellow-600 font-medium">{member.availability}</span>
                                  )}
                                </p>
                              </div>
                            </div>
                            {member.type !== 'creator' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeTeamMember(member.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>Just you so far!</p>
                        <p className="text-sm">Invite teammates when you're ready to collaborate</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* AI Suggestions Tab */}
              <TabsContent value="suggestions" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Brain className="w-5 h-5 mr-2 text-green-600" />
                      AI Team Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {formData.teamSuggestions ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-green-50 rounded-lg">
                          <div className="flex items-center space-x-2 mb-3">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <h4 className="font-medium text-green-900">AI Analysis Complete</h4>
                          </div>
                          <div className="prose prose-sm max-w-none">
                            <div className="text-green-700">
                              {formData.teamSuggestions.analysis || 'Comprehensive team analysis generated based on your project requirements'}
                            </div>
                          </div>
                        </div>

                        {formData.teamSuggestions.suggestedRoles && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3">Recommended Team Roles:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {formData.teamSuggestions.suggestedRoles.map((role: any, index: number) => (
                                <div key={index} className="p-4 border rounded-lg">
                                  <h5 className="font-medium text-gray-900">{role.title}</h5>
                                  <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                                  {role.skills && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                      {role.skills.map((skill: string, skillIndex: number) => (
                                        <Badge key={skillIndex} variant="outline" className="text-xs">
                                          {skill}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Brain className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-gray-500 mb-2">No AI suggestions yet</p>
                        <p className="text-sm text-gray-400">
                          Add required skills and click "Get AI Team Recommendations" to see suggestions
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          {/* Working Solo Message */}
          {formData.workingAlone && (
            <div className="p-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
              <div className="flex items-center space-x-3 mb-3">
                <Star className="w-6 h-6 text-orange-600" />
                <h3 className="font-semibold text-orange-900">Solo Innovation Mode</h3>
              </div>
              <p className="text-orange-700 mb-4">
                Perfect! You're starting solo. You can focus on prototyping and experimenting without coordination overhead.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-medium text-orange-900">Benefits of Solo Start:</h4>
                  <ul className="text-orange-700 space-y-1">
                    <li>• Move fast and iterate quickly</li>
                    <li>• Full control over project direction</li>
                    <li>• Perfect for early prototyping</li>
                    <li>• No coordination overhead</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-orange-900">When to Add Team:</h4>
                  <ul className="text-orange-700 space-y-1">
                    <li>• When you need specific expertise</li>
                    <li>• For complex implementation phases</li>
                    <li>• When workload becomes too much</li>
                    <li>• Before major milestones</li>
                  </ul>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleWorkingAloneToggle(false)}
                className="mt-4 border-orange-200 text-orange-700 hover:bg-orange-100"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Switch to Team Mode
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
