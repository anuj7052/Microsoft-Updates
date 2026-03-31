'use client'

import { useState, useEffect, useCallback } from 'react'

function timeAgo(dateStr) {
  const now = new Date()
  const date = new Date(dateStr)
  const diff = Math.floor((now - date) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function sanitize(str) {
  const div = typeof document !== 'undefined' ? document.createElement('div') : null
  if (!div) return str
  div.textContent = str
  return div.innerHTML
}

function CommentForm({ onSubmit, placeholder = 'Write a comment...', buttonText = 'Post Comment', autoFocus = false }) {
  const [name, setName] = useState('')
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const cleanName = sanitize(name.trim())
    const cleanText = sanitize(text.trim())
    if (!cleanName || !cleanText) return
    if (cleanName.length > 50 || cleanText.length > 2000) return
    onSubmit({ name: cleanName, text: cleanText })
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        maxLength={50}
        required
        className="w-full bg-ms-navy border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-ms-accent focus:outline-none transition-colors font-dm"
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        maxLength={2000}
        required
        rows={3}
        autoFocus={autoFocus}
        className="w-full bg-ms-navy border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-ms-accent focus:outline-none transition-colors resize-none font-dm"
      />
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-[var(--text-muted)] font-dm">{text.length}/2000</span>
        <button
          type="submit"
          disabled={!name.trim() || !text.trim()}
          className="bg-ms-accent hover:bg-ms-accent/80 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold px-5 py-2 rounded-lg transition-all font-syne"
        >
          {buttonText}
        </button>
      </div>
    </form>
  )
}

function Comment({ comment, onReply, depth = 0 }) {
  const [showReplyForm, setShowReplyForm] = useState(false)

  const handleReply = (data) => {
    onReply(comment.id, data)
    setShowReplyForm(false)
  }

  const maxDepth = 3

  return (
    <div className={`${depth > 0 ? 'ml-6 pl-4 border-l-2 border-[var(--border)]' : ''}`}>
      <div className="bg-ms-card rounded-xl border border-[var(--border)] p-4 mb-3">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-ms-blue to-ms-accent flex items-center justify-center text-white text-xs font-bold">
            {comment.name.charAt(0).toUpperCase()}
          </div>
          <span className="font-syne font-bold text-sm text-[var(--text-primary)]">{comment.name}</span>
          <span className="text-[10px] text-[var(--text-muted)] font-dm">• {timeAgo(comment.date)}</span>
        </div>

        {/* Body */}
        <p className="text-sm text-[var(--text-secondary)] font-dm leading-relaxed whitespace-pre-wrap">{comment.text}</p>

        {/* Actions */}
        {depth < maxDepth && (
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-xs text-ms-accent hover:text-ms-accent/80 font-medium mt-2 transition-colors font-dm"
          >
            {showReplyForm ? 'Cancel' : 'Reply'}
          </button>
        )}
      </div>

      {/* Reply Form */}
      {showReplyForm && (
        <div className="ml-6 mb-3">
          <CommentForm
            onSubmit={handleReply}
            placeholder={`Reply to ${comment.name}...`}
            buttonText="Reply"
            autoFocus
          />
        </div>
      )}

      {/* Nested Replies */}
      {comment.replies?.map((reply) => (
        <Comment key={reply.id} comment={reply} onReply={onReply} depth={depth + 1} />
      ))}
    </div>
  )
}

export default function CommentSection({ articleId }) {
  const [comments, setComments] = useState([])
  const storageKey = `comments_${articleId}`

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) setComments(JSON.parse(saved))
    } catch {}
  }, [storageKey])

  const saveComments = useCallback((newComments) => {
    setComments(newComments)
    try {
      localStorage.setItem(storageKey, JSON.stringify(newComments))
    } catch {}
  }, [storageKey])

  const addComment = (data) => {
    const newComment = {
      id: generateId(),
      name: data.name,
      text: data.text,
      date: new Date().toISOString(),
      replies: [],
    }
    saveComments([newComment, ...comments])
  }

  const addReply = (parentId, data) => {
    const reply = {
      id: generateId(),
      name: data.name,
      text: data.text,
      date: new Date().toISOString(),
      replies: [],
    }

    function insertReply(commentList) {
      return commentList.map((c) => {
        if (c.id === parentId) {
          return { ...c, replies: [...(c.replies || []), reply] }
        }
        if (c.replies?.length) {
          return { ...c, replies: insertReply(c.replies) }
        }
        return c
      })
    }

    saveComments(insertReply(comments))
  }

  const totalComments = (() => {
    let count = 0
    function countAll(list) {
      list.forEach((c) => {
        count++
        if (c.replies) countAll(c.replies)
      })
    }
    countAll(comments)
    return count
  })()

  return (
    <section className="mt-10">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="font-syne font-bold text-xl text-[var(--text-primary)] tracking-tight">Comments</h2>
        <span className="bg-ms-accent/15 text-ms-accent text-xs font-bold px-2.5 py-0.5 rounded-full">
          {totalComments}
        </span>
      </div>

      {/* Comment Form */}
      <div className="mb-8">
        <CommentForm onSubmit={addComment} />
      </div>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-[var(--text-muted)] font-dm">No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-1">
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} onReply={addReply} />
          ))}
        </div>
      )}
    </section>
  )
}
