import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { MetamaskConnect } from "@/components/MetamaskConnect";
import { Stethoscope, ArrowLeft } from "lucide-react";

const Login = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const navigate = useNavigate();

  const handleSignatureVerification = async (signature: string, address: string) => {
    try {
      setIsAuthenticating(true);
      
      // Simulate gas fee deduction
      toast.info("Processing transaction...", {
        description: "Gas fees will be deducted from your wallet"
      });

      console.log("Signature:", signature);
      console.log("Address:", address);

      // Here you would make an API call to your backend to verify the signature
      // and check if the user exists in your MySQL database
      // Example: const response = await fetch('/api/login', { method: 'POST', body: JSON.stringify({ signature, address }) })
      
      // Simulate backend verification
      await new Promise(resolve => setTimeout(resolve, 2000));

      // For demo purposes, determine user type based on wallet address
      // In real implementation, this would come from your database
      const userType = address.toLowerCase().includes('a') ? 'doctor' : 'patient';

      // Authentication success
      toast.success("Login successful!", {
        description: "Welcome back to MedChain"
      });

      // Navigate based on user type from database
      if (userType === 'doctor') {
        navigate("/doctordashboard");
      } else {
        navigate("/patientdashboard");
      }
      
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error("Authentication failed", {
        description: "Could not verify your wallet signature"
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-emerald-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary-400 rounded-full blur-3xl animate-pulse-soft"></div>
        <div className="absolute bottom-32 right-32 w-40 h-40 bg-emerald-400 rounded-full blur-3xl animate-pulse-soft"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Card className="shadow-2xl border-primary-100">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="flex justify-center">
              <div className="bg-primary-600 p-3 rounded-2xl">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl font-bold text-gray-800">Welcome Back</CardTitle>
              <p className="text-gray-600 mt-2">
                Sign in to access your secure medical records
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <MetamaskConnect 
              walletAddress={walletAddress} 
              setWalletAddress={setWalletAddress} 
              onSignMessage={handleSignatureVerification} 
              showSignButton={true} 
            />

            {isAuthenticating && (
              <div className="text-center py-4">
                <div className="inline-flex items-center px-4 py-2 bg-primary-50 rounded-full text-primary-700">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                  Authenticating...
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 text-center text-sm pt-8">
            <div className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium hover:underline">
                Create account
              </Link>
            </div>
            <Link 
              to="/" 
              className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to home
            </Link>
          </CardFooter>
        </Card>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">Secured by blockchain technology</p>
          <div className="flex items-center justify-center space-x-6 text-xs text-gray-400">
            <span>🔒 HIPAA Compliant</span>
            <span>⚡ Instant Access</span>
            <span>🛡️ End-to-End Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;