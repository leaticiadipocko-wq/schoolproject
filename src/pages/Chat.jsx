import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { useLang } from '@/context/LanguageContext'
import {
  Send, Search, ArrowLeft, Phone, Video, MoreVertical,
  Check, CheckCheck, User as UserIcon, Users, Plus, X, MessageCircle,
  Smile, Paperclip, Reply, Mic,
} from 'lucide-react'

const ROLE_BADGES = {
  student:  { label: 'Student',  class: 'bg-blue-100 text-blue-700' },
  lecturer: { label: 'Lecturer', class: 'bg-amber-100 text-amber-700' },
  staff:    { label: 'Staff',    class: 'bg-purple-100 text-purple-700' },
  admin:    { label: 'Admin',    class: 'bg-brand-100 text-brand-700' },
}

function formatTime(ts) {
  const d = new Date(ts)
  const now = new Date()
  const diff = now - d
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000 && d.getDate() === now.getDate()) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  if (diff < 172800000) return 'Yesterday'
  return d.toLocaleDateString([], { day: 'numeric', month: 'short' })
}

function formatLastSeen(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  const now = new Date()
  const diff = now - d
  if (diff < 60000) return 'online'
  if (diff < 3600000) return `last seen ${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `last seen ${Math.floor(diff / 3600000)}h ago`
  return `last seen ${d.toLocaleDateString([], { day: 'numeric', month: 'short' })}`
}

function formatDateSeparator(ts, lang) {
  const d = new Date(ts)
  const now = new Date()
  const diff = now - d
  if (diff < 86400000 && d.getDate() === now.getDate()) return 'Today'
  if (diff < 172800000) return 'Yesterday'
  return d.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })
}

const EMOJIS = ['😀','😂','😍','🥰','😎','🤔','👍','👎','🙏','🔥','💯','❤️','🎉','🚀','✅','❌','⭐','💪','👏','🎯']

export default function Chat() {
  const { user } = useAuth()
  const { conversations, messages, sendMessage, createConversation, markConversationRead, users, addNewUser } = useData()
  const { lang } = useLang()
  const [activeConv, setActiveConv] = useState(null)
  const [showList, setShowList] = useState(true)
  const [text, setText] = useState('')
  const [search, setSearch] = useState('')
  const [replyTo, setReplyTo] = useState(null)
  const [showEmoji, setShowEmoji] = useState(false)
  const [typingUsers, setTypingUsers] = useState({})
  const [msgSearch, setMsgSearch] = useState('')
  const [showMsgSearch, setShowMsgSearch] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const msgContainerRef = useRef(null)

  const filteredConvs = useMemo(() => {
    if (!search.trim()) return conversations
    const q = search.toLowerCase()
    return conversations.filter(c => {
      const nameMatch = c.name?.toLowerCase().includes(q)
      const participantMatch = c.participants?.some(p => p.name?.toLowerCase().includes(q))
      return nameMatch || participantMatch
    })
  }, [conversations, search])

  const activeMessages = useMemo(() => {
    if (!activeConv) return []
    return messages
      .filter(m => m.conversationId === activeConv.id)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  }, [messages, activeConv])

  const filteredMessages = useMemo(() => {
    if (!msgSearch.trim()) return activeMessages
    const q = msgSearch.toLowerCase()
    return activeMessages.filter(m => m.text?.toLowerCase().includes(q))
  }, [activeMessages, msgSearch])

  const searchResults = useMemo(() => {
    if (!msgSearch.trim()) return []
    return activeMessages
      .map((m, i) => ({ msg: m, idx: i }))
      .filter(({ msg }) => msg.text?.toLowerCase().includes(msgSearch.toLowerCase()))
  }, [activeMessages, msgSearch])

  const [searchResultIdx, setSearchResultIdx] = useState(0)

  const otherParticipants = useMemo(() => {
    if (!activeConv) return []
    return activeConv.participants?.filter(p => p.uid !== user?.uid) || []
  }, [activeConv, user])

  const convName = activeConv?.type === 'direct'
    ? otherParticipants.map(p => p.name).join(', ')
    : activeConv?.name || 'Chat'

  const convAvatar = activeConv?.type === 'direct' && otherParticipants.length === 1
    ? otherParticipants[0].avatar
    : null

  const isOnline = useMemo(() => {
    if (!activeConv) return false
    const p = otherParticipants[0]
    if (!p) return false
    const lastSeen = activeConv.updatedAt
    if (!lastSeen) return true
    return Date.now() - new Date(lastSeen).getTime() < 60000
  }, [activeConv, otherParticipants])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeMessages])

  useEffect(() => {
    if (activeConv && activeConv.unread > 0) {
      markConversationRead(activeConv.id)
    }
  }, [activeConv?.id])

  useEffect(() => {
    if (!showList && inputRef.current) {
      inputRef.current.focus()
    }
  }, [showList])

  useEffect(() => {
    if (msgSearch.trim() && searchResults.length > 0) {
      const target = document.getElementById(`msg-${searchResults[searchResultIdx]?.msg?.id}`)
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [searchResultIdx, msgSearch])

  // Simulate other users typing
  useEffect(() => {
    if (!activeConv || activeConv.type !== 'direct') return
    const interval = setInterval(() => {
      if (Math.random() > 0.85) {
        const p = otherParticipants[0]
        if (p) {
          setTypingUsers(prev => ({ ...prev, [p.uid]: true }))
          setTimeout(() => {
            setTypingUsers(prev => ({ ...prev, [p.uid]: false }))
          }, 2500 + Math.random() * 3000)
        }
      }
    }, 8000)
    return () => clearInterval(interval)
  }, [activeConv, otherParticipants])

  const handleSend = () => {
    if (!text.trim() || !activeConv) return
    sendMessage(activeConv.id, text.trim(), replyTo ? { id: replyTo.id, text: replyTo.text, sender: replyTo.sender } : null)
    setText('')
    setReplyTo(null)
    setShowEmoji(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const openConversation = (conv) => {
    setActiveConv(conv)
    setShowList(false)
    setReplyTo(null)
    setMsgSearch('')
    setShowMsgSearch(false)
  }

  const totalUnread = useMemo(() =>
    conversations.reduce((sum, c) => sum + (c.unread || 0), 0),
    [conversations]
  )

  const [showNewConv, setShowNewConv] = useState(false)
  const [newConvName, setNewConvName] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [userSearch, setUserSearch] = useState('')

  const allUsers = useMemo(() => {
    const seen = {}
    const fromStore = (users || []).filter(u => {
      const key = u?.uid || u?.id || u?.uuid || u?.email
      if (!key) return false
      const currentKey = user?.uid || user?.id || user?.email
      if (key === currentKey) return false
      if (seen[key]) return false
      seen[key] = true
      return true
    })
    if (fromStore.length >= 2) return fromStore
    const { MOCK_USERS } = window.__MOCK_DATA__ || {}
    if (!MOCK_USERS) return fromStore
    return MOCK_USERS.filter(u => {
      if (u.uid === user?.uid) return false
      if (seen[u.uid]) return false
      seen[u.uid] = true
      return true
    }).map(u => ({ id: u.uid, uid: u.uid, name: u.name, email: u.email, role: u.role, avatar: u.avatar }))
  }, [users, user])

  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return allUsers
    const q = userSearch.toLowerCase()
    return allUsers.filter(u => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q))
  }, [allUsers, userSearch])

  const handleCreateConversation = () => {
    if (selectedUsers.length === 0) return
    const type = selectedUsers.length === 1 ? 'direct' : 'group'
    const participants = [
      { uid: user?.uid, name: user?.name, role: user?.role, avatar: user?.avatar },
      ...selectedUsers,
    ]
    createConversation(participants, type, newConvName)
    setShowNewConv(false)
    setSelectedUsers([])
    setNewConvName('')
    setUserSearch('')
    toast.success(type === 'group' ? 'Group created' : 'Conversation started')
  }

  const toggleUser = (u) => {
    setSelectedUsers(prev =>
      prev.find(p => p.uid === u.uid)
        ? prev.filter(p => p.uid !== u.uid)
        : [...prev, u]
    )
  }

  const latestMessage = (conv) => {
    const convMsgs = messages.filter(m => m.conversationId === conv.id)
    if (convMsgs.length === 0) return conv.lastMessage?.text || ''
    const last = convMsgs[convMsgs.length - 1]
    const prefix = last.sender?.uid === user?.uid ? 'You: ' : ''
    return prefix + last.text
  }

  const latestTimestamp = (conv) => {
    const convMsgs = messages.filter(m => m.conversationId === conv.id)
    if (convMsgs.length === 0) return conv.updatedAt
    return convMsgs[convMsgs.length - 1].timestamp
  }

  const StatusIcon = ({ status }) => {
    if (status === 'sent') return <Check size={12} className="text-white/60" />
    if (status === 'delivered') return <CheckCheck size={12} className="text-white/70" />
    return <CheckCheck size={12} className="text-accent-300" />
  }

  const addEmoji = (emoji) => {
    setText(prev => prev + emoji)
    setShowEmoji(false)
    inputRef.current?.focus()
  }

  const startReply = (msg) => {
    setReplyTo({ id: msg.id, text: msg.text, sender: msg.sender })
    inputRef.current?.focus()
  }

  return (
    <div className="h-[calc(100vh-5rem)] flex -m-4 md:-m-6 overflow-hidden bg-ink-50/50">
      {/* Conversation List - WhatsApp style */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-ink-100 bg-white flex flex-col shrink-0 ${showList ? 'flex' : 'hidden md:flex'}`}>
        <div className="p-4 border-b border-ink-100 bg-white">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-lg">
              {lang === 'en' ? 'Chat' : 'Discussion'}
            </h2>
            {totalUnread > 0 && (
              <span className="bg-accent-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {totalUnread}
              </span>
            )}
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              className="input pl-9 text-sm"
              placeholder={lang === 'en' ? 'Search or start new chat' : 'Rechercher...'}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowNewConv(true)}
            className="mt-3 w-full flex items-center gap-2 px-4 py-3 min-h-[44px] rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-medium text-sm transition"
          >
            <Plus size={16} />
            {lang === 'en' ? 'New Conversation' : 'Nouvelle conversation'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConvs.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Users size={36} className="mx-auto text-ink-400 mb-3" />
              <div className="font-medium text-ink-600">
                {lang === 'en' ? 'No conversations yet' : 'Aucune conversation'}
              </div>
              <div className="text-sm text-ink-500 mt-1">
                {lang === 'en' ? 'Start a chat with a student or lecturer' : 'Démarrez une discussion'}
              </div>
            </div>
          ) : filteredConvs.map(conv => {
            const lastMsg = latestMessage(conv)
            const lastTs = latestTimestamp(conv)
            const other = conv.type === 'direct' ? conv.participants?.find(p => p.uid !== user?.uid) : null
            const convUnread = conv.unread || 0
            const isSender = conv.lastMessage?.senderUid === user?.uid
            return (
              <button
                key={conv.id}
                onClick={() => openConversation(conv)}
                className={`w-full flex items-center gap-3 px-4 py-3 min-h-[44px] hover:bg-ink-50 transition border-b border-ink-50 text-left ${
                  activeConv?.id === conv.id ? 'bg-brand-50/60' : ''
                }`}
              >
                <div className="relative shrink-0">
                  {conv.type === 'direct' && other?.avatar ? (
                    <img src={other.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center">
                      <Users size={20} className="text-brand-600" />
                    </div>
                  )}
                  {conv.type === 'direct' && other && (
                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      Date.now() - new Date(conv.updatedAt).getTime() < 60000 ? 'bg-green-500' : 'bg-ink-300'
                    }`} />
                  )}
                  {conv.type === 'group' && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-brand-600 border-2 border-white flex items-center justify-center">
                      <Users size={10} className="text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-sm truncate">
                      {conv.type === 'direct' ? other?.name || conv.name : conv.name}
                    </span>
                    <span className="text-[10px] text-ink-400 shrink-0">
                      {formatTime(lastTs)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    {conv.type === 'group' && conv.participants && (
                      <div className="flex items-center gap-1 shrink-0 text-[10px] text-ink-500">
                        {Object.entries(
                          conv.participants.reduce((acc, p) => {
                            const role = ROLE_BADGES[p.role] ? p.role : 'student'
                            acc[role] = (acc[role] || 0) + 1
                            return acc
                          }, {})
                        ).map(([role, count]) => (
                          <span key={role} className={`${ROLE_BADGES[role]?.class || 'bg-ink-100 text-ink-600'} px-1 py-0.5 rounded-full`}>
                            {count}{role === 'student' ? 'S' : role === 'lecturer' ? 'L' : role === 'staff' ? 'St' : 'A'}
                          </span>
                        ))}
                      </div>
                    )}
                    <span className="text-xs text-ink-500 truncate flex-1 flex items-center gap-1">
                      {isSender && <CheckCheck size={11} className="text-accent-500 shrink-0" />}
                      {lastMsg}
                    </span>
                    {convUnread > 0 && (
                      <span className="bg-accent-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shrink-0">
                        {convUnread}
                      </span>
                    )}
                  </div>
                  {other?.role && (
                    <span className={`text-[10px] inline-block mt-0.5 px-1.5 py-0.5 rounded-full ${ROLE_BADGES[other.role]?.class || 'bg-ink-100 text-ink-600'}`}>
                      {ROLE_BADGES[other.role]?.label || other.role}
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`flex-1 flex flex-col bg-white ${showList ? 'hidden md:flex' : 'flex'}`}>
        {!activeConv ? (
          <div className="flex-1 flex items-center justify-center bg-[#efeae2]">
            <div className="text-center -mt-12">
              <div className="w-24 h-24 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-5">
                <MessageCircle size={44} className="text-brand-400" />
              </div>
              <div className="font-display font-bold text-2xl text-ink-800">
                SIARM Messenger
              </div>
              <div className="text-ink-500 text-sm mt-3 max-w-sm">
                {lang === 'en'
                  ? 'Send and receive messages across students, lecturers, and staff in real time'
                  : 'Envoyez et recevez des messages entre étudiants, enseignants et personnel en temps réel'}
              </div>
              <div className="mt-6 flex items-center justify-center gap-6 text-xs text-ink-400">
                <span className="flex items-center gap-1.5"><CheckCheck size={14} /> End-to-end encrypted</span>
                <span className="flex items-center gap-1.5"><Users size={14} /> Cross-role</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header - WhatsApp style */}
            <div className="flex items-center gap-3 px-4 py-2.5 border-b border-ink-100 bg-[#f0f2f5] shrink-0">
              <button
                onClick={() => setShowList(true)}
                className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center -ml-1 text-ink-600 hover:text-ink-900"
              >
                <ArrowLeft size={20} />
              </button>

              <div className="relative shrink-0">
                {convAvatar ? (
                  <img src={convAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                    <Users size={18} className="text-brand-600" />
                  </div>
                )}
                {activeConv.type === 'direct' && otherParticipants.length > 0 && (
                  <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                    isOnline ? 'bg-green-500' : 'bg-ink-300'
                  }`} />
                )}
              </div>

              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setShowMsgSearch(!showMsgSearch)}>
                <div className="font-medium text-sm truncate flex items-center gap-1.5">
                  {convName}
                  {activeConv.type === 'direct' && otherParticipants[0]?.role && (
                    <span className={`${ROLE_BADGES[otherParticipants[0].role]?.class || ''} px-1.5 py-0.5 rounded-full text-[9px] font-normal`}>
                      {ROLE_BADGES[otherParticipants[0].role]?.label || otherParticipants[0].role}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-ink-500">
                  {typingUsers[otherParticipants[0]?.uid]
                    ? <span className="text-green-600 italic">typing...</span>
                    : activeConv.type === 'group'
                      ? (
                        <span className="flex items-center gap-1.5 flex-wrap">
                          <span>{activeConv.participants?.length || 0} participants</span>
                          {Object.entries(
                            activeConv.participants.reduce((acc, p) => {
                              const role = ROLE_BADGES[p.role] ? p.role : 'guest'
                              acc[role] = (acc[role] || 0) + 1
                              return acc
                            }, {})
                          ).map(([role, count]) => (
                            <span key={role} className={`${ROLE_BADGES[role]?.class || 'bg-ink-100 text-ink-600'} px-1.5 py-0.5 rounded-full text-[10px]`}>
                              {count} {ROLE_BADGES[role]?.label || role}
                            </span>
                          ))}
                        </span>
                      )
                      : formatLastSeen(activeConv.updatedAt)
                  }
                </div>
              </div>

              <button className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-ink-100 text-ink-600" title="Voice call">
                <Phone size={18} />
              </button>
              <button className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-ink-100 text-ink-600" title="Video call">
                <Video size={18} />
              </button>
              <button onClick={() => setShowMsgSearch(!showMsgSearch)} className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-ink-100 text-ink-600" title="Search messages">
                <Search size={18} />
              </button>
            </div>

            {/* Message search bar */}
            {showMsgSearch && (
              <div className="px-4 py-2 border-b border-ink-100 bg-[#f0f2f5] flex items-center gap-2">
                <Search size={14} className="text-ink-400 shrink-0" />
                <input
                  className="flex-1 bg-transparent border-0 outline-none text-sm py-1"
                  placeholder="Search messages..."
                  value={msgSearch}
                  onChange={e => { setMsgSearch(e.target.value); setSearchResultIdx(0) }}
                  autoFocus
                />
                {searchResults.length > 0 && (
                  <span className="text-xs text-ink-500 shrink-0">
                    {searchResultIdx + 1} of {searchResults.length}
                  </span>
                )}
                {searchResults.length > 0 && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setSearchResultIdx(prev => Math.max(0, prev - 1))}
                      className="p-1 hover:bg-ink-200 rounded"
                    >
                      <ArrowLeft size={14} />
                    </button>
                    <button
                      onClick={() => setSearchResultIdx(prev => Math.min(searchResults.length - 1, prev + 1))}
                      className="p-1 hover:bg-ink-200 rounded"
                    >
                      <ArrowLeft size={14} className="rotate-180" />
                    </button>
                  </div>
                )}
                {msgSearch && (
                  <button onClick={() => { setMsgSearch(''); setSearchResultIdx(0) }} className="p-1 hover:bg-ink-200 rounded shrink-0">
                    <X size={14} />
                  </button>
                )}
              </div>
            )}

            {/* Messages - WhatsApp background */}
            <div
              ref={msgContainerRef}
              className="flex-1 overflow-y-auto px-4 py-4 bg-[#efeae2] dark:bg-ink-900/80"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 5 L35 12 L30 11 L25 12 Z\' fill=\'%23ffffff\' opacity=\'0.4\'/%3E%3C/svg%3E")' }}
            >
              {filteredMessages.length === 0 && !msgSearch && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-ink-500 text-sm">
                    <MessageCircle size={32} className="mx-auto mb-2 text-ink-300" />
                    {lang === 'en' ? 'No messages yet. Say hello!' : 'Aucun message. Dites bonjour!'}
                  </div>
                </div>
              )}

              {filteredMessages.length === 0 && msgSearch && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-ink-500 text-sm">
                    <Search size={32} className="mx-auto mb-2 text-ink-300" />
                    No messages match "{msgSearch}"
                  </div>
                </div>
              )}

              {filteredMessages.map((msg, idx) => {
                const isMe = msg.sender?.uid === user?.uid
                const showAvatar = !isMe && (idx === 0 || filteredMessages[idx - 1]?.sender?.uid !== msg.sender?.uid)
                const prevSame = idx > 0 && filteredMessages[idx - 1]?.sender?.uid === msg.sender?.uid
                const showDate = idx === 0 || new Date(msg.timestamp).toDateString() !== new Date(filteredMessages[idx - 1].timestamp).toDateString()
                const isHighlighted = msgSearch && msg.text?.toLowerCase().includes(msgSearch.toLowerCase())

                return (
                  <div key={msg.id} id={`msg-${msg.id}`}>
                    {showDate && (
                      <div className="flex justify-center my-3">
                        <span className="text-[11px] bg-white/80 backdrop-blur shadow-sm px-3 py-1 rounded-full text-ink-600">
                          {formatDateSeparator(msg.timestamp, lang)}
                        </span>
                      </div>
                    )}
                    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} ${prevSame ? 'mt-0.5' : 'mt-2'} group`}>
                      {!isMe && showAvatar && (
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 mr-2 self-end cursor-pointer" onClick={() => startReply(msg)}>
                          {msg.sender?.avatar ? (
                            <img src={msg.sender.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-brand-200 flex items-center justify-center">
                              <UserIcon size={14} className="text-brand-700" />
                            </div>
                          )}
                        </div>
                      )}
                      {!isMe && !showAvatar && <div className="w-8 shrink-0 mr-2" />}

                      <div className={`max-w-[85%] sm:max-w-[75%] ${isMe ? 'order-1' : 'order-2'}`}>
                        {!isMe && activeConv.type === 'group' && showAvatar && (
                          <div className="text-[11px] font-medium mb-0.5 ml-1 flex items-center gap-1">
                            <span className="text-brand-700">{msg.sender?.name}</span>
                            {msg.sender?.role && ROLE_BADGES[msg.sender.role] && (
                              <span className={`${ROLE_BADGES[msg.sender.role].class} px-1.5 py-0.5 rounded-full text-[9px] font-normal`}>
                                {ROLE_BADGES[msg.sender.role].label}
                              </span>
                            )}
                          </div>
                        )}
                        <div
                          className={`relative px-3 py-2 text-sm leading-relaxed shadow-sm cursor-pointer group ${
                            isMe
                              ? 'bg-[#d9fdd3] text-ink-800 rounded-2xl rounded-br-sm'
                              : 'bg-white text-ink-800 rounded-2xl rounded-bl-sm'
                          } ${isHighlighted ? 'ring-2 ring-accent-400' : ''}`}
                          onClick={() => startReply(msg)}
                        >
                          {/* Reply preview */}
                          {msg.repliedTo && (
                            <div className={`mb-1.5 pl-2 border-l-2 ${isMe ? 'border-brand-400' : 'border-ink-300'} rounded-sm`}>
                              <div className="text-[10px] font-medium text-ink-500">{msg.repliedTo.sender?.name || 'Unknown'}</div>
                              <div className="text-[11px] text-ink-400 truncate">{msg.repliedTo.text}</div>
                            </div>
                          )}
                          <div className="whitespace-pre-wrap break-words">{msg.text}</div>
                          <div className={`flex items-center gap-1 justify-end mt-1 ${isMe ? 'text-ink-400' : 'text-ink-400'}`}>
                            <span className="text-[10px] leading-none">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isMe && <StatusIcon status={msg.status} />}
                          </div>
                          {/* Reply button on hover */}
                          <div className={`absolute -top-6 right-0 hidden group-hover:flex items-center gap-1 bg-white shadow-lg rounded-lg px-2 py-1 border border-ink-100 ${isMe ? 'right-0' : 'left-0'}`}>
                            <button onClick={(e) => { e.stopPropagation(); startReply(msg) }} className="p-1 hover:bg-ink-100 rounded text-ink-500" title="Reply">
                              <Reply size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply preview bar */}
            {replyTo && (
              <div className="px-4 py-2 bg-[#f0f2f5] border-t border-ink-100 flex items-center gap-2 shrink-0">
                <div className="flex-1 flex items-center gap-2 min-w-0">
                  <Reply size={14} className="text-brand-600 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-medium text-brand-600">Replying to {replyTo.sender?.name || 'someone'}</div>
                    <div className="text-xs text-ink-500 truncate">{replyTo.text}</div>
                  </div>
                </div>
                <button onClick={() => setReplyTo(null)} className="p-1 hover:bg-ink-200 rounded shrink-0">
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Input - WhatsApp style */}
            <div className="px-4 py-2.5 bg-[#f0f2f5] border-t border-ink-100 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowEmoji(!showEmoji)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-ink-200 text-ink-500 shrink-0"
                >
                  <Smile size={22} />
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-ink-200 text-ink-500 shrink-0">
                  <Paperclip size={20} />
                </button>
                <input
                  ref={inputRef}
                  className="flex-1 rounded-2xl bg-white border-0 px-4 py-2.5 text-sm shadow-sm outline-none focus:ring-2 focus:ring-brand-300"
                  placeholder={lang === 'en' ? 'Type a message' : 'Tapez un message'}
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                {text.trim() ? (
                  <button
                    onClick={handleSend}
                    className="w-11 h-11 rounded-full bg-brand-600 hover:bg-brand-700 text-white flex items-center justify-center transition shrink-0"
                  >
                    <Send size={18} />
                  </button>
                ) : (
                  <button className="w-11 h-11 rounded-full bg-ink-100 hover:bg-ink-200 text-ink-500 flex items-center justify-center shrink-0">
                    <Mic size={20} />
                  </button>
                )}
              </div>
              {/* Emoji picker */}
              {showEmoji && (
                <div className="mt-2 p-2 bg-white rounded-xl border border-ink-100 shadow-lg flex flex-wrap gap-1">
                  {EMOJIS.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => addEmoji(emoji)}
                      className="w-8 h-8 hover:bg-ink-100 rounded-lg text-lg flex items-center justify-center"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* New Conversation Modal */}
      {showNewConv && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowNewConv(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100">
              <h3 className="font-display font-bold text-lg">
                {lang === 'en' ? 'New Conversation' : 'Nouvelle conversation'}
              </h3>
              <button onClick={() => setShowNewConv(false)} className="p-1 hover:bg-ink-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {selectedUsers.length > 1 && (
                <div>
                  <label className="label">Group name</label>
                  <input
                    className="input"
                    placeholder={lang === 'en' ? 'e.g. Compiler Design Group' : 'Ex: Groupe Compilation'}
                    value={newConvName}
                    onChange={e => setNewConvName(e.target.value)}
                  />
                </div>
              )}
              <div>
                <label className="label">
                  {lang === 'en' ? 'Participants' : 'Participants'}
                  {selectedUsers.length > 0 && (
                    <span className="text-ink-400 font-normal ml-1">({selectedUsers.length} selected)</span>
                  )}
                </label>
                <div className="relative mb-2">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input
                    className="input pl-8 text-sm"
                    placeholder={lang === 'en' ? 'Search users...' : 'Rechercher...'}
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                  />
                </div>
                {selectedUsers.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {selectedUsers.map(u => (
                      <span key={u.uid} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-medium">
                        {u.name}
                        <button onClick={() => toggleUser(u)} className="hover:text-red-500"><X size={12} /></button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="max-h-40 overflow-y-auto border border-ink-100 rounded-xl divide-y divide-ink-50">
                  {filteredUsers.map(u => (
                    <button
                      key={u.uid}
                      onClick={() => toggleUser(u)}
                      className={`w-full flex items-center gap-3 px-3 py-3 min-h-[44px] hover:bg-ink-50 text-left transition ${
                        selectedUsers.find(p => p.uid === u.uid) ? 'bg-brand-50' : ''
                      }`}
                    >
                      {u.avatar ? (
                        <img src={u.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                          <UserIcon size={14} className="text-brand-600" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate flex items-center gap-1">
                          {u.name}
                          {u.role && ROLE_BADGES[u.role] && (
                            <span className={`${ROLE_BADGES[u.role].class} px-1.5 py-0.5 rounded-full text-[9px] font-normal`}>
                              {ROLE_BADGES[u.role].label}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-ink-500">{u.email || ''}</div>
                      </div>
                      {selectedUsers.find(p => p.uid === u.uid) && (
                        <Check size={16} className="text-brand-600 shrink-0" />
                      )}
                    </button>
                  ))}
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-6 text-ink-500 text-sm">
                      {lang === 'en' ? 'No users found' : 'Aucun utilisateur trouvé'}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={handleCreateConversation}
                disabled={selectedUsers.length === 0}
                className="btn-primary w-full py-3 min-h-[44px]"
              >
                <MessageCircle size={16} />
                {selectedUsers.length === 0
                  ? 'Select participants'
                  : selectedUsers.length === 1
                    ? 'Start Chat'
                    : `Create Group (${selectedUsers.length} members)`
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}