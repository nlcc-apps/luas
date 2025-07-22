import { AppraisalData } from "@/components/AppraisalForm";
import { AppraisalResult } from "@/components/AppraisalResult";

export const calculateAppraisal = (data: AppraisalData): AppraisalResult => {
  // Base value calculation
  let baseValue = Math.max(data.originalValue, data.marketComparables);
  if (baseValue === 0) {
    baseValue = data.marketComparables || 1000; // Fallback estimate
  }

  // Age depreciation (varies by category)
  const depreciationRates = {
    electronics: 0.2, // 20% per year
    vehicles: 0.15,   // 15% per year
    furniture: 0.1,   // 10% per year
    jewelry: 0.02,    // 2% per year
    equipment: 0.12,  // 12% per year
    art: -0.05,       // Can appreciate
    other: 0.1        // 10% per year
  };

  const depreciationRate = depreciationRates[data.category as keyof typeof depreciationRates] || 0.1;
  const depreciationFactor = Math.max(0, 1 - (depreciationRate * data.age));

  // Condition adjustments
  const conditionMultipliers = {
    excellent: 1.1,   // +10%
    good: 1.0,        // No adjustment
    fair: 0.8,        // -20%
    poor: 0.6         // -40%
  };

  const conditionMultiplier = conditionMultipliers[data.condition as keyof typeof conditionMultipliers] || 1.0;
  const conditionAdjustment = conditionMultiplier - 1;

  // Market adjustment based on comparables vs original value
  let marketAdjustment = 0;
  if (data.marketComparables > 0 && data.originalValue > 0) {
    const marketRatio = data.marketComparables / data.originalValue;
    marketAdjustment = Math.min(Math.max(marketRatio - 1, -0.5), 0.5); // Cap at ±50%
  }

  // Calculate final value
  const estimatedValue = Math.round(
    baseValue * depreciationFactor * conditionMultiplier * (1 + marketAdjustment)
  );

  // Determine confidence level
  let confidence: "Low" | "Medium" | "High" = "Medium";
  
  if (data.originalValue > 0 && data.marketComparables > 0) {
    confidence = "High";
  } else if (data.originalValue > 0 || data.marketComparables > 0) {
    confidence = "Medium";
  } else {
    confidence = "Low";
  }

  return {
    estimatedValue,
    depreciationFactor: 1 - depreciationFactor,
    conditionAdjustment,
    marketAdjustment,
    confidence
  };
};