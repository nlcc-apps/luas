import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Bell, CheckCircle, Clock, Eye, Users, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SubmissionPreview } from "./SubmissionPreview";
import { getSubmissions, saveSubmissions, AppraisalSubmission } from "@/lib/userData";


export const AppraisalSubmissions = () => {
  const [submissions, setSubmissions] = useState<AppraisalSubmission[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [previewSubmission, setPreviewSubmission] = useState<AppraisalSubmission | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);
  const { toast } = useToast();

  // Load submissions from localStorage
  useEffect(() => {
    setSubmissions(getSubmissions());
  }, []);

  // Get unique values for filters
  const periods = useMemo(() => 
    Array.from(new Set(submissions.map(s => s.appraisalPeriod))), [submissions]
  );
  
  const departments = useMemo(() =>
    Array.from(new Set(submissions.map(s => s.department))), [submissions]
  );

  // Filter submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter(submission => {
      const periodMatch = selectedPeriod === "all" || submission.appraisalPeriod === selectedPeriod;
      const departmentMatch = selectedDepartment === "all" || submission.department === selectedDepartment;
      const statusMatch = selectedStatus === "all" || submission.status === selectedStatus;
      
      return periodMatch && departmentMatch && statusMatch;
    });
  }, [submissions, selectedPeriod, selectedDepartment, selectedStatus]);

  // Calculate notifications
  const pendingForManager = submissions.filter(s => s.status === "submitted").length;
  const awaitingManagerReview = submissions.filter(s => s.status === "available_for_manager").length;
  const readyForCEO = submissions.filter(s => s.status === "manager_completed").length;

  const getStatusBadge = (status: AppraisalSubmission["status"]) => {
    const statusConfig = {
      submitted: { label: "Awaiting Admin", variant: "secondary" as const },
      available_for_manager: { label: "With Manager", variant: "default" as const },
      manager_completed: { label: "Manager Done", variant: "outline" as const },
      available_for_ceo: { label: "Ready for CEO", variant: "default" as const },
      completed: { label: "Completed", variant: "default" as const }
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const updateSubmissionStatus = (submissionId: string, newStatus: AppraisalSubmission["status"]) => {
    const updatedSubmissions = submissions.map(submission =>
      submission.id === submissionId
        ? { ...submission, status: newStatus }
        : submission
    );
    setSubmissions(updatedSubmissions);
    saveSubmissions(updatedSubmissions);
  };

  const handleMakeAvailableToManager = (submissionId: string) => {
    updateSubmissionStatus(submissionId, "available_for_manager");
    toast({
      title: "Success",
      description: "Appraisal made available to line manager for review."
    });
  };

  const handleReleaseToCEO = (submissionId: string) => {
    updateSubmissionStatus(submissionId, "available_for_ceo");
    toast({
      title: "Success", 
      description: "Appraisal forwarded to CEO for evaluation."
    });
  };

  const handleMarkCompleted = (submissionId: string) => {
    updateSubmissionStatus(submissionId, "completed");
    toast({
      title: "Success",
      description: "Appraisal marked as completed."
    });
  };

  const handleViewSubmission = (submissionId: string) => {
    const submission = submissions.find(s => s.id === submissionId);
    if (submission) {
      setPreviewSubmission(submission);
      setShowPreview(true);
    }
  };

  const handleBulkAction = (action: "releaseToManager" | "releaseToCEO") => {
    if (selectedSubmissions.length === 0) {
      toast({
        title: "No selections",
        description: "Please select submissions to perform bulk action.",
        variant: "destructive"
      });
      return;
    }

    const newStatus = action === "releaseToManager" ? "available_for_manager" : "available_for_ceo";
    const updatedSubmissions = submissions.map(submission =>
      selectedSubmissions.includes(submission.id)
        ? { ...submission, status: newStatus as AppraisalSubmission["status"] }
        : submission
    );

    setSubmissions(updatedSubmissions);
    saveSubmissions(updatedSubmissions);
    setSelectedSubmissions([]);

    toast({
      title: "Bulk action completed",
      description: `${selectedSubmissions.length} submissions have been ${action === "releaseToManager" ? "released to managers" : "forwarded to CEO"}.`
    });
  };

  const handleSelectSubmission = (submissionId: string) => {
    setSelectedSubmissions(prev => 
      prev.includes(submissionId) 
        ? prev.filter(id => id !== submissionId)
        : [...prev, submissionId]
    );
  };

  const handleSelectAll = () => {
    const eligibleSubmissions = filteredSubmissions.filter(s => 
      s.status === "submitted" || s.status === "manager_completed"
    ).map(s => s.id);
    
    setSelectedSubmissions(prev => 
      prev.length === eligibleSubmissions.length ? [] : eligibleSubmissions
    );
  };

  return (
    <div className="space-y-6">
      {/* Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-orange-800">Pending Admin Action</p>
                <p className="text-2xl font-bold text-orange-900">{pendingForManager}</p>
                <p className="text-xs text-orange-600">Self-appraisals ready for manager assignment</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-800">With Line Managers</p>
                <p className="text-2xl font-bold text-blue-900">{awaitingManagerReview}</p>
                <p className="text-xs text-blue-600">Currently under manager review</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/50">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-800">Ready for CEO</p>
                <p className="text-2xl font-bold text-purple-900">{readyForCEO}</p>
                <p className="text-xs text-purple-600">Manager evaluations completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="All Periods" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Periods</SelectItem>
                {periods.map(period => (
                  <SelectItem key={period} value={period}>{period}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="submitted">Awaiting Admin</SelectItem>
                <SelectItem value="available_for_manager">With Manager</SelectItem>
                <SelectItem value="manager_completed">Manager Done</SelectItem>
                <SelectItem value="available_for_ceo">Ready for CEO</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedPeriod("all");
                setSelectedDepartment("all");
                setSelectedStatus("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedSubmissions.length > 0 && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedSubmissions.length} submission(s) selected
              </span>
              <div className="flex gap-2">
                <Button 
                  size="sm"
                  onClick={() => handleBulkAction("releaseToManager")}
                  disabled={!selectedSubmissions.some(id => 
                    submissions.find(s => s.id === id)?.status === "submitted"
                  )}
                >
                  Release to Managers
                </Button>
                <Button 
                  size="sm"
                  onClick={() => handleBulkAction("releaseToCEO")}
                  disabled={!selectedSubmissions.some(id => 
                    submissions.find(s => s.id === id)?.status === "manager_completed"
                  )}
                >
                  Forward to CEO
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedSubmissions([])}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Submissions ({filteredSubmissions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedSubmissions.length > 0 && selectedSubmissions.length === filteredSubmissions.filter(s => 
                      s.status === "submitted" || s.status === "manager_completed"
                    ).length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Line Manager</TableHead>
                <TableHead>Self Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>
                    {(submission.status === "submitted" || submission.status === "manager_completed") && (
                      <Checkbox
                        checked={selectedSubmissions.includes(submission.id)}
                        onCheckedChange={() => handleSelectSubmission(submission.id)}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{submission.employeeName}</p>
                      <p className="text-sm text-muted-foreground">{submission.employeeId}</p>
                    </div>
                  </TableCell>
                  <TableCell>{submission.department}</TableCell>
                  <TableCell>{submission.appraisalPeriod}</TableCell>
                  <TableCell>{new Date(submission.submissionDate).toLocaleDateString()}</TableCell>
                  <TableCell>{submission.lineManager}</TableCell>
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
                        onClick={() => handleViewSubmission(submission.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {submission.status === "submitted" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleMakeAvailableToManager(submission.id)}
                          className="flex items-center gap-1"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Release to Manager
                        </Button>
                      )}

                      {submission.status === "manager_completed" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleReleaseToCEO(submission.id)}
                          className="flex items-center gap-1"
                        >
                          <ArrowRight className="h-4 w-4" />
                          Forward to CEO
                        </Button>
                      )}

                      {(submission.status === "available_for_ceo" || submission.status === "manager_completed") && (
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleMarkCompleted(submission.id)}
                          className="flex items-center gap-1"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Mark Complete
                        </Button>
                      )}
                      
                      {submission.status === "available_for_manager" && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          Pending
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredSubmissions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No submissions found matching the current filters.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submission Preview Modal */}
      <SubmissionPreview
        submission={previewSubmission}
        open={showPreview}
        onClose={() => setShowPreview(false)}
        onMarkCompleted={handleMarkCompleted}
        onReleaseToManager={handleMakeAvailableToManager}
        onReleaseToCEO={handleReleaseToCEO}
      />
    </div>
  );
};