import { useState } from "react";
import { StaffAppraisalForm, StaffAppraisalData } from "@/components/AppraisalForm";
import { StaffAppraisalResultComponent, StaffAppraisalResult } from "@/components/AppraisalResult";
import { calculateStaffAppraisal } from "@/lib/appraisalCalculator";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [appraisalResult, setAppraisalResult] = useState<StaffAppraisalResult | null>(null);
  const [currentEmployee, setCurrentEmployee] = useState<{
    name: string;
    position: string;
    reviewPeriod: string;
  } | null>(null);

  const handleAppraisalSubmit = (data: StaffAppraisalData) => {
    const result = calculateStaffAppraisal(data);
    setAppraisalResult(result);
    setCurrentEmployee({
      name: data.employeeName,
      position: data.position,
      reviewPeriod: data.reviewPeriod
    });
  };

  const resetAppraisal = () => {
    setAppraisalResult(null);
    setCurrentEmployee(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <Logo size="md" />
            <div className="flex gap-2">
              <Button 
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2"
              >
                Login / Dashboard
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/admin")}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Admin Panel
              </Button>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Staff Performance Appraisal System
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive KPI-based performance evaluation tool for all organizations. Simple, fair, and scalable.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto">
          {!appraisalResult ? (
            <StaffAppraisalForm onSubmit={handleAppraisalSubmit} />
          ) : (
            <div className="space-y-6">
              <StaffAppraisalResultComponent 
                result={appraisalResult} 
                employeeName={currentEmployee?.name || ""}
                position={currentEmployee?.position || ""}
                reviewPeriod={currentEmployee?.reviewPeriod || ""}
              />
              <div className="text-center">
                <Button onClick={resetAppraisal} variant="outline">
                  Appraise Another Employee
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-sm text-muted-foreground">
          <p>Lightweight • Fair • Scalable across all organizations</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
