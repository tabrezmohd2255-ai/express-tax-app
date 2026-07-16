import React, { useState, useRef, useEffect } from 'react'
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  MoreVertical,
  ChevronLeft,
  User,
  Shield,
  HelpCircle,
  Bell,
  Search,
  X,
  Check,
  CheckCheck,
  Clock,
  AlertCircle,
  Plus,
  Smile,
  Mic,
  Image,
  FileText,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { clsx } from 'clsx'
import { useToast } from '../hooks'

function MessageThreadItem({ thread, isActive, onClick, unreadCount }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full px-4 py-4 flex items-start gap-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0',
        isActive && 'bg-gray-50 border-l-4 border-navy-600 -ml-4 pl-3',
        thread.unread > 0 && !isActive && 'bg-gray-50'
      )}
      aria-pressed={isActive}
      aria-label={`Conversation with ${thread.advisorName || thread.subject}, ${thread.unread} unread messages`}
    >
      <div className={clsx('w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', thread.type === 'advisor' ? 'bg-navy-100 text-navy-700' : 'bg-gold-50 text-gold-600')}>
        {thread.type === 'advisor' ? <User size={20} aria-hidden="true" /> : <HelpCircle size={20} aria-hidden="true" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className={clsx('font-medium truncate', thread.unread > 0 ? 'text-navy-900' : 'text-gray-700')}>
            {thread.advisorName || thread.subject}
          </h4>
          <span className="text-xs text-gray-400 flex-shrink-0 whitespace-nowrap">
            {new Date(thread.updatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <p className={clsx('text-sm truncate mt-1', thread.unread > 0 ? 'text-gray-600 font-medium' : 'text-gray-500')}>
          {thread.preview}
        </p>
        {thread.unread > 0 && (
          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-gold-500 text-navy-900 rounded-full mt-1">
            {thread.unread > 9 ? '9+' : thread.unread}
          </span>
        )}
      </div>
    </button>
  )
}

function MessageBubble({ message, isOwn, timeOnly = false }) {
  return (
    <div className={clsx('flex gap-3', isOwn ? 'justify-end' : 'justify-start')}>
      {!isOwn && !timeOnly && (
        <div className="w-8 h-8 rounded-full bg-navy-100 text-navy-700 flex items-center justify-center flex-shrink-0">
          <User size={16} aria-hidden="true" />
        </div>
      )}
      <div className={clsx('max-w-[70%]', isOwn ? 'order-2' : 'order-1')}>
        {!timeOnly && (
          <div className={clsx(
            'rounded-2xl px-4 py-2',
            isOwn ? 'bg-navy-900 text-white rounded-tr-sm' : 'bg-gray-100 text-gray-900 rounded-tl-sm'
          )}>
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </div>
        )}
        <div className={clsx('flex items-center gap-1 mt-1 text-xs', isOwn ? 'justify-end text-gray-400' : 'text-gray-400')}>
          <span>{new Date(message.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
          {isOwn && message.read !== false && (
            <CheckCheck size={14} className="text-gray-400" aria-label="Read" />
          )}
          {isOwn && !message.read && (
            <Check size={14} className="text-gray-400" aria-label="Delivered" />
          )}
          {isOwn && message.sending && (
            <Clock size={14} className="text-gray-400 animate-spin" aria-label="Sending" />
          )}
        </div>
      </div>
      {isOwn && !timeOnly && (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
          <User size={16} className="text-gray-500" aria-hidden="true" />
        </div>
      )}
    </div>
  )
}

function DateSeparator({ date }) {
  const today = new Date()
  const msgDate = new Date(date)
  const isToday = msgDate.toDateString() === today.toDateString()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const isYesterday = msgDate.toDateString() === yesterday.toDateString()

  let label = msgDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  if (isToday) label = 'Today'
  else if (isYesterday) label = 'Yesterday'

  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 border-t border-gray-200" />
      <span className="text-xs font-medium text-gray-500 px-3 bg-gray-50">{label}</span>
      <div className="flex-1 border-t border-gray-200" />
    </div>
  )
}

function MessageComposer({ onSend, disabled, threadType }) {
  const [message, setMessage] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const textareaRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!message.trim() || disabled) return
    onSend(message.trim())
    setMessage('')
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white">
      <div className="flex items-end gap-2">
        <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-lg">
          <button
            type="button"
            className={clsx('p-2 rounded-lg transition-colors', showEmoji ? 'bg-white shadow-sm' : 'text-gray-400 hover:text-navy-600')}
            onClick={() => setShowEmoji(!showEmoji)}
            aria-label="Emoji picker"
            aria-expanded={showEmoji}
          >
            <Smile size={20} aria-hidden="true" />
          </button>
          <button type="button" className="p-2 rounded-lg text-gray-400 hover:text-navy-600 transition-colors" aria-label="Attach file">
            <Paperclip size={20} aria-hidden="true" />
          </button>
          <button type="button" className="p-2 rounded-lg text-gray-400 hover:text-navy-600 transition-colors" aria-label="Attach image">
            <Image size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 focus:bg-white"
            disabled={disabled}
            aria-label="Message input"
            style={{ minHeight: '48px', maxHeight: '150px' }}
          />
        </div>
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="btn btn-primary p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <Send size={20} aria-hidden="true" />
        </button>
      </div>
      {showEmoji && (
        <div className="mt-2 p-2 bg-gray-50 rounded-lg flex flex-wrap gap-1" role="listbox" aria-label="Emoji picker">
          {['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '💀', '☠️', '👻', '👽', '👾', '🤖', '💩', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'].map(emoji => (
            <button
              key={emoji}
              type="button"
              onClick={() => { setMessage(m => m + emoji); textareaRef.current?.focus(); }}
              className="text-lg p-1 hover:bg-white rounded transition-colors"
              role="option"
              aria-label={emoji}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </form>
  )
}

function EmptyState({ type }) {
  if (type === 'no-threads') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <MessageSquare size={64} className="text-gray-300 mb-4" aria-hidden="true" />
        <h2 className="text-xl font-semibold text-navy-900 mb-2">No conversations yet</h2>
        <p className="text-gray-500 mb-6 max-w-md">
          Start a conversation with your tax advisor or contact support for assistance.
        </p>
        <div className="flex gap-3">
          <button className="btn btn-primary">
            <Plus size={14} aria-hidden="true" />
            Message Advisor
          </button>
          <button className="btn btn-secondary">
            <HelpCircle size={14} aria-hidden="true" />
            Contact Support
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <MessageSquare size={64} className="text-gray-300 mb-4" aria-hidden="true" />
      <h2 className="text-xl font-semibold text-navy-900 mb-2">Select a conversation</h2>
      <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
    </div>
  )
}

export function Messages() {
  const { 
    messages, 
    sendMessage, 
    startNewThread,
    unreadMessages 
  } = useApp()
  const { toasts, show: showToast } = useToast()
  const [selectedThreadId, setSelectedThreadId] = useState(null)
  const [newThreadType, setNewThreadType] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef(null)
  const sidebarRef = useRef(null)

  const selectedThread = messages.find(m => m.threadId === selectedThreadId)
  const filteredMessages = messages.filter(m => 
    (m.advisorName || m.subject).toLowerCase().includes(searchQuery.toLowerCase())
  )

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [selectedThread?.messages])

  const handleSendMessage = (content) => {
    if (selectedThreadId) {
      sendMessage(selectedThreadId, content)
    }
  }

  const handleNewThread = (type) => {
    const thread = startNewThread(type, type === 'advisor' ? 'New Message to Advisor' : 'New Support Request', '')
    setSelectedThreadId(thread.threadId)
    setNewThreadType(null)
  }

  const handleThreadClick = (threadId) => {
    setSelectedThreadId(threadId)
    // Mark as read
    // In real app: markThreadRead(threadId)
  }

  return (
    <div className="animate-fade-in h-[calc(100vh-8rem)] flex overflow-hidden">
      {/* Sidebar - Thread List */}
      <aside className={clsx(
        'w-full md:w-96 border-r border-gray-200 bg-white flex flex-col hidden md:flex',
        selectedThreadId ? '' : 'md:w-1/2'
      )}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-navy-900">Messages</h2>
          <div className="flex items-center gap-2">
            <button className="btn btn-ghost btn-sm p-2" aria-label="Search messages">
              <Search size={18} aria-hidden="true" />
            </button>
            <div className="relative">
              <button
                onClick={() => setNewThreadType('advisor')}
                className="btn btn-primary btn-sm"
              >
                <Plus size={14} aria-hidden="true" />
                New
              </button>
            </div>
          </div>
        </div>

        <div className="p-3 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="input pl-10"
              aria-label="Search conversations"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto" ref={sidebarRef} role="list" aria-label="Conversations">
          {filteredMessages.length > 0 ? (
            filteredMessages.map(thread => (
              <MessageThreadItem
                key={thread.threadId}
                thread={thread}
                isActive={selectedThreadId === thread.threadId}
                onClick={() => handleThreadClick(thread.threadId)}
              />
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <MessageSquare size={32} className="mx-auto text-gray-300 mb-2" aria-hidden="true" />
              <p className="text-sm">No conversations found</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex flex-col gap-2">
            <button className="btn btn-secondary w-full justify-start" onClick={() => setNewThreadType('advisor')}>
              <User size={16} aria-hidden="true" />
              Message Your Advisor
            </button>
            <button className="btn btn-ghost w-full justify-start" onClick={() => setNewThreadType('support')}>
              <HelpCircle size={16} aria-hidden="true" />
              Contact Support
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Thread List Toggle */}
      <button
        className="md:hidden btn btn-ghost fixed bottom-6 right-6 z-fixed shadow-lg"
        onClick={() => sidebarRef.current?.scrollIntoView({ behavior: 'smooth' })}
        aria-label="Show conversations"
      >
        <MessageSquare size={24} aria-hidden="true" />
        {unreadMessages > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold-500 text-navy-900 text-xs font-bold rounded-full flex items-center justify-center">
            {unreadMessages}
          </span>
        )}
      </button>

      {/* Chat Area */}
      <div className={clsx(
        'flex-1 flex flex-col min-w-0',
        !selectedThreadId ? 'items-center justify-center' : 'md:flex-1'
      )}>
        {selectedThread ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <button className="md:hidden btn btn-ghost p-2" aria-label="Back to conversations">
                  <ChevronLeft size={20} aria-hidden="true" />
                </button>
                <div className={clsx('w-10 h-10 rounded-full flex items-center justify-center', selectedThread.type === 'advisor' ? 'bg-navy-100 text-navy-700' : 'bg-gold-50 text-gold-600')}>
                  {selectedThread.type === 'advisor' ? <User size={20} aria-hidden="true" /> : <HelpCircle size={20} aria-hidden="true" />}
                </div>
                <div>
                  <h3 className="font-medium text-navy-900">{selectedThread.advisorName || selectedThread.subject}</h3>
                  <p className="text-xs text-gray-500">{selectedThread.type === 'advisor' ? 'Tax Advisor' : 'Express Tax Support'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn btn-ghost btn-sm p-2" aria-label="Notifications">
                  <Bell size={18} aria-hidden="true" />
                </button>
                <button className="btn btn-ghost btn-sm p-2" aria-label="More options">
                  <MoreVertical size={18} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" role="log" aria-live="polite" aria-label="Messages">
              {selectedThread.messages.length > 0 ? (
                selectedThread.messages.map((msg, index) => {
                  const showDate = index === 0 || 
                    new Date(msg.timestamp).toDateString() !== new Date(selectedThread.messages[index - 1].timestamp).toDateString()

                  return (
                    <React.Fragment key={msg.id}>
                      {showDate && <DateSeparator date={msg.timestamp} />}
                      <MessageBubble 
                        message={msg} 
                        isOwn={msg.sender === 'client'}
                      />
                    </React.Fragment>
                  )
                })
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p className="text-sm">No messages yet. Start the conversation!</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Composer */}
            <MessageComposer 
              onSend={handleSendMessage}
              disabled={false}
              threadType={selectedThread.type}
            />
          </>
        ) : (
          <EmptyState type="no-threads" />
        )}
      </div>

      {/* New Thread Modal */}
      {newThreadType && (
        <div className="modal-backdrop" onClick={() => setNewThreadType(null)} role="dialog" aria-modal="true">
          <div className="modal modal-md animate-scale-in">
            <div className="modal-header">
              <h2 className="modal-title">{newThreadType === 'advisor' ? 'Message Your Advisor' : 'Contact Support'}</h2>
              <button className="modal-close" onClick={() => setNewThreadType(null)} aria-label="Close">
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <div className="modal-body">
              <p className="text-gray-600 mb-4">
                {newThreadType === 'advisor' 
                  ? 'Your message will be sent to James Anderson, CPA. They typically respond within 24 hours.'
                  : 'Our support team will get back to you within 1 business day.'
                }
              </p>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-navy-300 hover:bg-gray-50 transition-colors">
                  <input type="radio" name="topic" className="w-4 h-4 text-navy-600" defaultChecked />
                  <div>
                    <p className="font-medium text-navy-900">General tax question</p>
                    <p className="text-sm text-gray-500">Ask about deductions, credits, or filing</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-navy-300 hover:bg-gray-50 transition-colors">
                  <input type="radio" name="topic" className="w-4 h-4 text-navy-600" />
                  <div>
                    <p className="font-medium text-navy-900">Document question</p>
                    <p className="text-sm text-gray-500">Questions about uploaded documents</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-navy-300 hover:bg-gray-50 transition-colors">
                  <input type="radio" name="topic" className="w-4 h-4 text-navy-600" />
                  <div>
                    <p className="font-medium text-navy-900">Return status</p>
                    <p className="text-sm text-gray-500">Check on your tax return progress</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-navy-300 hover:bg-gray-50 transition-colors">
                  <input type="radio" name="topic" className="w-4 h-4 text-navy-600" />
                  <div>
                    <p className="font-medium text-navy-900">Other</p>
                    <p className="text-sm text-gray-500">Something else</p>
                  </div>
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setNewThreadType(null)} className="btn btn-secondary">Cancel</button>
              <button 
                onClick={() => handleNewThread(newThreadType)} 
                className="btn btn-primary"
              >
                Start Conversation
                <MessageSquare size={14} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <div className="toast-container" role="region" aria-label="Notifications" aria-live="polite">
        {toasts.map(toast => (
          <div key={toast.id} className={clsx('toast animate-slide-in-right', toast.type)}>
            <div className="toast-icon">
              {toast.type === 'success' && <CheckCircle size={20} className="text-success" />}
              {toast.type === 'error' && <AlertCircle size={20} className="text-error" />}
              {toast.type === 'warning' && <AlertCircle size={20} className="text-warning" />}
              {toast.type === 'info' && <AlertCircle size={20} className="text-info" />}
            </div>
            <div className="toast-content">
              <p className="toast-title">{toast.title}</p>
              <p className="toast-message">{toast.message}</p>
            </div>
            <button className="toast-close" onClick={() => {}} aria-label="Dismiss">
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}