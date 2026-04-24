import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User, 
  Sparkles,
  ArrowRight,
  RotateCcw
} from 'lucide-react'
import ToolMatchingEngine from '@/lib/ToolMatchingEngine'

interface Message {
  id: number
  sender: 'user' | 'assistant'
  content: string
  type: 'text' | 'question' | 'tools'
  data?: any
  timestamp: Date
}

interface QuestionFlow {
  type: 'multiple-choice' | 'text-input'
  question: string
  options?: { id: string; text: string; next?: string; intent?: string }[]
  placeholder?: string
}

interface SmartToolAssistantProps {
  tools: any[]
}

const questionFlows: Record<string, QuestionFlow> = {
  initial: {
    type: 'multiple-choice',
    question: "Hi! I'm your AI tool assistant. What brings you here today?",
    options: [
      { id: 'starting-business', text: 'Starting a new business', next: 'business-stage' },
      { id: 'marketing-help', text: 'Need marketing help', next: 'marketing-type' },
      { id: 'content-creation', text: 'Creating content', next: 'content-type' },
      { id: 'business-operations', text: 'Managing business operations', next: 'operations-type' },
      { id: 'specific-tool', text: 'Looking for specific functionality', next: 'describe-need' }
    ]
  },
  'business-stage': {
    type: 'multiple-choice',
    question: "What stage is your business in?",
    options: [
      { id: 'idea-stage', text: 'Just an idea - need to start', intent: 'launch-business' },
      { id: 'launching', text: 'Ready to launch', intent: 'launch-business' },
      { id: 'early-growth', text: 'Early growth phase', intent: 'grow-business' },
      { id: 'scaling', text: 'Scaling up', intent: 'scale-business' }
    ]
  },
  'marketing-type': {
    type: 'multiple-choice',
    question: "What type of marketing help do you need?",
    options: [
      { id: 'social-media', text: 'Social media marketing', intent: 'social-media-help' },
      { id: 'email-marketing', text: 'Email marketing', intent: 'email-marketing-help' },
      { id: 'content-marketing', text: 'Content marketing', intent: 'content-marketing-help' },
      { id: 'seo-help', text: 'SEO and online visibility', intent: 'seo-help' },
      { id: 'general-marketing', text: 'Overall marketing strategy', intent: 'marketing-strategy' }
    ]
  },
  'content-type': {
    type: 'multiple-choice',
    question: "What kind of content do you need help with?",
    options: [
      { id: 'website-content', text: 'Website copy and landing pages', intent: 'website-content' },
      { id: 'blog-content', text: 'Blog posts and articles', intent: 'blog-content' },
      { id: 'social-content', text: 'Social media posts', intent: 'social-content' },
      { id: 'email-content', text: 'Email newsletters', intent: 'email-content' }
    ]
  },
  'operations-type': {
    type: 'multiple-choice',
    question: "Which business operations need help?",
    options: [
      { id: 'project-management', text: 'Project management and planning', intent: 'project-management' },
      { id: 'data-analytics', text: 'Data analysis and reporting', intent: 'analytics-help' },
      { id: 'client-management', text: 'Client proposals and invoicing', intent: 'client-management' },
      { id: 'team-management', text: 'Team coordination and meetings', intent: 'team-management' }
    ]
  },
  'describe-need': {
    type: 'text-input',
    question: "Please describe what you're looking for. I'll find the best tools for you!",
    placeholder: "e.g., I need help writing better email subject lines..."
  }
}

const intentMapping: Record<string, string[]> = {
  'launch-business': ['domain-name-genie', 'tagline-creator', 'ai-business-plan-generator', 'logo-color-picker'],
  'grow-business': ['customer-persona-generator', 'seo-analyzer', 'pricing-calculator'],
  'scale-business': ['powerbi-generator', 'meeting-extractor', 'project-timeline-builder'],
  'social-media-help': ['social-media-suggester', 'customer-persona-generator'],
  'email-marketing-help': ['email-subject-generator', 'follow-up-email-sequencer'],
  'content-marketing-help': ['blog-outline-builder', 'hero-copy-generator', 'faq-builder'],
  'seo-help': ['seo-analyzer', 'blog-outline-builder'],
  'marketing-strategy': ['customer-persona-generator', 'seo-analyzer'],
  'website-content': ['hero-copy-generator', 'faq-builder'],
  'blog-content': ['blog-outline-builder'],
  'social-content': ['social-media-suggester'],
  'email-content': ['email-subject-generator'],
  'project-management': ['project-timeline-builder', 'meeting-extractor'],
  'analytics-help': ['powerbi-generator', 'data-cleanse-helper'],
  'client-management': ['proposal-generator', 'invoice-template-builder'],
  'team-management': ['meeting-extractor', 'job-description-generator']
}

