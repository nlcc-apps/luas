import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bell, CheckCircle, Clock, Eye, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AppraisalSubmission {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  submissionDate: string;
  appraisalPeriod: string;
  status: "submitted" | "available_for_manager" | "manager_completed" | "completed";
  lineManager: string;
  scores: {
    selfRating: number;
    managerRating?: number;
  };
}

// Mock data - in real app this would come from your backend
const mockSubmissions: AppraisalSubmission[] = [
  {
    id: "1",
    employeeName: "John Smith",
    employeeId: "EMP001",
    department: "Engineering",
    submissionDate: "2024-12-15",
    appraisalPeriod: "Q4 2024",
    status: "submitted",
    lineManager: "Sarah Johnson",
    scores: { selfRating: 4.2 }
  },
  {
    id: "2", 
    employeeName: "Mary Davis",
    employeeId: "EMP002",
    department: "Marketing",
    submissionDate: "2024-12-14",
    appraisalPeriod: "Q4 2024",
    status: "available_for_manager",
    lineManager: "Mike Wilson",
    scores: { selfRating: 3.8 }
  },
  {
    id: "3",
    employeeName: "Robert Brown",
    employeeId: "EMP003", 
    department: "Engineering",
    submissionDate: "2024-12-13",
    appraisalPeriod: "Q4 2024",
    status: "manager_completed",
    lineManager: "Sarah Johnson",
    scores: { selfRating: 4.0, managerRating: 3.9 }
  },
  {
    id: "4",
    employeeName: "Lisa Wilson",
    employeeId: "EMP004",
    department: "HR",
    submissionDate: "2025-01-10",
    appraisalPeriod: "Q1 2025",
    status: "submitted",
    lineManager: "David Chen",
    scores: { selfRating: 4.5 }
  }
];

export const AppraisalSubmissions = () => {
  const [submissions] = useState<AppraisalSubmission[]>(mockSubmissions);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const { toast } = useToast();

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

  const getStatusBadge = (status: AppraisalSubmission["status"]) => {
    const statusConfig = {
      submitted: { label: "Awaiting Admin", variant: "secondary" as const },
      available_for_manager: { label: "With Manager", variant: "default" as const },
      manager_completed: { label: "Manager Done", variant: "outline" as const },
      completed: { label: "Completed", variant: "default" as const }
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleMakeAvailableToManager = (submissionId: string) => {
    // In real app, this would update the backend
    toast({
      title: "Success",
      description: "Appraisal made available to line manager for review."
    });
  };

  const handleViewSubmission = (submissionId: string) => {
    // In real app, this would open submission details
    toast({
      title: "View Submission",
      description: `Opening submission ${submissionId} details...`
    });
  };

  return (
    <div className="space-y-6">
      {/* Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Submissions ({filteredSubmissions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
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
    </div>
  );
};