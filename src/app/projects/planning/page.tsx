'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckCircle, Send } from 'lucide-react'
import { cn } from '@/lib/utils'

const ACCORDS = ['Amber Floral', 'Citrus', 'Woody', 'Gourmand', 'Aquatic', 'Green', 'Spicy', 'Oriental']

interface FormData {
  name: string
  brief: string
  accord: string
  budget: string
  target_launch: string
  team_lead: string
}

interface FormErrors {
  name?: string
  brief?: string
  accord?: string
  budget?: string
  target_launch?: string
  team_lead?: string
}

export default function PlanningPage() {
  const [form, setForm] = useState<FormData>({
    name: '',
    brief: '',
    accord: '',
    budget: '',
    target_launch: '',
    team_lead: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const validate = (): boolean => {
    const e: FormErrors = {}
    if (!form.name.trim()) e.name = 'Project name is required'
    if (!form.brief.trim()) e.brief = 'Brief is required'
    if (!form.accord) e.accord = 'Accord is required'
    if (!form.budget.trim()) e.budget = 'Budget is required'
    else if (isNaN(Number(form.budget))) e.budget = 'Budget must be a number'
    if (!form.target_launch) e.target_launch = 'Target launch date is required'
    if (!form.team_lead.trim()) e.team_lead = 'Team lead is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    setSaving(false)
    setSaved(true)
  }

  const handleChange = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  if (saved) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
            <h2 className="text-2xl font-bold mb-2">Project Created</h2>
            <p className="text-muted-foreground mb-6">{form.name} has been submitted for review.</p>
            <Button onClick={() => { setSaved(false); setForm({ name: '', brief: '', accord: '', budget: '', target_launch: '', team_lead: '' }) }}>
              Create Another
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Project Planning</h1>
          <p className="text-sm text-muted-foreground">Create a new fragrance project</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>New Project Details</CardTitle>
            <CardDescription>Fill in all required fields to create a new project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                placeholder="e.g. Amber Floral EDP"
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
                className={cn(errors.name && 'border-destructive')}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brief">Brief *</Label>
              <textarea
                id="brief"
                className={cn(
                  'flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                  errors.brief && 'border-destructive'
                )}
                placeholder="Describe the project brief, target market, and key requirements..."
                value={form.brief}
                onChange={e => handleChange('brief', e.target.value)}
              />
              {errors.brief && <p className="text-sm text-destructive">{errors.brief}</p>}
            </div>

            <div className="space-y-2">
              <Label>Accord *</Label>
              <Select value={form.accord} onValueChange={v => handleChange('accord', v)}>
                <SelectTrigger className={cn(errors.accord && 'border-destructive')}>
                  <SelectValue placeholder="Select an accord" />
                </SelectTrigger>
                <SelectContent>
                  {ACCORDS.map(a => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.accord && <p className="text-sm text-destructive">{errors.accord}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget ($) *</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="e.g. 50000"
                  value={form.budget}
                  onChange={e => handleChange('budget', e.target.value)}
                  className={cn(errors.budget && 'border-destructive')}
                />
                {errors.budget && <p className="text-sm text-destructive">{errors.budget}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="target_launch">Target Launch *</Label>
                <Input
                  id="target_launch"
                  type="date"
                  value={form.target_launch}
                  onChange={e => handleChange('target_launch', e.target.value)}
                  className={cn(errors.target_launch && 'border-destructive')}
                />
                {errors.target_launch && <p className="text-sm text-destructive">{errors.target_launch}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="team_lead">Team Lead *</Label>
              <Input
                id="team_lead"
                placeholder="e.g. Sophie Laurent"
                value={form.team_lead}
                onChange={e => handleChange('team_lead', e.target.value)}
                className={cn(errors.team_lead && 'border-destructive')}
              />
              {errors.team_lead && <p className="text-sm text-destructive">{errors.team_lead}</p>}
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleSubmit}
              disabled={saving}
            >
              <Send className="h-4 w-4 mr-2" />
              {saving ? 'Submitting...' : 'Create Project'}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
