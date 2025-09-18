import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Shield, Heart, Users, ArrowRight, Stethoscope } from 'lucide-react';

export const HeroSection = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-primary-50 via-white to-emerald-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary-400 rounded-full blur-3xl animate-pulse-soft"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-emerald-400 rounded-full blur-2xl animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-primary-300 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 lg:px-8">
        <div className="flex items-center space-x-2">
          <div className="bg-primary-600 p-2 rounded-xl">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-800">MedChain</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <Link to="#features" className="text-gray-600 hover:text-primary-600 transition-colors">Features</Link>
          <Link to="#how-it-works" className="text-gray-600 hover:text-primary-600 transition-colors">How It Works</Link>
          <Link to="#about" className="text-gray-600 hover:text-primary-600 transition-colors">About</Link>
          <Link to="/login">
            <Button variant="outline" className="border-primary-300 text-primary-700 hover:bg-primary-50">
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button className="bg-primary-600 hover:bg-primary-700 shadow-lg">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-medium mb-6">
              <Shield className="h-4 w-4 mr-2" />
              Secure • Decentralized • HIPAA Compliant
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Your Medical Records,
              <span className="text-primary-600 block">Secured Forever</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Take control of your healthcare data with blockchain-powered security. 
              Share medical records instantly with doctors while maintaining complete privacy and ownership.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/register">
                <Button size="lg" className="bg-primary-600 hover:bg-primary-700 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="#how-it-works">
                <Button variant="outline" size="lg" className="border-primary-300 text-primary-700 hover:bg-primary-50">
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-primary-100">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">100%</div>
                <div className="text-sm text-gray-600">Secure</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">24/7</div>
                <div className="text-sm text-gray-600">Access</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">∞</div>
                <div className="text-sm text-gray-600">Storage</div>
              </div>
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className="relative animate-slide-up">
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-primary-100">
              <div className="absolute -top-4 -right-4 bg-primary-600 text-white p-3 rounded-xl shadow-lg">
                <Heart className="h-6 w-6" />
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-primary-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Dr. Sarah Johnson</div>
                      <div className="text-sm text-gray-600">Cardiologist</div>
                    </div>
                  </div>
                  <div className="text-primary-600 font-semibold">Access Granted</div>
                </div>

                <div className="space-y-3">
                  <div className="h-4 bg-primary-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-600 rounded-full w-4/5 animate-pulse-soft"></div>
                  </div>
                  <div className="h-4 bg-primary-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-600 rounded-full w-3/5 animate-pulse-soft" style={{ animationDelay: '0.5s' }}></div>
                  </div>
                  <div className="h-4 bg-primary-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-600 rounded-full w-5/6 animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-gray-600">Medical Records Synced</div>
                  <div className="flex items-center text-primary-600">
                    <Shield className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">Encrypted</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-8 -left-8 bg-emerald-500 text-white p-4 rounded-2xl shadow-lg animate-pulse-soft">
              <Shield className="h-8 w-8" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-primary-600 text-white p-3 rounded-xl shadow-lg animate-pulse-soft" style={{ animationDelay: '1.5s' }}>
              <Heart className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};