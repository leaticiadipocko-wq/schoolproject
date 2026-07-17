import { useState, useMemo, useRef, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { useLang } from '@/context/LanguageContext'
import {
  Send, Search, ArrowLeft, Phone, Video, MoreVertical,
  Check, CheckCheck, User as UserIcon, Users, Plus, X, MessageCircle,
} from 'lucide-react'

function formatTime(ts) {
  const d = new Date(ts)
  const now = new Date()
  const diff = now - d
  const oneDay = 86400000
  if (diff < oneDay && d.getDate() === now.getDate()) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  if (diff < 2 * oneDay) return 'Yesterday'
  return d.toLocaleDateString([], { day: 'numeric', month: 'short' })
}

function formatLastSeen(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  const now = new Date()
  const diff = now - d
  if (diff < 60000) return 'Online'
  if (diff < 3600000) return `Active ${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `Active ${Math.floor(diff / 3600000)}h ago`
  return `Last seen ${d.toLocaleDateString()}`
}

export default function Chat() {
  const { user } = useAuth()
  const { conversations, messages, sendMessage, createConversation, markConversationRead, users, addNewUser } = useData()
  const { lang } = useLang()
  const [activeConv, setActiveConv] = useState(null)
  const [showList, setShowList] = useState(true)
  const [text, setText] = useState('')
  const [search, setSearch] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

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

  const isOnline = activeConv ? Math.random() > 0.3 : false

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

  const handleSend = () => {
    if (!text.trim() || !activeConv) return
    sendMessage(activeConv.id, text)
    setText('')
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
    return (users || []).filter(u => {
      const key = u?.uid || u?.id || u?.uuid
      if (!key) return false
      if (key === user?.uid || key === user?.id) return false
      if (seen[key]) return false
      seen[key] = true
      return true
    })
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
    return convMsgs[convMsgs.length - 1].text
  }

  const latestTimestamp = (conv) => {
    const convMsgs = messages.filter(m => m.conversationId === conv.id)
    if (convMsgs.length === 0) return conv.updatedAt
    return convMsgs[convMsgs.length - 1].timestamp
  }

  return (
    <div className="h-[calc(100vh-5rem)] flex -m-6 overflow-hidden bg-ink-50/50">
      {/* Conversation List */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-ink-100 bg-white flex flex-col shrink-0 ${showList ? 'flex' : 'hidden md:flex'}`}>
        {/* Header */}
        <div className="p-4 border-b border-ink-100 bg-white">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-lg">
              {lang === 'en' ? 'Chat' : 'Discussion'}
            </h2>
            {totalUnread > 0 && (
              <span className="badge bg-accent-600 text-white text-xs px-2 py-0.5 rounded-full">
                {totalUnread} {lang === 'en' ? 'new' : 'nouveaux'}
              </span>
            )}
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              className="input pl-9 text-sm"
              placeholder={lang === 'en' ? 'Search conversations...' : 'Rechercher...'}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowNewConv(true)}
            className="mt-3 w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-medium text-sm transition"
          >
            <Plus size={16} />
            {lang === 'en' ? 'New Conversation' : 'Nouvelle conversation'}
          </button>
        </div>

        {/* Scrollable list */}
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
          ) : filteredConvs.map(conv => (
            <button
              key={conv.id}
              onClick={() => openConversation(conv)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-ink-50 transition border-b border-ink-50 text-left ${
                activeConv?.id === conv.id ? 'bg-brand-50/60' : ''
              }`}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                {conv.type === 'direct' && conv.participants?.find(p => p.uid !== user?.uid)?.avatar ? (
                  <img
                    src={conv.participants.find(p => p.uid !== user?.uid).avatar}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center">
                    <Users size={20} className="text-brand-600" />
                  </div>
                )}
                {conv.type === 'group' && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-brand-600 border-2 border-white flex items-center justify-center">
                    <Users size={10} className="text-white" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-sm truncate">
                    {conv.type === 'direct'
                      ? conv.participants?.find(p => p.uid !== user?.uid)?.name || conv.name
                      : conv.name
                    }
                  </span>
                  <span className="text-[10px] text-ink-400 shrink-0">
                    {formatTime(latestTimestamp(conv))}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-xs text-ink-500 truncate flex-1">
                    {latestMessage(conv)}
                  </span>
                  {conv.unread > 0 && (
                    <span className="bg-accent-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`flex-1 flex flex-col bg-white ${showList ? 'hidden md:flex' : 'flex'}`}>
        {!activeConv ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-4">
                <Users size={36} className="text-brand-400" />
              </div>
              <div className="font-display font-bold text-xl text-ink-800">
                {lang === 'en' ? 'SIARM Chat' : 'Discussion SIARM'}
              </div>
              <div className="text-ink-500 text-sm mt-2 max-w-xs">
                {lang === 'en'
                  ? 'Select a conversation or start a new chat with your lecturers and classmates'
                  : 'Sélectionnez une conversation ou démarrez une nouvelle discussion'}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-ink-100 bg-white shrink-0">
              <button
                onClick={() => setShowList(true)}
                className="md:hidden p-1 -ml-1 text-ink-600 hover:text-ink-900"
              >
                <ArrowLeft size={20} />
              </button>

              {convAvatar ? (
                <img src={convAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                  <Users size={18} className="text-brand-600" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{convName}</div>
                <div className="text-[11px] text-ink-500">
                  {activeConv.type === 'group'
                    ? `${activeConv.participants?.length || 0} participants`
                    : formatLastSeen(activeConv.updatedAt)
                  }
                </div>
              </div>

              <button className="p-2 rounded-xl hover:bg-ink-100 text-ink-600">
                <Phone size={18} />
              </button>
              <button className="p-2 rounded-xl hover:bg-ink-100 text-ink-600">
                <Video size={18} />
              </button>
              <button className="p-2 rounded-xl hover:bg-ink-100 text-ink-600">
                <MoreVertical size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-[#efeae2] dark:bg-ink-900/80"
              style={{ backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            >
              {activeMessages.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-ink-500 text-sm">
                    {lang === 'en' ? 'No messages yet. Say hello!' : 'Aucun message. Dites bonjour!'}
                  </div>
                </div>
              )}

              {/* Date separator for first message */}
              {activeMessages.length > 0 && (
                <div className="flex justify-center mb-3">
                  <span className="text-[11px] bg-ink-100/80 px-3 py-1 rounded-full text-ink-600 shadow-sm">
                    {new Date(activeMessages[0].timestamp).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', {
                      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </span>
                </div>
              )}

              {activeMessages.map((msg, idx) => {
                const isMe = msg.sender?.uid === user?.uid
                const showAvatar = !isMe && (idx === 0 || activeMessages[idx - 1]?.sender?.uid !== msg.sender?.uid)
                const isLast = idx === activeMessages.length - 1
                const prevSame = idx > 0 && activeMessages[idx - 1]?.sender?.uid === msg.sender?.uid

                // Date separators
                const showDate = idx > 0 && new Date(msg.timestamp).toDateString() !== new Date(activeMessages[idx - 1].timestamp).toDateString()

                return (
                  <div key={msg.id}>
                    {showDate && (
                      <div className="flex justify-center my-3">
                        <span className="text-[11px] bg-ink-100/80 px-3 py-1 rounded-full text-ink-600 shadow-sm">
                          {new Date(msg.timestamp).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', {
                            weekday: 'long', day: 'numeric', month: 'long'
                          })}
                        </span>
                      </div>
                    )}
                    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} ${prevSame ? 'mt-0.5' : 'mt-2'}`}>
                      {!isMe && showAvatar && (
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 mr-2 self-end">
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

                      <div className={`max-w-[75%] ${isMe ? 'order-1' : 'order-2'}`}>
                        {/* Sender name for group messages */}
                        {!isMe && activeConv.type === 'group' && showAvatar && (
                          <div className="text-[11px] font-medium text-brand-700 mb-0.5 ml-1">
                            {msg.sender?.name}
                          </div>
                        )}
                        <div className={`relative px-3 py-2 text-sm leading-relaxed shadow-sm ${
                          isMe
                            ? 'bg-brand-600 text-white rounded-2xl rounded-br-sm'
                            : 'bg-white text-ink-800 rounded-2xl rounded-bl-sm'
                        }`}>
                          <div className="whitespace-pre-wrap break-words">{msg.text}</div>
                          <div className={`flex items-center gap-1 justify-end mt-1 ${isMe ? 'text-white/70' : 'text-ink-400'}`}>
                            <span className="text-[10px] leading-none">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isMe && (
                              isLast
                                ? <CheckCheck size={12} className="text-accent-300" />
                                : <Check size={12} className="text-white/70" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-ink-100 bg-white shrink-0">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  className="input flex-1 rounded-2xl bg-ink-50 border-0 px-4 py-3"
                  placeholder={lang === 'en' ? 'Type a message...' : 'Tapez un message...'}
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  onClick={handleSend}
                  disabled={!text.trim()}
                  className="w-11 h-11 rounded-full bg-brand-600 hover:bg-brand-700 disabled:bg-ink-300 text-white flex items-center justify-center transition shrink-0"
                >
                  <Send size={18} />
                </button>
              </div>
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
                    <span className="text-ink-400 font-normal ml-1">({selectedUsers.length} {lang === 'en' ? 'selected' : 'selectionnes'})</span>
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
                      className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-ink-50 text-left transition ${
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
                        <div className="text-sm font-medium truncate">{u.name}</div>
                        <div className="text-[11px] text-ink-500">{(u.role || u.role || '')}{u.email ? ` · ${u.email}` : ''}</div>
                      </div>
                      {selectedUsers.find(p => p.uid === u.uid) && (
                        <Check size={16} className="text-brand-600 shrink-0" />
                      )}
                    </button>
                  ))}
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-6 text-ink-500 text-sm">
                      {lang === 'en' ? 'No users found' : 'Aucun utilisateur trouve'}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={handleCreateConversation}
                disabled={selectedUsers.length === 0}
                className="btn-primary w-full py-2.5"
              >
                <MessageCircle size={16} />
                {selectedUsers.length === 0
                  ? (lang === 'en' ? 'Select participants' : 'Selectionnez des participants')
                  : selectedUsers.length === 1
                    ? (lang === 'en' ? 'Start Chat' : 'Demarrer la discussion')
                    : (lang === 'en' ? `Create Group (${selectedUsers.length} members)` : `Creer le groupe (${selectedUsers.length} membres)`)
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}