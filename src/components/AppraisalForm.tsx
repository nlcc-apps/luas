import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export interface StaffAppraisalData {
  employeeName: string;
  position: string;
  department: string;
  reviewPeriod: string;
  directSupervisor: string;
  
  // KPI Ratings (1-5 scale)
  productivity: number;
  quality: number;
  communication: number;
  teamwork: number;
  initiative: number;
  reliability: number;
  
  // Goals and Achievements
  goalsAchieved: number;
  totalGoals: number;
  
  // Additional feedback
  strengths: string;
  areasForImprovement: string;
  additionalComments: string;
}

interface StaffAppraisalFormProps {
  onSubmit: (data: StaffAppraisalData) => void;
}

export const StaffAppraisalForm = ({ onSubmit }: StaffAppraisalFormProps) => {
  const [formData, setFormData] = useState<StaffAppraisalData>({
    employeeName: "",
    position: "",
    department: "",
    reviewPeriod: "",
    directSupervisor: "",
    productivity: 3,
    quality: 3,
    communication: 3,
    teamwork: 3,
    initiative: 3,
    reliability: 3,
    goalsAchieved: 0,
    totalGoals: 0,
    strengths: "",
    areasForImprovement: "",
    additionalComments: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (field: keyof StaffAppraisalData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateRating = (field: keyof StaffAppraisalData, value: number[]) => {
    setFormData(prev => ({ ...prev, [field]: value[0] }));
  };

  const getRatingLabel = (rating: number) => {
    const labels = ["", "Poor", "Below Average", "Average", "Good", "Excellent"];
    return labels[rating] || "";
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Staff Performance Appraisal</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Employee Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Employee Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="employeeName">Employee Name *</Label>
                <Input
                  id="employeeName"
                  value={formData.employeeName}
                  onChange={(e) => updateField("employeeName", e.target.value)}
                  placeholder="Enter employee name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Position *</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => updateField("position", e.target.value)}
                  placeholder="Enter job position"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select value={formData.department} onValueChange={(value) => updateField("department", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="hr">Human Resources</SelectItem>
                    <SelectItem value="it">IT</SelectItem>
                    <SelectItem value="customer-service">Customer Service</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reviewPeriod">Review Period *</Label>
                <Select value={formData.reviewPeriod} onValueChange={(value) => updateField("reviewPeriod", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select review period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="q1">Q1 2024</SelectItem>
                    <SelectItem value="q2">Q2 2024</SelectItem>
                    <SelectItem value="q3">Q3 2024</SelectItem>
                    <SelectItem value="q4">Q4 2024</SelectItem>
                    <SelectItem value="annual">Annual 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="directSupervisor">Direct Supervisor</Label>
                <Input
                  id="directSupervisor"
                  value={formData.directSupervisor}
                  onChange={(e) => updateField("directSupervisor", e.target.value)}
                  placeholder="Enter supervisor name"
                />
              </div>
            </div>
          </div>

          {/* KPI Ratings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Key Performance Indicators</h3>
            <p className="text-sm text-muted-foreground">Rate each area from 1 (Poor) to 5 (Excellent)</p>
            
            <div className="grid gap-6 md:grid-cols-2">
              {[
                { key: 'productivity', label: 'Productivity & Output' },
                { key: 'quality', label: 'Quality of Work' },
                { key: 'communication', label: 'Communication Skills' },
                { key: 'teamwork', label: 'Teamwork & Collaboration' },
                { key: 'initiative', label: 'Initiative & Innovation' },
                { key: 'reliability', label: 'Reliability & Attendance' }
              ].map(({ key, label }) => (
                <div key={key} className="space-y-3">
                  <div className="flex justify-between">
                    <Label>{label}</Label>
                    <span className="text-sm font-medium">
                      {formData[key as keyof StaffAppraisalData]} - {getRatingLabel(formData[key as keyof StaffAppraisalData] as number)}
                    </span>
                  </div>
                  <Slider
                    value={[formData[key as keyof StaffAppraisalData] as number]}
                    onValueChange={(value) => updateRating(key as keyof StaffAppraisalData, value)}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Goals Achievement */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Goals Achievement</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="goalsAchieved">Goals Achieved</Label>
                <Input
                  id="goalsAchieved"
                  type="number"
                  value={formData.goalsAchieved}
                  onChange={(e) => updateField("goalsAchieved", Number(e.target.value))}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalGoals">Total Goals Set</Label>
                <Input
                  id="totalGoals"
                  type="number"
                  value={formData.totalGoals}
                  onChange={(e) => updateField("totalGoals", Number(e.target.value))}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Feedback</h3>
            
            <div className="space-y-2">
              <Label htmlFor="strengths">Key Strengths</Label>
              <Textarea
                id="strengths"
                value={formData.strengths}
                onChange={(e) => updateField("strengths", e.target.value)}
                placeholder="Highlight the employee's main strengths..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="areasForImprovement">Areas for Improvement</Label>
              <Textarea
                id="areasForImprovement"
                value={formData.areasForImprovement}
                onChange={(e) => updateField("areasForImprovement", e.target.value)}
                placeholder="Identify areas where the employee can improve..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalComments">Additional Comments</Label>
              <Textarea
                id="additionalComments"
                value={formData.additionalComments}
                onChange={(e) => updateField("additionalComments", e.target.value)}
                placeholder="Any other feedback or comments..."
                rows={3}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={!formData.employeeName || !formData.position || !formData.department || !formData.reviewPeriod}
          >
            Generate Performance Report
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};