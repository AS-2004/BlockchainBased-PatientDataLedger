// File: health/frontend/src/pages/Dashboard.tsx

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import {
  FileText,
  Calendar,
  User,
  Settings,
  Share2,
  Shield,
  Download,
  Plus,
  Activity,
  Heart,
  Stethoscope,
  Bell
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Dashboard = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Dr. Smith requested access to your records", time: "2 hours ago", type: "access" },
    { id: 2, message: "New lab results available", time: "1 day ago", type: "results" },
    { id: 3, message: "Appointment reminder: Tomorrow at 2 PM", time: "1 day ago", type: "appointment" }
  ]);

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, action: "Shared records with Dr. Johnson", date: "2025-01-19", type: "share" },
    { id: 2, action: "Uploaded new lab results", date: "2025-01-18", type: "upload" },
    { id: 3, action: "Updated profile information", date: "2025-01-17", type: "update" }
  ]);

  const [doctors, setDoctors] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [fileTitle, setFileTitle] = useState('');
  const [fileType, setFileType] = useState('');
  const [appointmentDetails, setAppointmentDetails] = useState({
    doctorId: '',
    date: '',
    time: '',
    reason: '',
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/doctors');
        setDoctors(response.data);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
        toast.error("Failed to load doctors list.");
      }
    };
    fetchDoctors();
  }, []);

  // Handle file upload form submission
  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileToUpload || !fileTitle || !fileType) {
      toast.error('Please fill in all fields and select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('medicalRecord', fileToUpload);
    formData.append('title', fileTitle);
    formData.append('recordType', fileType);
    // You would get the patientId from user state after login
    formData.append('patientId', '1'); // Example patient ID

    try {
      // Replace with your actual authentication token
      const token = 'your-auth-token';
      await axios.post('http://localhost:5000/api/medical-records/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      toast.success('Medical record uploaded successfully!');
      setIsUploadModalOpen(false);
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload medical record.');
    }
  };

  // Handle appointment booking form submission
  const handleAppointmentBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentDetails.doctorId || !appointmentDetails.date || !appointmentDetails.time) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      // Replace with your actual authentication token
      const token = 'your-auth-token';
      await axios.post('http://localhost:5000/api/appointments', appointmentDetails, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      toast.success('Appointment request sent successfully!');
      setIsAppointmentModalOpen(false);
    } catch (error) {
      console.error('Appointment booking failed:', error);
      toast.error('Failed to book appointment.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white border-b border-primary-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-primary-600 p-2 rounded-xl">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Patient Dashboard</h1>
                <p className="text-gray-600">Welcome back</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="relative">
                <Bell className="h-4 w-4" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </Button>
              <Button variant="outline" asChild>
                <Link to="/">Sign Out</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-100">Total Records</p>
                  <p className="text-3xl font-bold">24</p>
                </div>
                <FileText className="h-8 w-8 text-primary-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100">Shared Records</p>
                  <p className="text-3xl font-bold">8</p>
                </div>
                <Share2 className="h-8 w-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Appointments</p>
                  <p className="text-3xl font-bold">3</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Active Doctors</p>
                  <p className="text-3xl font-bold">5</p>
                </div>
                <User className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Actions */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg border-primary-100">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800">
                  <Heart className="h-5 w-5 mr-2 text-primary-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
                    <DialogTrigger asChild>
                      <Button className="h-20 bg-primary-600 hover:bg-primary-700 flex flex-col items-center justify-center space-y-2">
                        <Plus className="h-6 w-6" />
                        <span>Upload Records</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Upload Medical Record</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleFileUpload} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="fileTitle">Record Title</Label>
                          <Input
                            id="fileTitle"
                            placeholder="e.g., Annual Check-up Report"
                            value={fileTitle}
                            onChange={(e) => setFileTitle(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fileType">Record Type</Label>
                          <Select onValueChange={setFileType} value={fileType}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select record type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Lab Results">Lab Results</SelectItem>
                              <SelectItem value="Prescription">Prescription</SelectItem>
                              <SelectItem value="Imaging">Imaging</SelectItem>
                              <SelectItem value="Consultation">Consultation Notes</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="file">File</Label>
                          <Input
                            id="file"
                            type="file"
                            required
                            onChange={(e) => e.target.files && setFileToUpload(e.target.files[0])}
                          />
                        </div>
                        <Button type="submit" className="w-full">Upload File</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" className="h-20 border-primary-200 hover:bg-primary-50 flex flex-col items-center justify-center space-y-2">
                    <Share2 className="h-6 w-6 text-primary-600" />
                    <span>Share with Doctor</span>
                  </Button>
                  <Dialog open={isAppointmentModalOpen} onOpenChange={setIsAppointmentModalOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="h-20 border-primary-200 hover:bg-primary-50 flex flex-col items-center justify-center space-y-2">
                        <Calendar className="h-6 w-6 text-primary-600" />
                        <span>Book Appointment</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Book an Appointment</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleAppointmentBooking} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="doctor">Select Doctor</Label>
                          <Select onValueChange={(value) => setAppointmentDetails(prev => ({ ...prev, doctorId: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a doctor" />
                            </SelectTrigger>
                            <SelectContent>
                              {doctors.map(doctor => (
                                <SelectItem key={doctor.id} value={doctor.id}>
                                  {doctor.full_name} ({doctor.specialization})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="date">Date</Label>
                          <Input
                            id="date"
                            type="date"
                            value={appointmentDetails.date}
                            onChange={(e) => setAppointmentDetails(prev => ({ ...prev, date: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="time">Time</Label>
                          <Input
                            id="time"
                            type="time"
                            value={appointmentDetails.time}
                            onChange={(e) => setAppointmentDetails(prev => ({ ...prev, time: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reason">Reason for Visit (Optional)</Label>
                          <Textarea
                            id="reason"
                            placeholder="Describe the reason for your visit..."
                            value={appointmentDetails.reason}
                            onChange={(e) => setAppointmentDetails(prev => ({ ...prev, reason: e.target.value }))}
                          />
                        </div>
                        <Button type="submit" className="w-full">Request Appointment</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" className="h-20 border-primary-200 hover:bg-primary-50 flex flex-col items-center justify-center space-y-2">
                    <Download className="h-6 w-6 text-primary-600" />
                    <span>Download Records</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Medical Records */}
            <Card className="shadow-lg border-primary-100">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-gray-800">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary-600" />
                    Recent Medical Records
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary-600">
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Blood Test Results", date: "2025-01-18", doctor: "Dr. Smith", type: "Lab Results" },
                    { name: "X-Ray Report", date: "2025-01-15", doctor: "Dr. Johnson", type: "Imaging" },
                    { name: "Prescription", date: "2025-01-12", doctor: "Dr. Brown", type: "Medication" },
                    { name: "Consultation Notes", date: "2025-01-10", doctor: "Dr. Davis", type: "Consultation" }
                  ].map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{record.name}</p>
                          <p className="text-sm text-gray-600">{record.doctor} • {record.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {record.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <Card className="shadow-lg border-primary-100">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800">
                  <Bell className="h-5 w-5 mr-2 text-primary-600" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-3 bg-primary-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-800">{notification.message}</p>
                      <p className="text-xs text-gray-600 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-lg border-primary-100">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800">
                  <Activity className="h-5 w-5 mr-2 text-primary-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                        <p className="text-xs text-gray-600">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Security Status */}
            <Card className="shadow-lg border-primary-100">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800">
                  <Shield className="h-5 w-5 mr-2 text-primary-600" />
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Wallet Connected</span>
                    <div className="flex items-center text-primary-600">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mr-2"></div>
                      <span className="text-sm font-medium">Active</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Data Encryption</span>
                    <div className="flex items-center text-primary-600">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mr-2"></div>
                      <span className="text-sm font-medium">AES-256</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Backup Status</span>
                    <div className="flex items-center text-primary-600">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mr-2"></div>
                      <span className="text-sm font-medium">Synced</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;