import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Zap, Users, Lock, Globe, Clock } from 'lucide-react';

export const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: 'Blockchain Security',
      description: 'Your medical data is encrypted and stored on a decentralized blockchain, ensuring maximum security and immutability.',
      color: 'bg-primary-100 text-primary-600'
    },
    {
      icon: Zap,
      title: 'Instant Access',
      description: 'Share your medical records with healthcare providers instantly, anywhere in the world, with just a few clicks.',
      color: 'bg-emerald-100 text-emerald-600'
    },
    {
      icon: Users,
      title: 'Doctor Collaboration',
      description: 'Enable seamless collaboration between healthcare providers while maintaining complete control over your data.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Lock,
      title: 'Privacy First',
      description: 'You own your data. Grant and revoke access permissions at any time. Your privacy is always protected.',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Globe,
      title: 'Global Access',
      description: 'Access your medical records from anywhere in the world. Perfect for travelers and international patients.',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Your medical records are available 24/7, ensuring healthcare providers can access critical information when needed.',
      color: 'bg-pink-100 text-pink-600'
    }
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-medium mb-4">
            <Zap className="h-4 w-4 mr-2" />
            Powerful Features
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need for
            <span className="text-primary-600 block">Secure Healthcare</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform combines cutting-edge blockchain technology with user-friendly design 
            to revolutionize how you manage and share your medical records.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-primary-100"
            >
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Feature Highlight */}
        <div className="mt-20 bg-gradient-to-r from-primary-50 to-emerald-50 rounded-3xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                HIPAA Compliant & Auditable
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Our platform meets all HIPAA compliance requirements and provides complete audit trails 
                for all data access and sharing activities. Every interaction is logged and verifiable 
                on the blockchain.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-primary-600">
                  <Shield className="h-5 w-5 mr-2" />
                  <span className="font-medium">HIPAA Compliant</span>
                </div>
                <div className="flex items-center text-emerald-600">
                  <Lock className="h-5 w-5 mr-2" />
                  <span className="font-medium">End-to-End Encrypted</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-primary-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-600">Security Status</span>
                  <div className="flex items-center text-primary-600">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-sm font-medium">Active</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Encryption</span>
                    <span className="text-sm font-medium text-primary-600">AES-256</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Blockchain</span>
                    <span className="text-sm font-medium text-primary-600">Ethereum</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Compliance</span>
                    <span className="text-sm font-medium text-primary-600">HIPAA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};