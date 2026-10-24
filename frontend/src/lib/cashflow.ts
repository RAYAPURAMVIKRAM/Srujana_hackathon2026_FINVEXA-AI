// src/lib/cashflow.ts
// Generates 90-day daily cash balance simulation data

export interface DayPoint {
  day: number
  naive: number
  stressed: number
  locked: number
}

export function generateCashflow(params: {
  balance: number
  monthlyIncome: number
  lockedReserves: number
  decisionCost: number
  paymentDelayDays: number
  upfrontPercent: number
  hiddenCostBuffer: number
  splitBatches: number
  hiddenLeaks: number
  personaType: 'salaried' | 'freelancer' | 'business'
}): DayPoint[] {
  const {
    balance,
    monthlyIncome,
    lockedReserves,
    decisionCost,
    paymentDelayDays,
    upfrontPercent,
    hiddenCostBuffer,
    splitBatches,
    hiddenLeaks,
    personaType,
  } = params

  const dailyIncome = monthlyIncome / 30
  const upfront = decisionCost * (upfrontPercent / 100)
  const remaining = decisionCost - upfront
  const hiddenFees = decisionCost * (hiddenCostBuffer / 100)
  const batchSize = remaining / splitBatches
  const dailyLeak = hiddenLeaks / 30

  const points: DayPoint[] = []

  let naiveBalance = balance - upfront
  let stressBalance = balance - upfront - hiddenFees

  for (let day = 1; day <= 90; day++) {
    // Naive: income comes in regularly
    naiveBalance += dailyIncome

    // Stressed: delayed income + hidden leaks
    if (personaType === 'salaried') {
      naiveBalance -= dailyLeak * 0.5
      stressBalance += dailyIncome
      stressBalance -= dailyLeak
      if (day === 30 || day === 60) stressBalance -= 2000 // surprise expenses
    } else if (personaType === 'freelancer') {
      // Income comes as a lump sum after delay
      if (day === 30) naiveBalance += 60000
      if (day === 30 + paymentDelayDays && day <= 90) stressBalance += 60000
      stressBalance -= dailyLeak
    } else {
      // Business: revenue after order cycle
      if (day === 45) naiveBalance += decisionCost * 1.4
      if (day === 45 + paymentDelayDays && day <= 90) stressBalance += decisionCost * 1.2
      stressBalance -= dailyLeak
    }

    // Batch payments
    for (let b = 1; b <= splitBatches; b++) {
      const payDay = Math.round((90 / (splitBatches + 1)) * b)
      if (day === payDay) {
        naiveBalance -= batchSize
        stressBalance -= batchSize
      }
    }

    points.push({
      day,
      naive: Math.round(naiveBalance),
      stressed: Math.round(stressBalance),
      locked: lockedReserves,
    })
  }

  return points
}

export function computeRiskMetrics(points: DayPoint[], lockedReserves: number) {
  const stressMin = Math.min(...points.map(p => p.stressed))
  const shortage = Math.max(0, lockedReserves - stressMin)
  const valleyDays = points.filter(p => p.stressed < lockedReserves).length
  return { stressMin, shortage, valleyDays }
}
