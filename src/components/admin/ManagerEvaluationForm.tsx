import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AppraisalSubmission } from "@/lib/userData";
import { useToast } from "@/hooks/use-toast";

interface ManagerEvaluationFormProps {
  submission: AppraisalSubmission;
  onSave: (evaluationData: any) => void;
  onCancel: () => void;
}

export const ManagerEvaluationForm = ({ submission, onSave, onCancel }: ManagerEvaluationFormProps) => {
  const [ratings, setRatings] = useState({
    productivity: submission.managerEvaluation?.productivity || 3,
    quality: submission.managerEvaluation?.quality || 3,
    communication: submission.managerEvaluation?.communication || 3,
    teamwork: submission.managerEvaluation?.teamwork || 3,
    initiative: submission.managerEvaluation?.initiative || 3,
    reliability: submission.managerEvaluation?.reliability || 3,
  });
  
  const [feedback, setFeedback] = useState(submission.managerEvaluation?.feedback || "");
  const [goals, setGoals] = useState(submission.managerEvaluation?.goals || "");
  const { toast } = useToast();

  const updateRating = (field: string, value: number[]) => {
    setRatings(prev => ({ ...prev, [field]: value[0] }));
  };

  const handleSave = () => {
    const evaluationData = {
      ...ratings,
      feedback,
      goals,
      evaluatedAt: new Date().toISOString()
    };
    
    onSave(evaluationData);
    toast({
      title: "Evaluation Saved",
      description: "Manager evaluation has been completed and saved.",
    });
  };

  const totalScore = Object.values(ratings).reduce((sum, rating) => sum + rating, 0) / 6;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manager Evaluation for {submission.employeeName}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(ratings).map(([field, value]) => (
              <div key={field} className="space-y-2">
                <Label className="capitalize text-sm font-medium">
                  {field}: {value}/5
                </Label>
                <Slider
                  value={[value]}
                  onValueChange={(newValue) => updateRating(field, newValue)}
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <Label htmlFor="feedback" className="text-sm font-medium">
                Manager Feedback
              </Label>
              <Textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide detailed feedback on performance, strengths, and areas for improvement..."
                className="mt-1"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="goals" className="text-sm font-medium">
                Goals for Next Period
              </Label>
              <Textarea
                id="goals"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="Set specific goals and objectives for the next review period..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm">
              <span className="font-medium">Overall Rating: </span>
              <span className="text-lg font-bold text-primary">{totalScore.toFixed(1)}/5.0</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Evaluation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};