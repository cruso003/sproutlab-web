'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CircuitBoard, ArrowLeft, Mail, Users, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2760%27%20height=%2760%27%20viewBox=%270%200%2060%2060%27%20xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg%20fill=%27none%27%20fill-rule=%27evenodd%27%3E%3Cg%20fill=%27%23ffffff%27%20fill-opacity=%270.1%27%3E%3Ccircle%20cx=%2730%27%20cy=%2730%27%20r=%272%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"
        />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center space-x-2 text-white hover:text-blue-400 transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <CircuitBoard className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">SproutLab</h1>
          </div>
          <p className="text-gray-400">Request access to the platform</p>
        </motion.div>

        {/* Access Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/5 backdrop-blur-lg border-white/10">
            <CardHeader className="text-center">
              <CardTitle className="text-white">Access Requirements</CardTitle>
              <CardDescription className="text-gray-400">
                SproutLab is currently available to IUEA engineering students and select guest students
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* IUEA Students */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-400" />
                  IUEA Engineering Students
                </h3>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-gray-300 mb-4">
                    If you're currently enrolled in the Faculty of Engineering at IUEA, you can request access 
                    through your faculty administrators.
                  </p>
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                    Contact Faculty of Engineering
                  </Button>
                </div>
              </div>

              {/* Guest Students */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <ExternalLink className="h-5 w-5 mr-2 text-purple-400" />
                  Guest Students (Other Universities)
                </h3>
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                  <p className="text-gray-300 mb-4">
                    Students from other universities may request guest access for collaborative projects or 
                    research initiatives. Please provide details about your institution and project goals.
                  </p>
                  <a href="mailto:sproutlab@saharasprout.com?subject=Guest Student Access Request&body=Hello,%0D%0A%0D%0AI would like to request guest access to SproutLab.%0D%0A%0D%0AUniversity: %0D%0AProgram/Year: %0D%0AProject Description: %0D%0AFaculty Supervisor: %0D%0A%0D%0AThank you!">
                    <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white flex items-center justify-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Access Request
                    </Button>
                  </a>
                </div>
              </div>

              {/* Information Section */}
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <h4 className="text-green-400 font-medium mb-2">What to Include in Your Request:</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Your full name and student ID (if applicable)</li>
                  <li>• University and program of study</li>
                  <li>• Project description and goals</li>
                  <li>• Faculty supervisor contact information</li>
                  <li>• Expected duration of access needed</li>
                </ul>
              </div>

              {/* Already Have Access */}
              <div className="text-center pt-4 border-t border-white/10">
                <p className="text-gray-400 text-sm mb-3">
                  Already have an account?
                </p>
                <Link href="/auth/login">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    Sign In Here
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-500 text-sm">
            SproutLab is a digital fabrication initiative by{' '}
            <a href="https://www.saharasprout.com" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 transition-colors">
              SaharaSprout
            </a>
            {' '}in partnership with educational institutions
          </p>
        </motion.div>
      </div>
    </div>
  );
}
