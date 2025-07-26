import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StaffAppraisalForm } from "@/components/AppraisalForm";
import { FileText } from "lucide-react";

interface SelfAppraisalSectionProps {
  onSubmit: (data: any) => void;
}

export const SelfAppraisalSection = ({ onSubmit }: SelfAppraisalSectionProps) => {
  const [showForm, setShowForm] = useState(false);

  const handleStartAppraisal = () => {
    setShowForm(true);
  };

  const handleSubmit = (data: any) => {
    onSubmit(data);
    setShowForm(false); // Close form after submission
  };

  if (showForm) {
    return <StaffAppraisalForm onSubmit={handleSubmit} />;
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
      <FileText className="h-8 w-8 text-primary" />
      <div>
        <h3 className="font-semibold">Performance Self-Assessment</h3>
        <p className="text-sm text-muted-foreground">
          Complete your self-appraisal for the current review period
        </p>
      </div>
      <Button onClick={handleStartAppraisal} className="ml-auto">
        Start Self Appraisal
      </Button>
    </div>
  );
};