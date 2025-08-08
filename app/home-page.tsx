'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CircuitBoard, 
  ArrowRight, 
  Cpu, 
  Printer, 
  Zap, 
  Recycle, 
  Users, 
  Lightbulb,
  Target,
  Wrench,
  Wifi,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-lg bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <CircuitBoard className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">SproutLab</span>
              <Badge variant="outline" className="text-xs border-green-500/30 text-green-400">
                by SaharaSprout
              </Badge>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <a href="mailto:sproutlab@saharasprout.com" className="text-white hover:text-blue-400 transition-colors">
                Contact
              </a>
              <Link href="/auth/login">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="relative py-16 sm:py-24">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white"
            >
              Digital Fabrication
              <span className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Meets Innovation
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto"
            >
              A cutting-edge makerspace initiative by <span className="text-green-400 font-semibold">SaharaSprout</span> - 
              currently in development to bring IoT innovation, 3D printing, laser fabrication, and sustainable recycling 
              capabilities to complement traditional engineering labs.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a href="mailto:sproutlab@saharasprout.com?subject=Interest in SproutLab Access">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3">
                  Contact for Access
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <a href="https://www.saharasprout.com" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="!border-white/30 !text-white hover:!bg-white/10 hover:!border-white/50 bg-transparent px-8 py-3">
                  About SaharaSprout
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </motion.div>
          </div>
        </div>

        {/* Partnership Story */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <Card className="bg-white/5 backdrop-blur-lg border-white/10">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">From Student Vision to Innovation Initiative</h2>
                  <p className="text-gray-300 mb-4">
                    SaharaSprout originated as a final year project at IUEA and is evolving into an AgriTech company. 
                    As part of our vision, we're developing SproutLab - a specialized makerspace initiative that will 
                    complement IUEA's mechanical innovation lab with cutting-edge digital fabrication capabilities.
                  </p>
                  <p className="text-gray-300">
                    While IUEA's lab excels at mechanical projects like electric bikes, SproutLab will focus on 
                    IoT systems, 3D printing, laser cutting, and sustainable recycling - bridging the digital-physical divide.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">2025</div>
                    <div className="text-sm text-gray-400">SaharaSprout Founded</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">2025</div>
                    <div className="text-sm text-gray-400">Building SproutLab</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">AgriTech</div>
                    <div className="text-sm text-gray-400">In Development</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">Future</div>
                    <div className="text-sm text-gray-400">Digital Innovation Hub</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lab Capabilities */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Planned Lab <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Capabilities</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Cpu,
                title: 'IoT Development',
                description: 'Arduino, ESP32, sensors, wireless communication modules',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: Printer,
                title: '3D Printing',
                description: 'Rapid prototyping, custom parts, iterative design',
                color: 'from-purple-500 to-pink-500'
              },
              {
                icon: Zap,
                title: 'Laser Fabrication',
                description: 'Precision cutting, engraving, custom enclosures',
                color: 'from-yellow-500 to-orange-500'
              },
              {
                icon: Recycle,
                title: 'Sustainable Recycling',
                description: 'Upcycling materials, eco-friendly prototyping',
                color: 'from-green-500 to-emerald-500'
              }
            ].map((capability, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300 h-full">
                  <CardHeader>
                    <div className={`w-12 h-12 bg-gradient-to-r ${capability.color} rounded-lg mb-4 flex items-center justify-center`}>
                      <capability.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-white">{capability.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-400">
                      {capability.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Complementary Approach */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Envisioned Innovation Ecosystem
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30 backdrop-blur-lg">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Wrench className="h-8 w-8 text-orange-400" />
                  <div>
                    <CardTitle className="text-white">IUEA Innovation Lab</CardTitle>
                    <CardDescription className="text-orange-200">Mechanical & Hardware Focus</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-300">
                  <li>• Electric bike development</li>
                  <li>• Mechanical prototyping</li>
                  <li>• Traditional manufacturing</li>
                  <li>• Hardware assembly</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 backdrop-blur-lg">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <CircuitBoard className="h-8 w-8 text-blue-400" />
                  <div>
                    <CardTitle className="text-white">SproutLab (Planned)</CardTitle>
                    <CardDescription className="text-blue-200">Digital & IoT Innovation</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-300">
                  <li>• IoT system development (planned)</li>
                  <li>• Digital fabrication tools</li>
                  <li>• Smart connectivity solutions</li>
                  <li>• Sustainable design practices</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-8">
            <Badge variant="outline" className="border-green-500/30 text-green-400 px-4 py-2">
              <Target className="h-4 w-4 mr-2" />
              Vision: Complete Innovation Pipeline
            </Badge>
          </div>
        </motion.div>

        {/* Getting Started */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                How to Get Access
              </h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                SproutLab access is available to IUEA engineering students and select guest students from other universities. 
                Contact us through the appropriate channels to join our innovative community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="text-center">
                  <div className="text-sm text-blue-200 mb-2 font-medium">IUEA Students</div>
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8">
                    Contact Faculty of Engineering
                  </Button>
                </div>
                <div className="text-center">
                  <div className="text-sm text-blue-200 mb-2 font-medium">Guest Students</div>
                  <a href="mailto:sproutlab@saharasprout.com?subject=Guest Student Access Request">
                    <Button size="lg" variant="outline" className="!border-white/30 !text-white hover:!bg-white/10 hover:!border-white/50 bg-transparent px-8">
                      Email SproutLab
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-white/10 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-6 w-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <CircuitBoard className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">SproutLab</span>
                <Badge variant="outline" className="text-xs border-green-500/30 text-green-400">
                  by SaharaSprout
                </Badge>
              </div>
              <p className="text-gray-400 text-sm">
                Building the future of digital fabrication and IoT innovation in partnership with educational institutions.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-3">Connect</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="https://www.saharasprout.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    SaharaSprout Website
                  </a>
                </li>
                <li>
                  <a href="mailto:sproutlab@saharasprout.com" className="hover:text-white transition-colors">
                    Contact SproutLab
                  </a>
                </li>
                <li>
                  <Link href="/auth/login" className="hover:text-white transition-colors">
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-3">Vision</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>IoT Development</li>
                <li>3D Printing</li>
                <li>Laser Fabrication</li>
                <li>Sustainable Innovation</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 SaharaSprout. Building innovative solutions for tomorrow.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