export default function SmartToolAssistant({ tools }: SmartToolAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentQuestion, setCurrentQuestion] = useState('initial')
  const [userContext, setUserContext] = useState<any>({})
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const matchingEngine = useRef(new ToolMatchingEngine(tools))

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addMessage('assistant', questionFlows.initial.question, 'question', questionFlows.initial)
      }, 500)
    }
  }, [isOpen])

  const addMessage = (sender: 'user' | 'assistant', content: string, type: 'text' | 'question' | 'tools' = 'text', data: any = null) => {
    const message: Message = {
      id: Date.now(),
      sender,
      content,
      type,
      data,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, message])
  }

  const handleOptionSelect = (option: any) => {
    addMessage('user', option.text)
    
    setUserContext(prev => ({
      ...prev,
      [currentQuestion]: option.id,
      lastChoice: option
    }))

    if (option.intent) {
      setTimeout(() => showRecommendations(option.intent), 1000)
    } else if (option.next) {
      setTimeout(() => {
        const nextFlow = questionFlows[option.next]
        setCurrentQuestion(option.next)
        addMessage('assistant', nextFlow.question, 'question', nextFlow)
      }, 1000)
    }
  }

  const handleTextInput = () => {
    if (!inputValue.trim()) return
    
    addMessage('user', inputValue)
    setIsTyping(true)
    
    setTimeout(() => {
      setIsTyping(false)
      
      const results = matchingEngine.current.findBestMatches(inputValue, userContext)
      
      if (results.primary.length > 0) {
        addMessage('assistant', results.explanation, 'text')
        addMessage('assistant', '', 'tools', { tools: results.primary })
        
        if (results.secondary.length > 0) {
          setTimeout(() => {
            addMessage('assistant', "You might also find these helpful:", 'text')
            addMessage('assistant', '', 'tools', { tools: results.secondary })
          }, 2000)
        }
      } else {
        addMessage('assistant', "I couldn't find exact matches, but here are some popular tools that might help:", 'text')
        const popularTools = tools.slice(0, 3).map(tool => ({ tool, score: 0.5, reasons: [] }))
        addMessage('assistant', '', 'tools', { tools: popularTools })
        setTimeout(() => {
          addMessage('assistant', "Would you like to tell me more about what you're looking for?", 'text')
        }, 2000)
      }
    }, 1500)
    
    setInputValue('')
  }

  const showRecommendations = (intent: string) => {
    setIsTyping(true)
    
    setTimeout(() => {
      setIsTyping(false)
      
      const recommendedToolIds = intentMapping[intent] || []
      const recommendedTools = recommendedToolIds
        .map(id => {
          const tool = tools.find(tool => tool.id === id)
          return tool ? { tool, score: 0.9, reasons: ['Matched your requirements'] } : null
        })
        .filter(Boolean)
      
      if (recommendedTools.length > 0) {
        addMessage('assistant', "Perfect! Based on your needs, here are my top recommendations:", 'text')
        addMessage('assistant', '', 'tools', { tools: recommendedTools })
        
        // Add follow-up suggestion
        setTimeout(() => {
          addMessage('assistant', "Would you like me to suggest tools that work well together with these?", 'text')
        }, 3000)
      } else {
        addMessage('assistant', "Let me show you some tools that might help:", 'text')
        const fallbackTools = tools.slice(0, 3).map(tool => ({ tool, score: 0.5, reasons: [] }))
        addMessage('assistant', '', 'tools', { tools: fallbackTools })
      }
    }, 1500)
  }

  const resetChat = () => {
    setMessages([])
    setCurrentQuestion('initial')
    setUserContext({})
    setInputValue('')
    setTimeout(() => {
      addMessage('assistant', questionFlows.initial.question, 'question', questionFlows.initial)
    }, 500)
  }

  const TypingIndicator = () => (
    <div className="flex gap-2">
      <div className="w-8 h-8 bg-[#ff7a59]/10 rounded-full flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-[#ff7a59]" />
      </div>
      <div className="bg-[var(--mist)] p-3 rounded-2xl border border-[var(--iron)]">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-[#ff7a59]/60 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-[#ff7a59]/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-[#ff7a59]/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  )

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg bg-[#ff7a59] hover:bg-[#ff7a59]/90 transition-all duration-300 hover:scale-110"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#10b981] rounded-full border-2 border-white animate-pulse"></div>
      </div>
    )
  }

  return (
    <Card className="fixed bottom-6 right-6 w-[400px] h-[650px] shadow-2xl z-50 flex flex-col bg-[var(--cloud)] border-[var(--iron)] rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5">
      <CardHeader className="flex-row items-center justify-between space-y-0 p-4 border-b border-[var(--iron)] bg-[var(--mist)]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#ff7a59]/10 rounded-full border border-[#ff7a59]/20">
            <Bot className="h-5 w-5 text-[#ff7a59]" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-[var(--night)]">Assistant</CardTitle>
            <div className="flex items-center gap-1.5 prose prose-stone">
               <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full"></div>
               <span className="text-[10px] text-[var(--steel)] uppercase tracking-widest font-bold">Online</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="hover:bg-[var(--iron)]/20 text-[var(--steel)]">
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-6 py-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.sender === 'assistant' && (
                  <div className="w-8 h-8 bg-[#ff7a59]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 border border-[#ff7a59]/10">
                    <Bot className="w-4 h-4 text-[#ff7a59]" />
                  </div>
                )}
                
                <div className="max-w-[85%]">
                  {message.type === 'text' && (
                    <div className={`p-4 rounded-2xl shadow-sm border ${
                      message.sender === 'user' 
                        ? 'bg-[var(--night)] text-white border-[var(--night)] rounded-tr-none' 
                        : 'bg-white text-[var(--night)] border-[var(--iron)] rounded-tl-none'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  )}
                  
                  {message.type === 'question' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-white text-[var(--night)] border border-[var(--iron)] shadow-sm rounded-tl-none">
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>
                      {message.data?.type === 'multiple-choice' && (
                        <div className="grid gap-2 pl-2">
                          {message.data.options.map((option: any, idx: number) => (
                            <Button
                              key={idx}
                              variant="outline"
                              className="justify-start text-left h-auto p-3.5 bg-white border-[var(--iron)] text-[var(--night)] hover:bg-[var(--mist)] hover:border-[#ff7a59]/30 rounded-xl transition-all duration-200"
                              onClick={() => handleOptionSelect(option)}
                            >
                              <span className="text-sm font-medium">{option.text}</span>
                              <ArrowRight className="w-3.5 h-3.5 ml-auto text-[var(--steel)]" />
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {message.type === 'tools' && (
                    <div className="space-y-3">
                      {message.data.tools.map((result: any) => {
                        const tool = result.tool
                        return (
                          <Card key={tool.id} className="card border-[var(--iron)] bg-white hover:border-[#ff7a59]/30 transition-all duration-200 shadow-sm overflow-hidden group">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h4 className="font-bold text-sm text-[var(--night)] group-hover:text-[#ff7a59] transition-colors">{tool.name}</h4>
                                <div className="flex gap-1 flex-shrink-0">
                                  {result.score > 0.7 && (
                                    <Badge className="text-[10px] bg-[#10b981] text-white border-0 px-1.5 h-4">
                                      Match
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <p className="text-xs text-[var(--steel)] mb-4 line-clamp-2 leading-relaxed">{tool.description}</p>
                              <Button size="sm" className="btn btn-primary w-full h-9" asChild>
                                <a href={tool.href} target="_blank" rel="noopener noreferrer">
                                  Use Tool <ArrowRight className="w-3.5 h-3.5 ml-2" />
                                </a>
                              </Button>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </div>
                
                {message.sender === 'user' && (
                  <div className="w-8 h-8 bg-[var(--night)] rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <div className="border-t border-[var(--iron)] p-4 bg-white">
          <div className="flex gap-2 mb-3">
            <Input
              placeholder="How can I help you today?"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleTextInput()}
              className="input flex-1 h-11"
            />
            <Button 
              size="icon" 
              onClick={handleTextInput} 
              disabled={!inputValue.trim()}
              className="h-11 w-11 rounded-xl bg-[var(--night)] hover:bg-[var(--night)]/90"
            >
              <Send className="h-5 w-5 text-white" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={resetChat} className="flex-1 text-[11px] font-bold text-[var(--steel)] hover:text-[#ff7a59] hover:bg-[#ff7a59]/5 h-8">
              <RotateCcw className="w-3 h-3 mr-1.5" />
              START OVER
            </Button>
            <div className="w-[1px] bg-[var(--iron)] h-4 self-center"></div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1 text-[11px] font-bold text-[var(--steel)] hover:text-[var(--night)] hover:bg-[var(--mist)] h-8"
              onClick={() => {
                addMessage('assistant', 'What specific functionality are you looking for?', 'text')
                setCurrentQuestion('describe-need')
              }}
            >
              SKIP TO QUEST
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
