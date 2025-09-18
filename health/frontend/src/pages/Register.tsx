import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { MetamaskConnect } from "@/components/MetamaskConnect";
import { CalendarIcon, Briefcase as BriefcaseMedical, Stethoscope, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import axios from "axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Register = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<"patient" | "doctor">("patient");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [date, setDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    medicalId: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    bloodGroup: "",
    qualification: "",
    specialization: "",
    hospitalName: "",
    medicalHistory: "",
  });
  const [medicalRecordFile, setMedicalRecordFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setMedicalRecordFile(e.target.files[0]);
    }
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setCalendarOpen(false);
  };

  const validateForm = () => {
    if (!walletAddress) {
      toast.error("Please connect your MetaMask wallet");
      return false;
    }

    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name");
      return false;
    }

    if (!formData.email.trim()) {
      toast.error("Please enter your email address");
      return false;
    }

    if (!formData.gender) {
      toast.error("Please select your gender");
      return false;
    }

    if (userType === "doctor") {
      if (!formData.medicalId.trim()) {
        toast.error("Please enter your medical registration ID");
        return false;
      }
      if (!formData.specialization.trim()) {
        toast.error("Please enter your specialization");
        return false;
      }
      if (!formData.qualification.trim()) {
        toast.error("Please enter your qualification");
        return false;
      }
      if (!formData.hospitalName.trim()) {
        toast.error("Please enter your hospital/clinic name");
        return false;
      }
    }

    if (userType === "patient" && !formData.address.trim()) {
      toast.error("Please enter your address");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      toast.info("Processing transaction...", {
        description: "Gas fees will be deducted from your wallet"
      });

      const commonData = {
        walletAddress,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        dateOfBirth: date ? format(date, "yyyy-MM-dd") : null,
      };

      if (userType === "patient") {
        const patientFormData = new FormData();
        Object.entries(commonData).forEach(([key, value]) => patientFormData.append(key, value as string));
        patientFormData.append("address", formData.address);
        patientFormData.append("bloodGroup", formData.bloodGroup);
        patientFormData.append("medicalHistory", formData.medicalHistory);
        if (medicalRecordFile) {
          patientFormData.append("medicalRecord", medicalRecordFile);
        }

        await axios.post("http://localhost:5000/api/register/patient", patientFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

      } else {
        const doctorData = {
          ...commonData,
          medicalId: formData.medicalId,
          specialization: formData.specialization,
          qualification: formData.qualification,
          hospitalName: formData.hospitalName
        };
        await axios.post("http://localhost:5000/api/register/doctor", doctorData);
      }

      toast.success("Account created successfully!", {
        description: "Welcome to MedChain! You can now access your dashboard."
      });

      if (userType === "doctor") {
        navigate("/doctordashboard");
      } else {
        navigate("/patientdashboard");
      }

    } catch (err) {
      toast.error("Registration failed", {
        description: "Please try again or contact support"
      });
      console.error("Registration error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-emerald-50 py-12 px-4">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary-400 rounded-full blur-3xl animate-pulse-soft"></div>
        <div className="absolute bottom-32 right-32 w-40 h-40 bg-emerald-400 rounded-full blur-3xl animate-pulse-soft"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <Card className="shadow-2xl border-primary-100">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="flex justify-center">
              <div className="bg-primary-600 p-3 rounded-2xl">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl font-bold text-gray-800">Join MedChain</CardTitle>
              <p className="text-gray-600 mt-2">
                Create your account to securely manage medical records
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Type Selection */}
              <div className="space-y-3">
                <Label className="text-base font-medium">I am a:</Label>
                <RadioGroup
                  value={userType}
                  onValueChange={(value) => setUserType(value as "patient" | "doctor")}
                  className="flex justify-center space-x-8 py-4 bg-primary-50 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="patient" id="patient" />
                    <Label htmlFor="patient" className="font-medium cursor-pointer">Patient</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="doctor" id="doctor" />
                    <Label htmlFor="doctor" className="font-medium cursor-pointer">Healthcare Provider</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Wallet Connection */}
              <div className="space-y-2">
                <Label className="text-base font-medium">Blockchain Wallet *</Label>
                <MetamaskConnect
                  walletAddress={walletAddress}
                  setWalletAddress={setWalletAddress}
                  showSignButton={false}
                />
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Doctor-specific fields */}
              {userType === "doctor" && (
                <div className="space-y-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <h3 className="font-semibold text-emerald-800 flex items-center">
                    <BriefcaseMedical className="h-5 w-5 mr-2" />
                    Professional Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="medicalId">Medical Registration ID *</Label>
                      <Input
                        id="medicalId"
                        placeholder="Your medical license number"
                        required
                        value={formData.medicalId}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization *</Label>
                      <Input
                        id="specialization"
                        placeholder="e.g., Cardiology, Neurology"
                        required
                        value={formData.specialization}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="qualification">Qualification *</Label>
                      <Input
                        id="qualification"
                        placeholder="e.g., MBBS, MD, MS"
                        required
                        value={formData.qualification}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hospitalName">Hospital/Clinic *</Label>
                      <Input
                        id="hospitalName"
                        placeholder="Your workplace"
                        required
                        value={formData.hospitalName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 xxxxxxxxxx"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Gender *</Label>
                  <Select value={formData.gender} onValueChange={handleSelectChange("gender")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Patient-specific fields */}
              {userType === "patient" && (
                <div className="space-y-4 p-4 bg-primary-50 rounded-lg border border-primary-200">
                  <h3 className="font-semibold text-primary-800">Personal Information</h3>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      placeholder="Your home address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}

              {/* Date of Birth and Blood Group */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-gray-500"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {userType === "patient" && (
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Select value={formData.bloodGroup} onValueChange={handleSelectChange("bloodGroup")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Patient Medical History */}
              {userType === "patient" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="medicalHistory">Medical History (Optional)</Label>
                    <Textarea
                      id="medicalHistory"
                      placeholder="Brief description of any relevant medical history, allergies, or conditions..."
                      rows={4}
                      value={formData.medicalHistory}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medicalRecords">Upload Medical Records (Optional)</Label>
                    <Input
                      id="medicalRecords"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-gray-500">
                      Upload previous medical reports, prescriptions, or relevant documents (Max 10MB)
                    </p>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting || !walletAddress}
                className="w-full bg-primary-600 hover:bg-primary-700 h-12 text-lg font-medium"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 text-center text-sm pt-8">
            <div className="text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium hover:underline">
                Sign in
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

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-primary-100 text-center">
          <p className="text-sm text-gray-600 mb-2">🔒 Your data is secured with blockchain technology</p>
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <span>HIPAA Compliant</span>
            <span>•</span>
            <span>End-to-End Encrypted</span>
            <span>•</span>
            <span>Decentralized Storage</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;