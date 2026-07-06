'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  AlertCircle,
  Loader2,
  RefreshCw,
  Save,
  CheckCircle,
  Camera,
  Lock,
  User,
  Mail,
} from 'lucide-react'

interface Profile {
  name: string
  email: string
  avatar: string | null
}

interface PasswordForm {
  current: string
  newPassword: string
  confirm: string
}

type PageState = 'loading' | 'ready' | 'saved' | 'error'

export default function ProfilePage() {
  const [pageState, setPageState] = useState<PageState>('loading')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [profile, setProfile] = useState<Profile>({ name: '', email: '', avatar: null })
  const [password, setPassword] = useState<PasswordForm>({ current: '', newPassword: '', confirm: '' })

  useEffect(() => {
    const timer = setTimeout(() => {
      setProfile({ name: 'Maria Chen', email: 'maria@perfume.com', avatar: null })
      setPageState('ready')
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const handleSaveProfile = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setPageState('saved')
      setTimeout(() => setPageState('ready'), 2000)
    }, 1000)
  }

  const handleSavePassword = () => {
    if (!password.current || !password.newPassword || password.newPassword !== password.confirm) return
    setSavingPassword(true)
    setTimeout(() => {
      setSavingPassword(false)
      setPassword({ current: '', newPassword: '', confirm: '' })
      setPageState('saved')
      setTimeout(() => setPageState('ready'), 2000)
    }, 1000)
  }

  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-sm text-muted-foreground">Manage your account details</p>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Loading Profile</CardTitle>
              <CardDescription>Fetching your profile...</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (pageState === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">Profile</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <p className="text-red-600 mb-2 font-semibold">Failed to Load Profile</p>
              <p className="text-muted-foreground mb-6">{error || 'Server error.'}</p>
              <Button onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-sm text-muted-foreground">Manage your account details</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-2xl">
        {pageState === 'saved' && (
          <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Changes saved successfully
          </div>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500 relative">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="" className="h-full w-full rounded-full object-cover" />
                ) : (
                  profile.name.split(' ').map(n => n[0]).join('')
                )}
                <button className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  <Camera className="h-3 w-3" />
                </button>
              </div>
              <div>
                <p className="font-medium">{profile.name}</p>
                <p className="text-xs text-muted-foreground">Click the camera icon to change</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="profile-name">Full Name</Label>
                <Input
                  id="profile-name"
                  value={profile.name}
                  onChange={e => setProfile(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-email">Email</Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={profile.email}
                  onChange={e => setProfile(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveProfile} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={password.current}
                onChange={e => setPassword(prev => ({ ...prev, current: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={password.newPassword}
                  onChange={e => setPassword(prev => ({ ...prev, newPassword: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={password.confirm}
                  onChange={e => setPassword(prev => ({ ...prev, confirm: e.target.value }))}
                  className={cn(password.confirm && password.newPassword !== password.confirm && 'border-red-500')}
                />
                {password.confirm && password.newPassword !== password.confirm && (
                  <p className="text-xs text-red-500">Passwords do not match</p>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSavePassword} disabled={savingPassword || !password.current || !password.newPassword || password.newPassword !== password.confirm}>
                {savingPassword ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Lock className="h-4 w-4 mr-2" />}
                {savingPassword ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
