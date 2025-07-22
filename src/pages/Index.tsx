import { useState } from "react";
import { AppraisalForm, AppraisalData } from "@/components/AppraisalForm";
import { AppraisalResultComponent, AppraisalResult } from "@/components/AppraisalResult";
import { calculateAppraisal } from "@/lib/appraisalCalculator";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [appraisalResult, setAppraisalResult] = useState<AppraisalResult | null>(null);
  const [currentItem, setCurrentItem] = useState<string>("");

  const handleAppraisalSubmit = (data: AppraisalData) => {
    const result = calculateAppraisal(data);
    setAppraisalResult(result);
    setCurrentItem(data.itemName);
  };

  const resetAppraisal = () => {
    setAppraisalResult(null);
    setCurrentItem("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Universal Appraisal Tool
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get instant valuations for any item across all organizations. Simple, fast, and reliable.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {!appraisalResult ? (
            <AppraisalForm onSubmit={handleAppraisalSubmit} />
          ) : (
            <div className="space-y-6">
              <AppraisalResultComponent 
                result={appraisalResult} 
                itemName={currentItem}
              />
              <div className="text-center">
                <Button onClick={resetAppraisal} variant="outline">
                  Appraise Another Item
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-sm text-muted-foreground">
          <p>Lightweight • Fast • Scalable across all organizations</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
