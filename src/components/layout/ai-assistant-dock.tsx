'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Brain, Sparkles, X, MessageSquare, Send, 
  ChevronUp, Maximize2, Minimize2, Zap,
} from 'lucide-react'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const quickActions = [
  { label: 'Explain formula', icon: MessageSquare },
  { label: 'Find alternatives', icon: Sparkles },
  { label: 'Optimize cost', icon: Zap },
]

export function AIAssistantDock() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm your AI fragrance assistant. I can help with formulations, compliance checks, ingredient suggestions, and more.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsStreaming(true)

    setTimeout(() => {
      const responses: Record<string, string> = {
        'hello': 'Hi! How can I help with your fragrance formulation today?',
        'formula': 'I can analyze your current formula, suggest improvements, check IFRA compliance, or generate new formulations from a brief.',
        'cost': 'To optimize cost, I recommend replacing high-cost naturals with quality synthetics. For example, Rose Absolute at $4.50/g could be partially replaced with a Phenylethyl Alcohol blend.',
        'default': "I understand your request. Let me analyze the data and get back to you with specific recommendations for your formulation.",
      }
      const reply = Object.entries(responses).find(([key]) => 
        input.toLowerCase().includes(key)
      )?.[1] || responses.default

      const assistantMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMsg])
      setIsStreaming(false)
    }, 1000)
  }

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center z-50 hover:bg-primary/90 transition-colors"
        >
          <Brain className="h-5 w-5" />
        </motion.button>
      )}

      {/* Dock panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={cn(
              'fixed bottom-6 right-6 z-50 flex flex-col rounded-xl border bg-background shadow-2xl overflow-hidden',
              isExpanded ? 'w-[480px] h-[600px]' : 'w-[380px] h-[500px]'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2.5 border-b bg-primary/5">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <Brain className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">AI Assistant</p>
                  <p className="text-[10px] text-muted-foreground">Olfactory Intelligence</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setIsExpanded(!isExpanded)}>
                  {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setIsOpen(false)}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-3">
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'flex gap-2',
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {msg.role === 'assistant' && (
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <Brain className="h-3.5 w-3.5 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'max-w-[80%] rounded-lg px-3 py-2 text-sm',
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    {msg.content}
                    <p className="text-[10px] opacity-70 mt-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {msg.role === 'user' && (
                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1">
                      <span className="text-[10px] font-bold text-primary-foreground">U</span>
                    </div>
                  )}
                </motion.div>
              ))}
              {isStreaming && (
                <div className="flex gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Brain className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="bg-muted rounded-lg px-3 py-2">
                    <motion.div className="flex gap-1">
                      <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0 }} className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.3 }} className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.6 }} className="h-1.5 w-1.5 rounded-full bg-primary" />
                    </motion.div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick actions */}
            <div className="px-3 py-1.5 border-t flex gap-1">
              {quickActions.map(action => (
                <button
                  key={action.label}
                  onClick={() => setInput(action.label)}
                  className="flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] text-muted-foreground hover:bg-muted transition-colors"
                >
                  <action.icon className="h-3 w-3" />
                  {action.label}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 p-3 border-t">
              <Input
                className="h-9 text-sm"
                placeholder="Ask anything about your formula..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button size="sm" className="h-9 w-9 p-0" onClick={handleSend} disabled={!input.trim() || isStreaming}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
