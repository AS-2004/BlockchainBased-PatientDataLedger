import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Stethoscope, Heart, Users } from 'lucide-react';

export const CTASection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-emerald-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse-soft"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-white rounded-full blur-2xl animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium mb-6">
            <Heart className="h-4 w-4 mr-2" />
            Join the Healthcare Revolution
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Take Control of Your
            <span className="block">Medical Records Today</span>
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-12">
            Don't let your medical data be scattered across different systems. 
            Join MedChain and experience the future of secure, accessible healthcare records.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
          <Link to="/register">
            <Button 
              size="lg" 
              className="bg-white text-primary-700 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 group px-8 py-4 text-lg"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/login">
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-lg"
            >
              Sign In
            </Button>
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">For Patients</h3>
            <p className="text-white/80">
              Secure storage and instant sharing of your medical records with healthcare providers worldwide.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">For Doctors</h3>
            <p className="text-white/80">
              Access patient records instantly with proper permissions. Collaborate seamlessly with other providers.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">For Healthcare</h3>
            <p className="text-white/80">
              Reduce administrative overhead and improve patient care with secure, accessible medical records.
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 pt-8 border-t border-white/20">
          <p className="text-white/70 text-sm mb-4">Trusted by healthcare providers worldwide</p>
          <div className="flex items-center justify-center space-x-8 opacity-60">
            <div className="text-white font-semibold">HIPAA Compliant</div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="text-white font-semibold">SOC 2 Certified</div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="text-white font-semibold">ISO 27001</div>
          </div>
        </div>
      </div>
    </section>
  );
};