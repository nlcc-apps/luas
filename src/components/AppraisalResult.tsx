import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

export interface StaffAppraisalResult {
  overallScore: number;
  overallGrade: string;
  kpiAverage: number;
  goalCompletionRate: number;
  performanceLevel: "Outstanding" | "Exceeds Expectations" | "Meets Expectations" | "Below Expectations" | "Unsatisfactory";
  recommendations: string[];
}

interface StaffAppraisalResultProps {
  result: StaffAppraisalResult;
  employeeName: string;
  position: string;
  reviewPeriod: string;
}

export const StaffAppraisalResultComponent = ({ result, employeeName, position, reviewPeriod }: StaffAppraisalResultProps) => {
  const getPerformanceColor = (level: string) => {
    switch (level) {
      case "Outstanding":
        return "bg-green-100 text-green-800 border-green-200";
      case "Exceeds Expectations":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Meets Expectations":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Below Expectations":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Unsatisfactory":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    if (score >= 60) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Performance Appraisal Report
        </CardTitle>
        <div className="text-center space-y-1">
          <p className="text-lg font-medium">{employeeName}</p>
          <p className="text-muted-foreground">{position} • {reviewPeriod}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="text-center">
          <div className={`text-6xl font-bold mb-2 ${getScoreColor(result.overallScore)}`}>
            {result.overallScore}%
          </div>
          <div className="text-2xl font-semibold mb-2">Grade: {result.overallGrade}</div>
          <Badge className={getPerformanceColor(result.performanceLevel)}>
            {result.performanceLevel}
          </Badge>
        </div>

        <Separator />

        {/* Performance Metrics */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Performance Breakdown</h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">KPI Average</span>
                <span className="text-sm font-semibold">{result.kpiAverage.toFixed(1)}/5.0</span>
              </div>
              <Progress value={(result.kpiAverage / 5) * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Goal Completion</span>
                <span className="text-sm font-semibold">{result.goalCompletionRate.toFixed(0)}%</span>
              </div>
              <Progress value={result.goalCompletionRate} className="h-2" />
            </div>
          </div>
        </div>

        <Separator />

        {/* Recommendations */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recommendations & Next Steps</h3>
          <div className="space-y-2">
            {result.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center font-semibold">
                  {index + 1}
                </span>
                <p className="text-sm">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Scale Reference */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">Performance Scale Reference</h4>
          <div className="text-xs text-blue-700 space-y-1">
            <p><strong>90-100%:</strong> Outstanding - Consistently exceeds all expectations</p>
            <p><strong>80-89%:</strong> Exceeds Expectations - Regularly surpasses requirements</p>
            <p><strong>70-79%:</strong> Meets Expectations - Satisfactory performance</p>
            <p><strong>60-69%:</strong> Below Expectations - Improvement needed</p>
            <p><strong>Below 60%:</strong> Unsatisfactory - Significant improvement required</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};