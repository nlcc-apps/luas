import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AppraisalSubmission } from "@/lib/userData";
import { useToast } from "@/hooks/use-toast";

interface CEOKPIEvaluationFormProps {
  submission: AppraisalSubmission;
  onSave: (evaluationData: any) => void;
  onCancel: () => void;
}

export const CEOKPIEvaluationForm = ({ submission, onSave, onCancel }: CEOKPIEvaluationFormProps) => {
  const [kpiRatings, setKpiRatings] = useState({
    strategicLeadership: submission.ceoEvaluation?.strategicLeadership || 3,
    teamManagement: submission.ceoEvaluation?.teamManagement || 3,
    financialPerformance: submission.ceoEvaluation?.financialPerformance || 3,
    operationalExcellence: submission.ceoEvaluation?.operationalExcellence || 3,
    stakeholderRelations: submission.ceoEvaluation?.stakeholderRelations || 3,
    innovationGrowth: submission.ceoEvaluation?.innovationGrowth || 3,
  });
  
  const [feedback, setFeedback] = useState(submission.ceoEvaluation?.feedback || "");
  const [strategicGoals, setStrategicGoals] = useState(submission.ceoEvaluation?.strategicGoals || "");
  const { toast } = useToast();

  const updateKPIRating = (field: string, value: number[]) => {
    setKpiRatings(prev => ({ ...prev, [field]: value[0] }));
  };

  const handleSave = () => {
    const evaluationData = {
      ...kpiRatings,
      feedback,
      strategicGoals,
      evaluatedAt: new Date().toISOString()
    };
    
    onSave(evaluationData);
    toast({
      title: "CEO Evaluation Completed",
      description: "KPI evaluation has been completed and saved.",
    });
  };

  const totalKPIScore = Object.values(kpiRatings).reduce((sum, rating) => sum + rating, 0) / 6;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>CEO KPI Evaluation for {submission.employeeName}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(kpiRatings).map(([field, value]) => {
              const fieldLabels = {
                strategicLeadership: "Strategic Leadership",
                teamManagement: "Team Management",
                financialPerformance: "Financial Performance",
                operationalExcellence: "Operational Excellence",
                stakeholderRelations: "Stakeholder Relations",
                innovationGrowth: "Innovation & Growth"
              };
              
              return (
                <div key={field} className="space-y-2">
                  <Label className="text-sm font-medium">
                    {fieldLabels[field as keyof typeof fieldLabels]}: {value}/5
                  </Label>
                  <Slider
                    value={[value]}
                    onValueChange={(newValue) => updateKPIRating(field, newValue)}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Below Standard</span>
                    <span>Exceptional</span>
                  </div>
                </div>
              );
            })}
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <Label htmlFor="feedback" className="text-sm font-medium">
                CEO Feedback & Assessment
              </Label>
              <Textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide strategic feedback on performance, leadership effectiveness, and organizational impact..."
                className="mt-1"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="strategicGoals" className="text-sm font-medium">
                Strategic Goals & Priorities
              </Label>
              <Textarea
                id="strategicGoals"
                value={strategicGoals}
                onChange={(e) => setStrategicGoals(e.target.value)}
                placeholder="Define strategic priorities and organizational objectives for the next period..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm">
              <span className="font-medium">Overall KPI Score: </span>
              <span className="text-lg font-bold text-primary">{totalKPIScore.toFixed(1)}/5.0</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Complete KPI Evaluation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};