import React, { useState } from 'react';
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

const Dashboard = () => {
  const [notifications] = useState([
    { id: 1, message: "Dr. Smith requested access to your records", time: "2 hours ago", type: "access" },
    { id: 2, message: "New lab results available", time: "1 day ago", type: "results" },
    { id: 3, message: "Appointment reminder: Tomorrow at 2 PM", time: "1 day ago", type: "appointment" }
  ]);

  const [recentActivity] = useState([
    { id: 1, action: "Shared records with Dr. Johnson", date: "2025-01-19", type: "share" },
    { id: 2, action: "Uploaded new lab results", date: "2025-01-18", type: "upload" },
    { id: 3, action: "Updated profile information", date: "2025-01-17", type: "update" }
  ]);

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
                  <Button className="h-20 bg-primary-600 hover:bg-primary-700 flex flex-col items-center justify-center space-y-2">
                    <Plus className="h-6 w-6" />
                    <span>Upload Records</span>
                  </Button>
                  <Button variant="outline" className="h-20 border-primary-200 hover:bg-primary-50 flex flex-col items-center justify-center space-y-2">
                    <Share2 className="h-6 w-6 text-primary-600" />
                    <span>Share with Doctor</span>
                  </Button>
                  <Button variant="outline" className="h-20 border-primary-200 hover:bg-primary-50 flex flex-col items-center justify-center space-y-2">
                    <Calendar className="h-6 w-6 text-primary-600" />
                    <span>Book Appointment</span>
                  </Button>
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