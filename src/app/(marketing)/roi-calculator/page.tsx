'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import {
  TrendingUp, DollarSign, Clock, BarChart3, Download, ArrowRight,
  Calculator, CheckCircle,
} from 'lucide-react'

const INDUSTRY_AVERAGES = {
  formulations_per_month: 45,
  perfumers: 8,
  avg_formulation_cost: 8500,
  cycle_time_weeks: 12,
}

interface ROIResults {
  timePerFormula: number
  weeklyCapacity: number
  monthlyFormulations: number
  timeSavedHours: number
  costPerFormulaAfter: number
  monthlySavings: number
  annualSavings: number
  roiPercentage: number
  breakEvenWeeks: number
}

function calculateROI(
  formulations: number,
  perfumers: number,
  costPerFormula: number,
  cycleWeeks: number,
): ROIResults {
  const efficiencyGain = 0.65
  const costReduction = 0.45
  const speedIncrease = 0.70

  const hoursPerFormula = cycleWeeks * 40 / Math.max(formulations, 1)
  const hoursSavedPerFormula = hoursPerFormula * efficiencyGain
  const timeSavedHours = formulations * hoursSavedPerFormula
  const costPerFormulaAfter = costPerFormula * (1 - costReduction)
  const monthlySavings = formulations * (costPerFormula - costPerFormulaAfter)
  const annualSavings = monthlySavings * 12
  const yearlySubscription = formulations <= 20 ? 99900 : formulations <= 100 ? 499900 : 2499000
  const annualCost = yearlySubscription * 12 / 100
  const roiPercentage = annualCost > 0 ? ((annualSavings - annualCost) / annualCost) * 100 : 0

  return {
    timePerFormula: Math.round(hoursPerFormula),
    weeklyCapacity: Math.round(perfumers * 40 / (hoursPerFormula * (1 - efficiencyGain))),
    monthlyFormulations: Math.round(perfumers * 160 / (hoursPerFormula * (1 - efficiencyGain))),
    timeSavedHours: Math.round(timeSavedHours),
    costPerFormulaAfter: Math.round(costPerFormulaAfter),
    monthlySavings: Math.round(monthlySavings),
    annualSavings: Math.round(annualSavings),
    roiPercentage: Math.round(roiPercentage),
    breakEvenWeeks: Math.round(annualCost / (monthlySavings / 4.33)),
  }
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

export default function ROICalculatorPage() {
  const [formulations, setFormulations] = useState(50)
  const [perfumers, setPerfumers] = useState(5)
  const [costPerFormula, setCostPerFormula] = useState(8500)
  const [cycleWeeks, setCycleWeeks] = useState(12)
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [leadForm, setLeadForm] = useState({ name: '', email: '', company: '' })
  const [submitted, setSubmitted] = useState(false)

  const results = useMemo(
    () => calculateROI(formulations, perfumers, costPerFormula, cycleWeeks),
    [formulations, perfumers, costPerFormula, cycleWeeks]
  )

  const handleSlider = (
    setter: (v: number) => void,
    value: number,
    min: number,
    max: number
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(Number(e.target.value))
  }

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (leadForm.name && leadForm.email) {
      setSubmitted(true)
    }
  }

  return (
    <div>
      <section className="py-16 md:py-24 border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-muted/50 text-xs font-medium text-muted-foreground mb-6">
            <Calculator className="h-4 w-4" />
            ROI Calculator
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Calculate your ROI with VITO
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            See how much your fragrance R&amp;D team can save with AI-powered formulation.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Your Inputs</CardTitle>
                  <CardDescription>Adjust the sliders to match your team&apos;s profile.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Formulations per month</Label>
                      <span className="text-sm font-bold tabular-nums">{formatNumber(formulations)}</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={500}
                      step={5}
                      value={formulations}
                      onChange={handleSlider(setFormulations, formulations, 10, 500)}
                      className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>10</span>
                      <span>500</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Number of perfumers</Label>
                      <span className="text-sm font-bold tabular-nums">{perfumers}</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={50}
                      step={1}
                      value={perfumers}
                      onChange={handleSlider(setPerfumers, perfumers, 1, 50)}
                      className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1</span>
                      <span>50</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Avg cost per formulation</Label>
                      <span className="text-sm font-bold tabular-nums">{formatCurrency(costPerFormula)}</span>
                    </div>
                    <input
                      type="range"
                      min={500}
                      max={50000}
                      step={100}
                      value={costPerFormula}
                      onChange={handleSlider(setCostPerFormula, costPerFormula, 500, 50000)}
                      className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>$500</span>
                      <span>$50,000</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Current R&amp;D cycle time</Label>
                      <span className="text-sm font-bold tabular-nums">{cycleWeeks} weeks</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={52}
                      step={1}
                      value={cycleWeeks}
                      onChange={handleSlider(setCycleWeeks, cycleWeeks, 1, 52)}
                      className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1 week</span>
                      <span>52 weeks</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/30 border-dashed">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <BarChart3 className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Industry benchmark</h4>
                      <p className="text-xs text-muted-foreground">
                        Similar-sized teams average {formatNumber(INDUSTRY_AVERAGES.formulations_per_month)} formulations/month
                        with a {INDUSTRY_AVERAGES.cycle_time_weeks}-week cycle time at {formatCurrency(INDUSTRY_AVERAGES.avg_formulation_cost)} per formulation.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium text-muted-foreground">Time Saved / Month</span>
                    </div>
                    <div className="text-2xl font-bold text-primary">{formatNumber(results.timeSavedHours)}h</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.round(results.timeSavedHours / (perfumers * 160) * 100)}% of team capacity
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-emerald-50 border-emerald-200">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-emerald-600" />
                      <span className="text-xs font-medium text-muted-foreground">Monthly Savings</span>
                    </div>
                    <div className="text-2xl font-bold text-emerald-600">{formatCurrency(results.monthlySavings)}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatCurrency(results.costPerFormulaAfter)} avg cost after
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-medium text-muted-foreground">Annual Savings</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{formatCurrency(results.annualSavings)}</div>
                    <p className="text-xs text-muted-foreground mt-1">Projected yearly</p>
                  </CardContent>
                </Card>

                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-4 w-4 text-purple-600" />
                      <span className="text-xs font-medium text-muted-foreground">ROI</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">{results.roiPercentage}%</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Break-even: {results.breakEvenWeeks} weeks
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Efficiency Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Time per formula</span>
                        <span className="font-medium">{results.timePerFormula}h &rarr; {Math.round(results.timePerFormula * 0.35)}h</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: '35%' }} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Cost per formula</span>
                        <span className="font-medium">{formatCurrency(costPerFormula)} &rarr; {formatCurrency(results.costPerFormulaAfter)}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '55%' }} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Monthly output potential</span>
                        <span className="font-medium">{formatNumber(formulations)} &rarr; {formatNumber(results.monthlyFormulations)}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '70%' }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {!showLeadForm ? (
                <Button size="lg" className="w-full" onClick={() => setShowLeadForm(true)}>
                  Get Your Personalized Report
                  <Download className="ml-2 h-5 w-5" />
                </Button>
              ) : submitted ? (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-6 flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800">Report requested!</p>
                      <p className="text-sm text-green-600">Check your email for your personalized ROI report.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6">
                    <form onSubmit={handleLeadSubmit} className="space-y-4">
                      <h4 className="font-semibold">Get your personalized report</h4>
                      <div>
                        <Label htmlFor="roi-name">Full Name</Label>
                        <Input
                          id="roi-name"
                          value={leadForm.name}
                          onChange={(e) => setLeadForm((f) => ({ ...f, name: e.target.value }))}
                          required
                          placeholder="John Smith"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="roi-email">Work Email</Label>
                        <Input
                          id="roi-email"
                          type="email"
                          value={leadForm.email}
                          onChange={(e) => setLeadForm((f) => ({ ...f, email: e.target.value }))}
                          required
                          placeholder="john@company.com"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="roi-company">Company</Label>
                        <Input
                          id="roi-company"
                          value={leadForm.company}
                          onChange={(e) => setLeadForm((f) => ({ ...f, company: e.target.value }))}
                          required
                          placeholder="Fragrance Inc."
                          className="mt-1"
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Send My Report
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
