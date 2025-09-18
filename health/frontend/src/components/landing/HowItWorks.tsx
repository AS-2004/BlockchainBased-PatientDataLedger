import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlus, Upload, Share, Shield } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      title: 'Create Your Account',
      description: 'Sign up as a patient or healthcare provider using your MetaMask wallet for secure blockchain authentication.',
      step: '01'
    },
    {
      icon: Upload,
      title: 'Upload Medical Records',
      description: 'Securely upload your medical documents, test results, and health data. Everything is encrypted and stored on IPFS.',
      step: '02'
    },
    {
      icon: Share,
      title: 'Share with Doctors',
      description: 'Grant access to healthcare providers instantly. You control who sees what and for how long.',
      step: '03'
    },
    {
      icon: Shield,
      title: 'Stay Protected',
      description: 'All activities are logged on the blockchain. Your data remains secure and you maintain complete ownership.',
      step: '04'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-white to-primary-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-medium mb-4">
            <Shield className="h-4 w-4 mr-2" />
            Simple Process
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            How MedChain
            <span className="text-primary-600 block">Works for You</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Getting started with secure medical record management is easier than you think. 
            Follow these simple steps to take control of your healthcare data.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-primary-100 h-full">
                <CardContent className="p-6 text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-primary-600 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
              
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary-200 transform -translate-y-1/2 z-10">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary-400 rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-20 text-center">
          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 border border-primary-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of patients and healthcare providers who trust MedChain 
              to keep their medical records secure and accessible.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">10,000+</div>
                <div className="text-gray-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
                <div className="text-gray-600">Healthcare Providers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">99.9%</div>
                <div className="text-gray-600">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};