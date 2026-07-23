import { useState } from 'react'
import toast from 'react-hot-toast'
import { Search, BookOpen, Plus, X, CheckCircle, Clock, AlertTriangle, Bell } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { useLang } from '@/context/LanguageContext'

export default function Library() {
  const { user } = useAuth()
  const { libraryBooks, borrowings, borrowBook, returnBook, addLibraryBook, reservations = [] } = useData()
  const { lang } = useLang()
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('catalog')
  const [showAddBook, setShowAddBook] = useState(false)
  const [bookForm, setBookForm] = useState({ title: '', author: '', isbn: '', category: '', copies: 1 })

  const filtered = libraryBooks.filter(b =>
    !search.trim() || b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase()) ||
    (b.isbn || '').includes(search)
  )

  const myBorrowings = borrowings.filter(b => b.userId === user?.uid)
  const myReservations = reservations.filter(r => r.userId === user?.uid)

  const handleBorrow = async (book) => {
    try {
      await borrowBook({ bookId: book.id, userId: user?.uid, userName: user?.name })
      toast.success(`Borrowed "${book.title}"`)
    } catch (e) {
      toast.error(e.message)
    }
  }

  const handleReserve = (book) => {
    if (window.confirm(`Reserve "${book.title}"? You'll be notified when a copy becomes available.`)) {
      const r = {
        id: `res-${Date.now()}`,
        bookId: book.id,
        bookTitle: book.title,
        userId: user?.uid,
        userName: user?.name,
        reservedAt: new Date().toISOString(),
        status: 'waiting',
      }
      const existing = [...(typeof window.__reservations !== 'undefined' ? window.__reservations : [])]
      existing.push(r)
      window.__reservations = existing
      toast.success(`"${book.title}" reserved! We'll notify you when available.`)
    }
  }

  const handleAddBook = (e) => {
    e.preventDefault()
    addLibraryBook({ ...bookForm, copies: parseInt(bookForm.copies), available: parseInt(bookForm.copies), shelf: 'New' })
    setShowAddBook(false)
    setBookForm({ title: '', author: '', isbn: '', category: '', copies: 1 })
    toast.success('Book added to catalog')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={lang === 'en' ? 'Library' : 'Bibliothèque'}
        subtitle={lang === 'en' ? 'Book catalog & borrowing' : 'Catalogue et emprunts'}
        actions={user?.role === 'admin' || user?.role === 'staff' ? (
          <button onClick={() => setShowAddBook(true)} className="btn-primary"><Plus size={16} /> Add Book</button>
        ) : null}
      />

      <div className="flex gap-1 bg-ink-100 rounded-xl p-1 w-fit flex-wrap">
        {[
          { id:'catalog', labelEn:'Catalog', labelFr:'Catalogue' },
          { id:'borrowed', labelEn:'My Borrowings', labelFr:'Mes emprunts' },
          { id:'reserved', labelEn:'Reservations', labelFr:'Réservations' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === t.id ? 'bg-white shadow-soft text-ink-900' : 'text-ink-500 hover:text-ink-700'}`}
          >{lang === 'en' ? t.labelEn : t.labelFr}</button>
        ))}
      </div>

      {tab === 'catalog' && (
        <>
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input className="input pl-9 text-sm" placeholder={lang === 'en' ? 'Search by title, author, or ISBN...' : 'Rechercher...'} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(book => (
              <div key={book.id} className="card-hover">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
                    <BookOpen size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{book.title}</div>
                    <div className="text-xs text-ink-500">{book.author}</div>
                    <div className="text-[11px] text-ink-400 mt-0.5">ISBN: {book.isbn} · Shelf: {book.shelf}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-ink-100">
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`px-2 py-0.5 rounded-full font-medium ${book.available > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {book.available}/{book.copies} avail.
                    </span>
                    <span className="text-ink-400">{book.category}</span>
                  </div>
                  {book.available > 0 ? (
                    <button onClick={() => handleBorrow(book)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 transition"
                    >Borrow</button>
                  ) : (
                    <button onClick={() => handleReserve(book)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-amber-600 text-white font-medium hover:bg-amber-700 transition"
                    ><Bell size={12} className="inline mr-1" />Reserve</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'borrowed' && (
        <div className="space-y-3">
          {myBorrowings.length === 0 ? (
            <div className="card text-center py-12 text-ink-500">
              <BookOpen size={40} className="mx-auto text-ink-300 mb-3" />
              <p>{lang === 'en' ? 'No books borrowed yet.' : 'Aucun livre emprunté.'}</p>
            </div>
          ) : myBorrowings.map(br => {
            const book = libraryBooks.find(b => b.id === br.bookId)
            const overdue = new Date(br.dueDate) < new Date() && !br.returned
            return (
              <div key={br.id} className="card-hover flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${br.returned ? 'bg-emerald-100 text-emerald-600' : overdue ? 'bg-red-100 text-red-600' : 'bg-brand-100 text-brand-600'}`}>
                  {br.returned ? <CheckCircle size={20} /> : overdue ? <AlertTriangle size={20} /> : <Clock size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{book?.title || 'Unknown'}</div>
                  <div className="text-xs text-ink-500">Borrowed: {br.borrowDate} · Due: {br.dueDate}</div>
                  {br.returned && <div className="text-xs text-emerald-600">Returned: {br.returnedDate}</div>}
                  {overdue && <div className="text-xs text-red-600 font-medium">OVERDUE</div>}
                </div>
                {!br.returned && (
                  <button onClick={() => returnBook(br.id)} className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition">Return</button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {tab === 'reserved' && (
        <div className="space-y-3">
          {myReservations.length === 0 ? (
            <div className="card text-center py-12 text-ink-500">
              <Bell size={40} className="mx-auto text-ink-300 mb-3" />
              <p>{lang === 'en' ? 'No reservations.' : 'Aucune réservation.'}</p>
              <p className="text-xs text-ink-400 mt-2">{lang === 'en' ? 'Reserve a book when all copies are borrowed.' : 'Réservez un livre quand tous les exemplaires sont empruntés.'}</p>
            </div>
          ) : myReservations.map(r => (
            <div key={r.id} className="card-hover flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Bell size={20} />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">{r.bookTitle}</div>
                <div className="text-xs text-ink-500">
                  Reserved {new Date(r.reservedAt).toLocaleDateString()} · Status: <span className="font-medium text-amber-700">Waiting</span>
                </div>
                <div className="text-[11px] text-ink-400 mt-0.5">We'll notify you when a copy is available</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddBook && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowAddBook(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg">{lang === 'en' ? 'Add Book' : 'Ajouter un livre'}</h3>
              <button onClick={() => setShowAddBook(false)} className="p-1 hover:bg-ink-100 rounded-lg"><X size={18} /></button>
            </div>
            <form onSubmit={handleAddBook} className="space-y-4">
              <div><label className="label">Title</label><input className="input" value={bookForm.title} onChange={e => setBookForm({ ...bookForm, title: e.target.value })} required /></div>
              <div><label className="label">Author</label><input className="input" value={bookForm.author} onChange={e => setBookForm({ ...bookForm, author: e.target.value })} required /></div>
              <div><label className="label">ISBN</label><input className="input" value={bookForm.isbn} onChange={e => setBookForm({ ...bookForm, isbn: e.target.value })} /></div>
              <div><label className="label">Category</label><input className="input" value={bookForm.category} onChange={e => setBookForm({ ...bookForm, category: e.target.value })} /></div>
              <div><label className="label">Copies</label><input type="number" min="1" className="input" value={bookForm.copies} onChange={e => setBookForm({ ...bookForm, copies: e.target.value })} /></div>
              <button type="submit" className="btn-primary w-full"><Plus size={16} /> Add to Catalog</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
