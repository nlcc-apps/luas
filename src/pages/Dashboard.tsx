import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserLogin } from "@/components/auth/UserLogin";
import { SelfAppraisalSection } from "@/components/SelfAppraisalSection";
import { Logo } from "@/components/ui/Logo";
import { SubmissionPreview } from "@/components/admin/SubmissionPreview";
import { StaffAppraisalResultComponent } from "@/components/AppraisalResult";
import { calculateStaffAppraisal } from "@/lib/appraisalCalculator";
import { User, initializeData, getSubmissionsForManager, getSubmissionsForCEO, AppraisalSubmission, getSubmissions, saveSubmissions } from "@/lib/userData";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Bell, Users, FileText, Star, Eye, CheckCircle, Download } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Dashboard = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [submissions, setSubmissions] = useState<AppraisalSubmission[]>([]);
  const [previewSubmission, setPreviewSubmission] = useState<AppraisalSubmission | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    initializeData();
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      loadSubmissions(user);
    }
  }, []);

  const loadSubmissions = (user: User) => {
    if (user.role === "manager") {
      setSubmissions(getSubmissionsForManager(user.id));
    } else if (user.role === "ceo") {
      setSubmissions(getSubmissionsForCEO());
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
    loadSubmissions(user);
    toast({
      title: "Welcome back!",
      description: `Logged in as ${user.name}`,
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    setSubmissions([]);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const handleSelfAppraisal = () => {
    toast({
      title: "Self Appraisal",
      description: "Opening self-appraisal form...",
    });
  };

  const handleEvaluateSubmission = (submissionId: string) => {
    const submission = submissions.find(s => s.id === submissionId);
    if (submission) {
      setPreviewSubmission(submission);
      setShowPreview(true);
    }
  };

  const getStatusBadge = (status: AppraisalSubmission["status"]) => {
    const statusConfig = {
      submitted: { label: "Submitted", variant: "secondary" as const },
      available_for_manager: { label: "Ready for Review", variant: "default" as const },
      manager_completed: { label: "Manager Complete", variant: "outline" as const },
      available_for_ceo: { label: "Ready for CEO", variant: "default" as const },
      completed: { label: "Completed", variant: "default" as const }
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (!currentUser) {
    return <UserLogin onLogin={handleLogin} />;
  }

  // Show different dashboard for employees
  if (currentUser.role === "employee") {
    return <EmployeeDashboard currentUser={currentUser} onLogout={handleLogout} />;
  }

  const pendingReviews = submissions.filter(s => 
    (currentUser.role === "manager" && s.status === "available_for_manager") ||
    (currentUser.role === "ceo" && s.status === "available_for_ceo")
  ).length;

  const completedReviews = submissions.filter(s => 
    s.status === "manager_completed" || s.status === "completed"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <Logo size="lg" />
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {currentUser.role === "ceo" ? "CEO Dashboard" : 
                 currentUser.role === "manager" ? "Manager Dashboard" : 
                 "Employee Dashboard"}
              </h1>
              <p className="text-xl text-muted-foreground">
                Welcome back, {currentUser.name}
              </p>
            </div>
          </div>
          <Button 
            variant="destructive" 
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="pt-4">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Pending Reviews</p>
                    <p className="text-2xl font-bold text-blue-900">{pendingReviews}</p>
                    <p className="text-xs text-blue-600">Awaiting your evaluation</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="pt-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Completed</p>
                    <p className="text-2xl font-bold text-green-900">{completedReviews}</p>
                    <p className="text-xs text-green-600">Reviews completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50/50">
              <CardContent className="pt-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-purple-800">Total Team</p>
                    <p className="text-2xl font-bold text-purple-900">{submissions.length}</p>
                    <p className="text-xs text-purple-600">
                      {currentUser.role === "ceo" ? "Line managers" : "Direct reports"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="submissions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="submissions">
                {currentUser.role === "ceo" ? "Manager Evaluations" : "Team Evaluations"}
              </TabsTrigger>
              {currentUser.role !== "ceo" && (
                <TabsTrigger value="self-appraisal">My Self Appraisal</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="submissions">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {currentUser.role === "ceo" 
                      ? "Line Manager Appraisals" 
                      : "Team Member Appraisals"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          {currentUser.role === "ceo" ? "Manager" : "Employee"}
                        </TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Self Rating</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissions.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{submission.employeeName}</p>
                              <p className="text-sm text-muted-foreground">{submission.employeeId}</p>
                            </div>
                          </TableCell>
                          <TableCell>{submission.department}</TableCell>
                          <TableCell>{submission.appraisalPeriod}</TableCell>
                          <TableCell>{new Date(submission.submissionDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{submission.scores.selfRating.toFixed(1)}</span>
                              {submission.scores.managerRating && (
                                <span className="text-muted-foreground">
                                  / {submission.scores.managerRating.toFixed(1)}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(submission.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEvaluateSubmission(submission.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              
                              {currentUser.role === "manager" && submission.status === "available_for_manager" && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEvaluateSubmission(submission.id)}
                                  className="flex items-center gap-1"
                                >
                                  <Star className="h-4 w-4" />
                                  Evaluate
                                </Button>
                              )}
                              
                              {currentUser.role === "ceo" && submission.status === "available_for_ceo" && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEvaluateSubmission(submission.id)}
                                  className="flex items-center gap-1"
                                >
                                  <Star className="h-4 w-4" />
                                  Evaluate KPIs
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {submissions.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No submissions found for your review.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {currentUser.role !== "ceo" && (
              <TabsContent value="self-appraisal">
                <Card>
                  <CardHeader>
                    <CardTitle>My Self Appraisal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SelfAppraisalSection 
                      currentUser={currentUser}
                      onSubmit={(data) => {
                        // Save the self-appraisal submission
                        const submissions = getSubmissions();
                        const { productivity, quality, communication, teamwork, initiative, reliability } = data;
                        const selfRating = (productivity + quality + communication + teamwork + initiative + reliability) / 6;
                        
                        const newSubmission: AppraisalSubmission = {
                          id: `sub_${Date.now()}`,
                          employeeId: currentUser!.id,
                          employeeName: currentUser!.name,
                          department: currentUser!.department,
                          submissionDate: new Date().toISOString(),
                          appraisalPeriod: data.reviewPeriod,
                          status: "submitted",
                          lineManager: currentUser!.lineManager || "",
                          selfAppraisal: data,
                          scores: { selfRating }
                        };
                        
                        saveSubmissions([...submissions, newSubmission]);
                        
                        toast({
                          title: "Self Appraisal Submitted",
                          description: "Your self-appraisal has been submitted for review",
                        });
                      }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>

      {/* Submission Preview Modal */}
      <SubmissionPreview
        submission={previewSubmission}
        open={showPreview}
        onClose={() => setShowPreview(false)}
        userRole={currentUser.role}
      />
    </div>
  );
};

export default Dashboard;

// Employee Dashboard Component
export const EmployeeDashboard = ({ currentUser, onLogout }: { currentUser: User, onLogout: () => void }) => {
  const [userSubmission, setUserSubmission] = useState<AppraisalSubmission | null>(null);
  const [showReport, setShowReport] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load the employee's own submission
    const submissions = getSubmissions();
    const mySubmission = submissions.find(s => s.employeeId === currentUser.id);
    setUserSubmission(mySubmission);
  }, [currentUser.id]);

  const getEmployeeStatusDisplay = (status: AppraisalSubmission["status"]) => {
    const statusConfig = {
      submitted: { label: "Submitted (with admin)", variant: "secondary" as const, description: "Your appraisal has been submitted and is being processed by admin" },
      available_for_manager: { label: "Under Evaluation (with manager)", variant: "default" as const, description: "Your line manager is currently reviewing your appraisal" },
      manager_completed: { label: "Manager Review Complete", variant: "outline" as const, description: "Manager has completed evaluation, awaiting final approval" },
      available_for_ceo: { label: "Under Final Review", variant: "default" as const, description: "Under final review by senior management" },
      completed: { label: "Completed", variant: "default" as const, description: "Your appraisal process is complete" }
    };
    
    const config = statusConfig[status];
    return (
      <div className="space-y-2">
        <Badge variant={config.variant}>{config.label}</Badge>
        <p className="text-sm text-muted-foreground">{config.description}</p>
      </div>
    );
  };

  const calculateTotalScore = () => {
    if (!userSubmission) return null;
    
    const selfScore = userSubmission.scores.selfRating;
    const managerScore = userSubmission.scores.managerRating;
    
    if (managerScore) {
      return ((selfScore + managerScore) / 2).toFixed(1);
    }
    
    return selfScore.toFixed(1);
  };

  const handleGenerateReport = () => {
    if (!userSubmission) return;
    
    setShowReport(true);
    toast({
      title: "Report Generated",
      description: "Your submission report is ready for review",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <Logo size="lg" />
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Employee Dashboard
              </h1>
              <p className="text-xl text-muted-foreground">
                Welcome back, {currentUser.name}
              </p>
            </div>
          </div>
          <Button 
            variant="destructive" 
            onClick={onLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Main Content Tabs */}
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="dashboard">EmployeeDashboard</TabsTrigger>
              <TabsTrigger value="self-appraisal">Start Self Appraisal</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <Card>
                <CardHeader>
                  <CardTitle>My Appraisal Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {userSubmission ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold mb-2">Current Status</h3>
                          {getEmployeeStatusDisplay(userSubmission.status)}
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Total Score</h3>
                          <div className="text-3xl font-bold text-primary">
                            {calculateTotalScore()}/5.0
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {userSubmission.scores.managerRating 
                              ? "Combined self and manager rating"
                              : "Self rating (pending manager evaluation)"
                            }
                          </p>
                        </div>
                      </div>
                      
                      {userSubmission.scores.managerRating && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                          <div>
                            <h4 className="font-medium text-sm text-muted-foreground">Self Rating</h4>
                            <div className="text-xl font-semibold">{userSubmission.scores.selfRating.toFixed(1)}/5.0</div>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm text-muted-foreground">Manager Rating</h4>
                            <div className="text-xl font-semibold">{userSubmission.scores.managerRating.toFixed(1)}/5.0</div>
                          </div>
                        </div>
                       )}
                       
                       <div className="pt-6 border-t">
                         <Button 
                           onClick={handleGenerateReport}
                           className="w-full flex items-center gap-2"
                           disabled={!userSubmission}
                         >
                           <Download className="h-4 w-4" />
                           Generate Submission Report
                         </Button>
                       </div>
                     </div>
                   ) : (
                     <div className="text-center py-8">
                       <p className="text-muted-foreground">You haven't submitted your self-appraisal yet.</p>
                       <p className="text-sm text-muted-foreground mt-2">
                         Switch to the "Start Self Appraisal" tab to submit your appraisal.
                       </p>
                     </div>
                   )}
                 </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="self-appraisal">
              <Card>
                <CardHeader>
                  <CardTitle>Submit Your Self Appraisal</CardTitle>
                </CardHeader>
                <CardContent>
                  <SelfAppraisalSection 
                    currentUser={currentUser}
                    onSubmit={(data) => {
                      // Save the self-appraisal submission
                      const submissions = getSubmissions();
                      const { productivity, quality, communication, teamwork, initiative, reliability } = data;
                      const selfRating = (productivity + quality + communication + teamwork + initiative + reliability) / 6;
                      
                      const newSubmission: AppraisalSubmission = {
                        id: `sub_${Date.now()}`,
                        employeeId: currentUser.id,
                        employeeName: currentUser.name,
                        department: currentUser.department,
                        submissionDate: new Date().toISOString(),
                        appraisalPeriod: data.reviewPeriod,
                        status: "submitted",
                        lineManager: currentUser.lineManager || "",
                        selfAppraisal: data,
                        scores: { selfRating }
                      };
                      
                      saveSubmissions([...submissions, newSubmission]);
                      setUserSubmission(newSubmission);
                      
                      toast({
                        title: "Self Appraisal Submitted",
                        description: "Your self-appraisal has been submitted for review",
                      });
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Submission Report Modal */}
      {userSubmission && showReport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Submission Report</h2>
                <Button variant="ghost" onClick={() => setShowReport(false)}>
                  ✕
                </Button>
              </div>
              
              {userSubmission.selfAppraisal && (
                <StaffAppraisalResultComponent
                  result={calculateStaffAppraisal(userSubmission.selfAppraisal)}
                  employeeName={userSubmission.employeeName}
                  position={currentUser.position}
                  reviewPeriod={userSubmission.appraisalPeriod}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};