// File: health/frontend/src/pages/DoctorDashboard.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { User, List, FileSearch, FilePen, Activity, ShieldAlert, Stethoscope, Bell } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { toast } from "sonner";
import axios from "axios";

// Define interface types
interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  status: string;
  hasAccess: boolean;
}

interface DoctorProfile {
  name: string;
  specialization: string;
  hospital: string;
  experience: string;
  education: string;
  certifications: string[];
  contactEmail: string;
  contactPhone: string;
  walletAddress: string;
}

interface PatientRecord {
  id: string;
  patientId: string;
  date: string;
  title: string;
  content: string;
  doctor: string;
  status: string;
}

interface AccessLog {
  id: string;
  user: string;
  action: string;
  patientId: string;
  patientName: string;
  timestamp: string;
}

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedPatientRecords, setSelectedPatientRecords] = useState<PatientRecord[]>([]);
  const [diagnosisForm, setDiagnosisForm] = useState({ title: "", notes: "", status: "stable" });

  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null); // State to hold doctor profile [!code ++]
  const [patients, setPatients] = useState<Patient[]>([]);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);

  // Mock data for records and logs until backend is implemented
  const patientRecords = [
    { id: "1", patientId: "1", date: "2025-01-15", title: "Initial Consultation", content: "Patient presents with elevated blood pressure. Recommended lifestyle changes and medication.", doctor: "Dr. Sarah Johnson", status: "Completed" },
    { id: "2", patientId: "1", date: "2025-01-01", title: "Blood Test Results", content: "Cholesterol levels slightly elevated. Continue current medication.", doctor: "Dr. Sarah Johnson", status: "Reviewed" },
    { id: "3", patientId: "2", date: "2025-01-10", title: "ECG Analysis", content: "Irregular heart rhythm detected. Scheduled for further monitoring.", doctor: "Dr. Sarah Johnson", status: "Pending" }
  ];

  const mockAccessLogs = [
    { id: "1", user: "Dr. Sarah Johnson", action: "Viewed", patientId: "1", patientName: "John Doe", timestamp: "2025-01-19 14:30" },
    { id: "2", user: "Dr. Sarah Johnson", action: "Added Diagnosis", patientId: "2", patientName: "Jane Smith", timestamp: "2025-01-18 09:15" },
    { id: "3", user: "Dr. Sarah Johnson", action: "Emergency Access", patientId: "3", patientName: "Robert Brown", timestamp: "2025-01-17 16:45" }
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const patientsResponse = await axios.get('http://localhost:5000/api/patients');
        setPatients(patientsResponse.data.map((p: any) => ({
          id: p.id,
          name: p.full_name,
          age: 45, // Assuming age is a calculated field or mock
          condition: p.medical_history || "N/A", // Re-using for now
          status: "Stable", // Mock status
          hasAccess: true // Mock access
        })));
        // Assuming user data is available after login
        const userId = 'your_user_id_here'; // Replace with dynamic user id
        const profileResponse = await axios.get(`http://localhost:5000/api/profile/${userId}`);
        const profileData = profileResponse.data;
        setDoctorProfile({
          name: profileData.full_name,
          specialization: profileData.additional_info?.specialization || 'N/A',
          hospital: profileData.additional_info?.hospitalName || 'N/A',
          experience: 'N/A', // No experience field in DB schema
          education: profileData.additional_info?.qualification || 'N/A',
          certifications: [], // No certifications in DB schema
          contactEmail: profileData.email,
          contactPhone: profileData.phone || 'N/A',
          walletAddress: profileData.wallet_address
        });

        // For now, setting mock access logs
        setAccessLogs(mockAccessLogs);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        toast.error("Failed to load dashboard data.");
      }
    };
    fetchDashboardData();
  }, []);

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);

    if (patient.hasAccess) {
      const records = patientRecords.filter(record => record.patientId === patient.id);
      setSelectedPatientRecords(records);
    } else {
      setSelectedPatientRecords([]);
      toast.error("Access Denied", {
        description: "You do not have permission to view this patient's records"
      });
    }
  };

  const requestEmergencyAccess = (patientId: string) => {
    toast.success("Emergency Access Requested", {
      description: "Your emergency access request has been logged and is pending approval"
    });
  };

  const addDiagnosis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    toast.success("Diagnosis Added", {
      description: `New diagnosis has been added to ${selectedPatient.name}'s records`
    });

    // Reset form
    setDiagnosisForm({ title: "", notes: "", status: "stable" });
  };

  if (!doctorProfile) {
    return <div>Loading...</div>; // Add a loading state [!code ++]
  }

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
                <h1 className="text-2xl font-bold text-gray-800">Doctor Dashboard</h1>
                <p className="text-gray-600">Welcome back, {doctorProfile.name}</p> // [!code ++]
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </Button>
              <Button variant="outline" onClick={() => navigate("/")}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Card className="shadow-xl border-primary-100">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start bg-primary-100 p-1 gap-1 mb-6">
              <TabsTrigger value="profile" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <User className="h-4 w-4 mr-2" />
                Doctor Profile
              </TabsTrigger>
              <TabsTrigger value="patients" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <List className="h-4 w-4 mr-2" />
                Patient List
              </TabsTrigger>
              <TabsTrigger value="records" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <FileSearch className="h-4 w-4 mr-2" />
                Patient Records
              </TabsTrigger>
              <TabsTrigger value="addDiagnosis" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <FilePen className="h-4 w-4 mr-2" />
                Add Diagnosis
              </TabsTrigger>
              <TabsTrigger value="accessLogs" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Activity className="h-4 w-4 mr-2" />
                Access Logs
              </TabsTrigger>
              <TabsTrigger value="emergency" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <ShieldAlert className="h-4 w-4 mr-2" />
                Emergency Access
              </TabsTrigger>
            </TabsList>

            <CardContent className="pt-6">
              {/* Doctor Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-primary-50 to-emerald-50 p-8 rounded-2xl text-center border border-primary-100">
                      <div className="bg-primary-600 text-white p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                        <User className="h-12 w-12" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">{doctorProfile.name}</h3>
                      <p className="text-primary-600 font-medium mb-1">{doctorProfile.specialization}</p>
                      <p className="text-gray-600 mb-6">{doctorProfile.hospital}</p>
                      <Button className="w-full bg-primary-600 hover:bg-primary-700 mb-4">
                        Edit Profile
                      </Button>
                      <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-primary-200">
                        <p className="text-xs text-gray-600 font-medium mb-1">Connected Wallet</p>
                        <p className="text-xs font-mono text-gray-800 break-all">
                          {doctorProfile.walletAddress}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl p-8 border border-primary-100 shadow-lg">
                      <h3 className="text-2xl font-bold text-gray-800 mb-6">Professional Information</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Full Name</p>
                            <p className="text-lg text-gray-800">{doctorProfile.name}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Specialization</p>
                            <p className="text-lg text-gray-800">{doctorProfile.specialization}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Experience</p>
                            <p className="text-lg text-gray-800">{doctorProfile.experience}</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Hospital</p>
                            <p className="text-lg text-gray-800">{doctorProfile.hospital}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                            <p className="text-lg text-gray-800">{doctorProfile.contactEmail}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Phone</p>
                            <p className="text-lg text-gray-800">{doctorProfile.contactPhone}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Education & Certifications</h4>
                        <p className="text-lg text-gray-800 mb-4">{doctorProfile.education}</p>
                        <div className="flex flex-wrap gap-2">
                          {doctorProfile.certifications.map((cert, index) => (
                            <Badge key={index} className="bg-primary-100 text-primary-800 hover:bg-primary-200 px-3 py-1">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Patient List Tab */}
              <TabsContent value="patients" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-800">Your Patients</h3>
                  <Input placeholder="Search patients..." className="max-w-xs" />
                </div>

                <div className="bg-white rounded-xl border border-primary-100 overflow-hidden shadow-lg">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-primary-50">
                        <TableHead className="font-semibold">Name</TableHead>
                        <TableHead className="font-semibold">Age</TableHead>
                        <TableHead className="font-semibold">Condition</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Access</TableHead>
                        <TableHead className="text-right font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patients.map((patient) => (
                        <TableRow key={patient.id} className="hover:bg-primary-50/50">
                          <TableCell className="font-medium">{patient.name}</TableCell>
                          <TableCell>{patient.age}</TableCell>
                          <TableCell>{patient.condition}</TableCell>
                          <TableCell>
                            <Badge className={
                              patient.status === "Stable" ? "bg-green-100 text-green-800" :
                                patient.status === "Critical" ? "bg-red-100 text-red-800" :
                                  patient.status === "Improving" ? "bg-blue-100 text-blue-800" :
                                    "bg-yellow-100 text-yellow-800"
                            }>
                              {patient.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={patient.hasAccess ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                              {patient.hasAccess ? "Granted" : "No Access"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                handlePatientSelect(patient);
                                setActiveTab("records");
                              }}
                            >
                              View Records
                            </Button>
                            {!patient.hasAccess && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => requestEmergencyAccess(patient.id)}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                Request Access
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Patient Records Tab */}
              <TabsContent value="records" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {selectedPatient
                      ? `Medical Records: ${selectedPatient.name}`
                      : "Select a patient to view records"}
                  </h3>
                </div>

                {selectedPatient ? (
                  selectedPatient.hasAccess ? (
                    selectedPatientRecords.length > 0 ? (
                      <div className="bg-white rounded-xl border border-primary-100 overflow-hidden shadow-lg">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-primary-50">
                              <TableHead className="font-semibold">Date</TableHead>
                              <TableHead className="font-semibold">Title</TableHead>
                              <TableHead className="font-semibold">Doctor</TableHead>
                              <TableHead className="font-semibold">Status</TableHead>
                              <TableHead className="text-right font-semibold">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedPatientRecords.map((record) => (
                              <TableRow key={record.id} className="hover:bg-primary-50/50">
                                <TableCell>{record.date}</TableCell>
                                <TableCell className="font-medium">{record.title}</TableCell>
                                <TableCell>{record.doctor}</TableCell>
                                <TableCell>
                                  <Badge className={
                                    record.status === "Completed" ? "bg-green-100 text-green-800" :
                                      record.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                                        record.status === "New" ? "bg-blue-100 text-blue-800" :
                                          "bg-gray-100 text-gray-800"
                                  }>
                                    {record.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="ghost" size="sm">View Details</Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                      <DialogHeader>
                                        <DialogTitle className="text-xl">{record.title}</DialogTitle>
                                      </DialogHeader>
                                      <div className="space-y-4 mt-4">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">Date</p>
                                            <p className="text-lg">{record.date}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">Doctor</p>
                                            <p className="text-lg">{record.doctor}</p>
                                          </div>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-gray-500 mb-2">Notes</p>
                                          <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="whitespace-pre-wrap">{record.content}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                        <FileSearch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-lg text-gray-600">No records found for this patient.</p>
                      </div>
                    )
                  ) : (
                    <div className="text-center py-12 bg-red-50 rounded-xl border border-red-200">
                      <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-4" />
                      <p className="text-lg text-red-700 mb-4">You do not have permission to view this patient's records.</p>
                      <Button
                        onClick={() => requestEmergencyAccess(selectedPatient.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <ShieldAlert className="h-4 w-4 mr-2" />
                        Request Emergency Access
                      </Button>
                    </div>
                  )
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                    <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg text-gray-600 mb-4">Select a patient from the Patient List tab to view their records.</p>
                    <Button onClick={() => setActiveTab("patients")}>
                      Go to Patient List
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Add Diagnosis Tab */}
              <TabsContent value="addDiagnosis" className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800">Add New Diagnosis</h3>

                {selectedPatient ? (
                  selectedPatient.hasAccess ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-1">
                        <div className="bg-primary-50 p-6 rounded-xl border border-primary-200">
                          <h4 className="font-semibold text-primary-800 mb-4">Patient Information</h4>
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm font-medium text-gray-500">Name</p>
                              <p className="text-lg font-medium text-gray-800">{selectedPatient.name}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Age</p>
                              <p className="text-lg font-medium text-gray-800">{selectedPatient.age}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Condition</p>
                              <p className="text-lg font-medium text-gray-800">{selectedPatient.condition}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Status</p>
                              <Badge className={
                                selectedPatient.status === "Stable" ? "bg-green-100 text-green-800" :
                                  selectedPatient.status === "Critical" ? "bg-red-100 text-red-800" :
                                    selectedPatient.status === "Improving" ? "bg-blue-100 text-blue-800" :
                                      "bg-yellow-100 text-yellow-800"
                              }>
                                {selectedPatient.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl p-8 border border-primary-100 shadow-lg">
                          <form onSubmit={addDiagnosis} className="space-y-6">
                            <div>
                              <Label htmlFor="title" className="text-base font-medium">Diagnosis Title</Label>
                              <Input
                                id="title"
                                placeholder="Enter diagnosis title..."
                                value={diagnosisForm.title}
                                onChange={(e: any) => setDiagnosisForm(prev => ({ ...prev, title: e.target.value }))}
                                required
                                className="mt-2"
                              />
                            </div>

                            <div>
                              <Label htmlFor="notes" className="text-base font-medium">Notes</Label>
                              <Textarea
                                id="notes"
                                placeholder="Enter detailed notes about the diagnosis..."
                                className="min-h-[150px] mt-2"
                                value={diagnosisForm.notes}
                                onChange={(e: any) => setDiagnosisForm(prev => ({ ...prev, notes: e.target.value }))}
                                required
                              />
                            </div>

                            <div>
                              <Label className="text-base font-medium">Status Assessment</Label>
                              <RadioGroup
                                value={diagnosisForm.status}
                                onValueChange={(value: any) => setDiagnosisForm(prev => ({ ...prev, status: value }))}
                                className="mt-3"
                              >
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="improving" id="improving" />
                                    <Label htmlFor="improving">Improving</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="stable" id="stable" />
                                    <Label htmlFor="stable">Stable</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="concerning" id="concerning" />
                                    <Label htmlFor="concerning">Concerning</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="critical" id="critical" />
                                    <Label htmlFor="critical">Critical</Label>
                                  </div>
                                </div>
                              </RadioGroup>
                            </div>

                            <Button type="submit" className="bg-primary-600 hover:bg-primary-700 w-full h-12">
                              <FilePen className="h-4 w-4 mr-2" />
                              Save Diagnosis
                            </Button>
                          </form>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-red-50 rounded-xl border border-red-200">
                      <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-4" />
                      <p className="text-lg text-red-700 mb-4">You do not have permission to add diagnosis for this patient.</p>
                      <Button
                        onClick={() => requestEmergencyAccess(selectedPatient.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <ShieldAlert className="h-4 w-4 mr-2" />
                        Request Emergency Access
                      </Button>
                    </div>
                  )
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                    <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg text-gray-600 mb-4">Select a patient from the Patient List tab first.</p>
                    <Button onClick={() => setActiveTab("patients")}>
                      Go to Patient List
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Access Logs Tab */}
              <TabsContent value="accessLogs" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-800">Access Activity Log</h3>
                  <Button variant="outline">
                    <Activity className="h-4 w-4 mr-2" /> Export Logs
                  </Button>
                </div>

                <div className="bg-white rounded-xl border border-primary-100 overflow-hidden shadow-lg">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-primary-50">
                        <TableHead className="font-semibold">Timestamp</TableHead>
                        <TableHead className="font-semibold">User</TableHead>
                        <TableHead className="font-semibold">Action</TableHead>
                        <TableHead className="font-semibold">Patient</TableHead>
                        <TableHead className="text-right font-semibold">Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accessLogs.map((log) => (
                        <TableRow key={log.id} className="hover:bg-primary-50/50">
                          <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                          <TableCell>{log.user}</TableCell>
                          <TableCell>
                            <Badge className={
                              log.action === "Viewed" ? "bg-blue-100 text-blue-800" :
                                log.action === "Added Diagnosis" ? "bg-green-100 text-green-800" :
                                  log.action === "Emergency Access" ? "bg-red-100 text-red-800" :
                                    "bg-gray-100 text-gray-800"
                            }>
                              {log.action}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">{log.patientName}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">View</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Emergency Access Tab */}
              <TabsContent value="emergency" className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-red-800 mb-3 flex items-center">
                    <ShieldAlert className="h-5 w-5 mr-2" />
                    Emergency Access Protocol
                  </h3>
                  <p className="text-red-700 mb-2">
                    This feature allows you to request temporary access to patient records in emergency situations only.
                    All emergency access requests are logged and audited.
                  </p>
                  <p className="text-red-700 font-medium">
                    Please use this feature responsibly and only when medically necessary.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Patients Without Access</h4>
                    <div className="bg-white rounded-xl border border-primary-100 overflow-hidden shadow-lg">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-primary-50">
                            <TableHead className="font-semibold">Name</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                            <TableHead className="text-right font-semibold">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {patients
                            .filter(patient => !patient.hasAccess)
                            .map((patient) => (
                              <TableRow key={patient.id} className="hover:bg-primary-50/50">
                                <TableCell className="font-medium">{patient.name}</TableCell>
                                <TableCell>
                                  <Badge className={
                                    patient.status === "Critical" ? "bg-red-100 text-red-800" :
                                      patient.status === "Stable" ? "bg-green-100 text-green-800" :
                                        "bg-yellow-100 text-yellow-800"
                                  }>
                                    {patient.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    className="bg-red-600 hover:bg-red-700"
                                    size="sm"
                                    onClick={() => requestEmergencyAccess(patient.id)}
                                  >
                                    <ShieldAlert className="h-4 w-4 mr-2" />
                                    Emergency Access
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          {patients.filter(patient => !patient.hasAccess).length === 0 && (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                                You have access to all patients.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Recent Emergency Access Logs</h4>
                    <div className="bg-white rounded-xl border border-primary-100 overflow-hidden shadow-lg">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-primary-50">
                            <TableHead className="font-semibold">Timestamp</TableHead>
                            <TableHead className="font-semibold">Patient</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {accessLogs
                            .filter(log => log.action.includes("Emergency"))
                            .map((log) => (
                              <TableRow key={log.id} className="hover:bg-primary-50/50">
                                <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                                <TableCell className="font-medium">{log.patientName}</TableCell>
                                <TableCell>
                                  <Badge className="bg-yellow-100 text-yellow-800">
                                    Pending Review
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          {accessLogs.filter(log => log.action.includes("Emergency")).length === 0 && (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                                No emergency access requests recorded.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDashboard;