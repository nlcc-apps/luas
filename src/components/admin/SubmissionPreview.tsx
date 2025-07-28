import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AppraisalSubmission, saveSubmissions, getSubmissions } from "@/lib/userData";
import { ManagerEvaluationForm } from "./ManagerEvaluationForm";
import { CEOKPIEvaluationForm } from "./CEOKPIEvaluationForm";
import { Star, User, Calendar, Building, CheckCircle, ArrowRight, Edit } from "lucide-react";

interface SubmissionPreviewProps {
  submission: AppraisalSubmission | null;
  open: boolean;
  onClose: () => void;
  onMarkCompleted?: (submissionId: string) => void;
  onReleaseToManager?: (submissionId: string) => void;
  onReleaseToCEO?: (submissionId: string) => void;
  userRole?: string;
}

export const SubmissionPreview = ({ 
  submission, 
  open, 
  onClose, 
  onMarkCompleted,
  onReleaseToManager,
  onReleaseToCEO,
  userRole 
}: SubmissionPreviewProps) => {
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);
  const [showCEOKPIForm, setShowCEOKPIForm] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);
  
  if (!submission) return null;

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

  const handleSaveEvaluation = (evaluationData: any) => {
    const submissions = getSubmissions();
    const { productivity, quality, communication, teamwork, initiative, reliability } = evaluationData;
    const managerRating = (productivity + quality + communication + teamwork + initiative + reliability) / 6;
    
    const updatedSubmissions = submissions.map(s => 
      s.id === submission.id 
        ? { 
            ...s, 
            managerEvaluation: evaluationData,
            scores: {
              ...s.scores,
              managerRating
            },
            status: "manager_completed" as const
          }
        : s
    );
    saveSubmissions(updatedSubmissions);
    setShowEvaluationForm(false);
    onClose();
  };

  const handleSaveCEOKPIEvaluation = (evaluationData: any) => {
    const submissions = getSubmissions();
    const { strategicLeadership, teamManagement, financialPerformance, operationalExcellence, stakeholderRelations, innovationGrowth } = evaluationData;
    const ceoRating = (strategicLeadership + teamManagement + financialPerformance + operationalExcellence + stakeholderRelations + innovationGrowth) / 6;
    
    const updatedSubmissions = submissions.map(s => 
      s.id === submission.id 
        ? { 
            ...s, 
            ceoEvaluation: evaluationData,
            scores: {
              ...s.scores,
              ceoRating
            },
            status: "completed" as const
          }
        : s
    );
    saveSubmissions(updatedSubmissions);
    setShowCEOKPIForm(false);
    onClose();
  };

  const renderKPISection = (title: string, scores: any) => {
    if (!scores) return null;
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex justify-between">
              <span>Productivity:</span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < (scores.productivity || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="ml-2 text-sm">{scores.productivity || 0}/5</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span>Quality:</span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < (scores.quality || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="ml-2 text-sm">{scores.quality || 0}/5</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span>Communication:</span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < (scores.communication || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="ml-2 text-sm">{scores.communication || 0}/5</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span>Teamwork:</span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < (scores.teamwork || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="ml-2 text-sm">{scores.teamwork || 0}/5</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span>Initiative:</span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < (scores.initiative || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="ml-2 text-sm">{scores.initiative || 0}/5</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span>Reliability:</span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < (scores.reliability || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="ml-2 text-sm">{scores.reliability || 0}/5</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (showEvaluationForm) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manager Evaluation</DialogTitle>
          </DialogHeader>
          <ManagerEvaluationForm
            submission={submission}
            onSave={handleSaveEvaluation}
            onCancel={() => setShowEvaluationForm(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }

  if (showCEOKPIForm) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>CEO KPI Evaluation</DialogTitle>
          </DialogHeader>
          <CEOKPIEvaluationForm
            submission={submission}
            onSave={handleSaveCEOKPIEvaluation}
            onCancel={() => setShowCEOKPIForm(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Appraisal Submission Preview
            {getStatusBadge(submission.status)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Employee Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Employee Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{submission.employeeName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Employee ID</p>
                <p className="font-medium">{submission.employeeId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">{submission.department}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Line Manager</p>
                <p className="font-medium">{submission.lineManager}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Review Period</p>
                <p className="font-medium">{submission.appraisalPeriod}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Submission Date</p>
                <p className="font-medium">{new Date(submission.submissionDate).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Self Appraisal */}
          {submission.selfAppraisal && renderKPISection("Self Assessment", submission.selfAppraisal)}

          {/* Manager Evaluation */}
          {submission.managerEvaluation && (
            <>
              <Separator />
              {renderKPISection("Manager Evaluation", submission.managerEvaluation)}
            </>
          )}

          {/* CEO Evaluation */}
          {submission.ceoEvaluation && (
            <>
              <Separator />
              {renderKPISection("CEO Evaluation", submission.ceoEvaluation)}
            </>
          )}

          {/* Overall Scores */}
          <Card>
            <CardHeader>
              <CardTitle>Overall Ratings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Self Rating:</span>
                <span className="font-medium">{submission.scores.selfRating.toFixed(1)}/5.0</span>
              </div>
              {submission.scores.managerRating && (
                <div className="flex justify-between items-center">
                  <span>Manager Rating:</span>
                  <span className="font-medium">{submission.scores.managerRating.toFixed(1)}/5.0</span>
                </div>
              )}
              {submission.scores.ceoRating && (
                <div className="flex justify-between items-center">
                  <span>CEO Rating:</span>
                  <span className="font-medium">{submission.scores.ceoRating.toFixed(1)}/5.0</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            {userRole === "manager" && submission.status === "available_for_manager" && (
              <Button 
                onClick={() => setShowEvaluationForm(true)}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Complete Evaluation
              </Button>
            )}

            {userRole === "ceo" && submission.status === "available_for_ceo" && (
              <Button 
                onClick={() => setShowCEOKPIForm(true)}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Evaluate KPIs
              </Button>
            )}
            
            {submission.status === "submitted" && onReleaseToManager && (
              <Button 
                onClick={() => {
                  setIsReleasing(true);
                  onReleaseToManager(submission.id);
                }}
                disabled={isReleasing}
                className="flex items-center gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                {isReleasing ? "Releasing..." : "Release to Manager"}
              </Button>
            )}
            
            {submission.status === "manager_completed" && onReleaseToCEO && (
              <Button 
                onClick={() => onReleaseToCEO(submission.id)}
                className="flex items-center gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                Release to CEO
              </Button>
            )}
            
            {(submission.status === "manager_completed" || submission.status === "available_for_ceo") && onMarkCompleted && (
              <Button 
                onClick={() => onMarkCompleted(submission.id)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Mark as Completed
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};