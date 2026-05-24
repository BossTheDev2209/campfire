import { useState, useMemo } from 'react'
import { format } from 'date-fns'
import { useSearchMessages } from '@/hooks/useSearchMessages'

interface Props {
  channelId: string | null
  channelName: string
  onClose: () => void
}

function highlightText(text: string, query: string) {
  if (!query.trim()) return <span>{text}</span>

  const parts = text.split(new RegExp(`(${query})`, 'gi'))
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-claude-primary/15 text-claude-ink rounded-claudeXs px-0.5">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  )
}

export default function SearchBar({ channelId, channelName, onClose }: Props) {
  const [query, setQuery] = useState('')
  const { results, loading, error } = useSearchMessages(channelId, query)

  return (
    <div className="flex-1 min-w-0 bg-claude-canvas flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-12 px-4 flex items-center border-b border-claude-hairline shrink-0 min-w-0 gap-3">
        <button
          onClick={onClose}
          className="p-1.5 rounded-claudeSm text-claude-muted hover:text-claude-ink hover:bg-claude-surfaceSoft transition-colors flex items-center justify-center -ml-2 shrink-0"
          title="Back to chat"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div className="flex-1 h-8 bg-claude-surfaceSoft rounded-claudeMd border border-claude-hairline flex items-center px-3 gap-2 focus-within:border-claude-primary focus-within:ring-2 focus-within:ring-claude-primary/15 min-w-0">
          <svg className="w-4 h-4 text-claude-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search in #${channelName}`}
            className="flex-1 bg-transparent border-none outline-none text-sm text-claude-ink min-w-0"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-claude-muted hover:text-claude-ink p-0.5 rounded-claudeXs shrink-0"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Results Container */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-1 bg-claude-canvas">
        {loading && (
          <div className="py-8 text-center text-claude-muted text-sm">
            <div className="animate-pulse flex flex-col gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-3 px-2">
                  <div className="w-9 h-9 rounded-claudeLg bg-claude-surfaceSoft shrink-0"></div>
                  <div className="flex-1 flex flex-col gap-2 pt-1">
                    <div className="h-4 bg-claude-surfaceSoft rounded w-1/4"></div>
                    <div className="h-3 bg-claude-surfaceSoft rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-claude-surfaceCard border border-claude-hairline rounded-claudeMd p-4 text-center mt-4">
            <p className="text-claude-error text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && query.trim() && results.length === 0 && (
          <div className="py-8 text-center mt-4">
            <p className="text-claude-muted text-sm">No results for '{query}'</p>
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium text-claude-mutedSoft px-2 mb-2 uppercase tracking-wide">
              {results.length} result{results.length !== 1 && 's'}
            </p>
            {results.map((message) => (
              <div key={message._id} className="group flex gap-3 py-1.5 px-2 rounded-claudeMd hover:bg-claude-surfaceSoft transition-colors">
                <div className="w-9 h-9 rounded-claudeLg bg-claude-surfaceDark flex items-center justify-center text-claude-onDark font-semibold shrink-0 mt-0.5 text-sm">
                  {message.author?.username?.charAt(0).toUpperCase() ?? '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-medium text-claude-ink text-sm">{message.author?.username}</span>
                    <span className="text-claude-mutedSoft text-xs">
                      {format(new Date(message.createdAt), 'MM/dd/yyyy h:mm a')}
                    </span>
                    {message.edited && <span className="text-claude-mutedSoft text-xs">(edited)</span>}
                  </div>
                  <p className="text-claude-body text-sm break-words leading-relaxed">
                    {highlightText(message.content, query)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
