'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, XCircle, UserPlus } from 'lucide-react';

interface InvitationDetails {
  id: string;
  projectTitle: string;
  projectDescription: string;
  proposedRole: string;
  invitedByName: string;
  message?: string;
  status: string;
  expiresAt: string;
}

export default function AcceptInvitationPage() {
  const { token } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [invitation, setInvitation] = useState<InvitationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [expertise, setExpertise] = useState('');

  useEffect(() => {
    if (!user) {
      // Redirect to login with return URL
      router.push(`/auth?redirect=/invitations/accept/${token}`);
      return;
    }
    
    fetchInvitationDetails();
  }, [user, token]);

  const fetchInvitationDetails = async () => {
    try {
      const response = await fetch(`/api/invitations/${token}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch invitation details');
      }

      const data = await response.json();
      setInvitation(data.invitation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!invitation) return;

    setProcessing(true);
    try {
      const response = await fetch(`/api/invitations/${invitation.id}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          response: 'accept',
          expertise: expertise.trim()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to accept invitation');
      }

      setSuccess(true);
      
      // Redirect to project dashboard after 3 seconds
      setTimeout(() => {
        router.push('/dashboard/projects');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to accept invitation');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading invitation details...</p>
        </div>
      </div>
    );
  }

  if (error && !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle>Invalid Invitation</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => router.push('/dashboard')} 
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <CardTitle>Invitation Accepted!</CardTitle>
            <CardDescription>
              You've successfully joined the project team. Redirecting to your dashboard...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle>Invitation Not Found</CardTitle>
            <CardDescription>
              This invitation may have expired or been withdrawn.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader className="text-center">
            <UserPlus className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Join Project Team</CardTitle>
            <CardDescription>
              You've been invited to collaborate on an exciting project
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Project Details */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">📋 Project Details</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-blue-800">Project:</span>
                  <span className="ml-2 text-blue-700">{invitation.projectTitle}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Your Role:</span>
                  <span className="ml-2 text-blue-700 capitalize">{invitation.proposedRole}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Invited by:</span>
                  <span className="ml-2 text-blue-700">{invitation.invitedByName}</span>
                </div>
                <div className="pt-2">
                  <span className="font-medium text-blue-800">Description:</span>
                  <p className="text-blue-700 mt-1">{invitation.projectDescription}</p>
                </div>
              </div>
            </div>

            {/* Personal Message */}
            {invitation.message && (
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h4 className="font-medium text-purple-900 mb-2">💬 Personal Message</h4>
                <p className="text-purple-700 italic">"{invitation.message}"</p>
              </div>
            )}

            {/* Expertise Input */}
            <div className="space-y-2">
              <Label htmlFor="expertise">Your Expertise & Contribution (Optional)</Label>
              <Textarea
                id="expertise"
                placeholder="Briefly describe your relevant skills, experience, or how you'd like to contribute to this project..."
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
                rows={3}
              />
              <p className="text-sm text-gray-500">
                This will help the team understand your background and assign appropriate tasks.
              </p>
            </div>

            {/* Status Warning */}
            {invitation.status !== 'pending' && (
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <p className="text-yellow-800">
                  ⚠️ This invitation has already been {invitation.status}.
                </p>
              </div>
            )}

            {/* Expiration Warning */}
            {new Date(invitation.expiresAt) < new Date() && (
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <p className="text-red-800">
                  ⏰ This invitation has expired.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleAccept}
                disabled={processing || invitation.status !== 'pending' || new Date(invitation.expiresAt) < new Date()}
                className="flex-1"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Accepting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accept Invitation
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => router.push(`/invitations/decline/${token}`)}
                disabled={processing}
                className="flex-1"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Decline
              </Button>
            </div>

            {error && (
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <p className="text-red-800">❌ {error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
