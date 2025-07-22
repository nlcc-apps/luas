import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export interface AppraisalResult {
  estimatedValue: number;
  depreciationFactor: number;
  conditionAdjustment: number;
  marketAdjustment: number;
  confidence: "Low" | "Medium" | "High";
}

interface AppraisalResultProps {
  result: AppraisalResult;
  itemName: string;
}

export const AppraisalResultComponent = ({ result, itemName }: AppraisalResultProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "High":
        return "bg-green-100 text-green-800 border-green-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Appraisal Result
        </CardTitle>
        <p className="text-center text-muted-foreground">{itemName}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-primary mb-2">
            {formatCurrency(result.estimatedValue)}
          </div>
          <Badge className={getConfidenceColor(result.confidence)}>
            {result.confidence} Confidence
          </Badge>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Calculation Breakdown</h3>
          
          <div className="grid gap-3">
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="font-medium">Depreciation Factor</span>
              <span className="text-sm text-muted-foreground">
                {(result.depreciationFactor * 100).toFixed(1)}%
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="font-medium">Condition Adjustment</span>
              <span className="text-sm text-muted-foreground">
                {result.conditionAdjustment > 0 ? '+' : ''}{(result.conditionAdjustment * 100).toFixed(1)}%
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="font-medium">Market Adjustment</span>
              <span className="text-sm text-muted-foreground">
                {result.marketAdjustment > 0 ? '+' : ''}{(result.marketAdjustment * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Disclaimer:</strong> This is an estimated appraisal based on provided information. 
            For official valuations, please consult a certified appraiser.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};