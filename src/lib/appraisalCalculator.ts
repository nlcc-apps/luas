import { StaffAppraisalData } from "@/components/AppraisalForm";
import { StaffAppraisalResult } from "@/components/AppraisalResult";

export const calculateStaffAppraisal = (data: StaffAppraisalData): StaffAppraisalResult => {
  // Calculate KPI average (out of 5)
  const kpiScores = [
    data.productivity,
    data.quality,
    data.communication,
    data.teamwork,
    data.initiative,
    data.reliability
  ];
  
  const kpiAverage = kpiScores.reduce((sum, score) => sum + score, 0) / kpiScores.length;
  
  // Calculate goal completion rate
  const goalCompletionRate = data.totalGoals > 0 
    ? (data.goalsAchieved / data.totalGoals) * 100 
    : 0;
  
  // Calculate overall score (70% KPI, 30% Goals)
  const kpiPercentage = (kpiAverage / 5) * 100;
  const overallScore = Math.round((kpiPercentage * 0.7) + (goalCompletionRate * 0.3));
  
  // Determine grade
  let overallGrade: string;
  if (overallScore >= 95) overallGrade = "A+";
  else if (overallScore >= 90) overallGrade = "A";
  else if (overallScore >= 85) overallGrade = "B+";
  else if (overallScore >= 80) overallGrade = "B";
  else if (overallScore >= 75) overallGrade = "C+";
  else if (overallScore >= 70) overallGrade = "C";
  else if (overallScore >= 65) overallGrade = "D+";
  else if (overallScore >= 60) overallGrade = "D";
  else overallGrade = "F";
  
  // Determine performance level
  let performanceLevel: StaffAppraisalResult["performanceLevel"];
  if (overallScore >= 90) performanceLevel = "Outstanding";
  else if (overallScore >= 80) performanceLevel = "Exceeds Expectations";
  else if (overallScore >= 70) performanceLevel = "Meets Expectations";
  else if (overallScore >= 60) performanceLevel = "Below Expectations";
  else performanceLevel = "Unsatisfactory";
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  // KPI-based recommendations
  if (data.productivity < 3) {
    recommendations.push("Focus on improving productivity through better time management and goal setting.");
  }
  if (data.quality < 3) {
    recommendations.push("Work on attention to detail and quality assurance processes.");
  }
  if (data.communication < 3) {
    recommendations.push("Enhance communication skills through training or practice opportunities.");
  }
  if (data.teamwork < 3) {
    recommendations.push("Participate more actively in team activities and collaborative projects.");
  }
  if (data.initiative < 3) {
    recommendations.push("Take more initiative by proposing new ideas and solutions.");
  }
  if (data.reliability < 3) {
    recommendations.push("Improve reliability by maintaining consistent attendance and meeting deadlines.");
  }
  
  // Goal-based recommendations
  if (goalCompletionRate < 70) {
    recommendations.push("Work with supervisor to set more achievable goals and create action plans.");
  }
  
  // Overall performance recommendations
  if (overallScore >= 90) {
    recommendations.push("Continue excellent performance and consider mentoring others.");
    recommendations.push("Explore opportunities for additional responsibilities or leadership roles.");
  } else if (overallScore >= 80) {
    recommendations.push("Maintain strong performance and identify areas for further growth.");
  } else if (overallScore < 70) {
    recommendations.push("Schedule regular check-ins with supervisor to track improvement progress.");
    recommendations.push("Consider additional training or support resources.");
  }
  
  // Ensure at least one recommendation
  if (recommendations.length === 0) {
    recommendations.push("Continue current performance level and seek opportunities for professional development.");
  }
  
  return {
    overallScore,
    overallGrade,
    kpiAverage,
    goalCompletionRate,
    performanceLevel,
    recommendations
  };
};