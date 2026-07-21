import { useState } from 'react'
import toast from 'react-hot-toast'
import { GraduationCap, MapPin, Briefcase, Linkedin, Quote, Plus, X, Search, Mail, Globe } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import { useData } from '@/context/DataContext'
import { useAuth } from '@/context/AuthContext'
import { useLang } from '@/context/LanguageContext'

export default function Alumni() {
  const { alumni, registerAlumni } = useData()
  const { user } = useAuth()
  const { lang } = useLang()
  const [search, setSearch] = useState('')
  const [showRegister, setShowRegister] = useState(false)
  const [form, setForm] = useState({ name: user?.name || '', graduationYear: '', program: '', email: user?.email || '', company: '', position: '', linkedin: '', testimonial: '' })

  const filtered = alumni.filter(a =>
    !search.trim() || a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.company?.toLowerCase().includes(search.toLowerCase()) ||
    a.program?.toLowerCase().includes(search.toLowerCase())
  )

  const handleRegister = (e) => {
    e.preventDefault()
    if (!form.name || !form.graduationYear || !form.program) return toast.error(lang === 'en' ? 'Please fill required fields' : 'Remplissez les champs requis')
    registerAlumni(form)
    setShowRegister(false)
    setForm({ name: '', graduationYear: '', program: '', email: '', company: '', position: '', linkedin: '', testimonial: '' })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={lang === 'en' ? 'Alumni Network' : 'Réseau des anciens'}
        subtitle={lang === 'en' ? 'Connect with IUGET graduates worldwide' : 'Connectez-vous avec les diplômés'}
        actions={<button onClick={() => setShowRegister(true)} className="btn-primary"><Plus size={16} /> {lang === 'en' ? 'Register as Alumni' : "S'enregistrer"}</button>}
      />

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
        <input className="input pl-9 text-sm" placeholder={lang === 'en' ? 'Search alumni...' : 'Rechercher...'} value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(a => (
          <div key={a.id} className="card-hover">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white flex items-center justify-center shrink-0 text-lg font-bold">
                {a.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{a.name}</div>
                <div className="text-xs text-ink-500">{a.program} · {a.graduationYear}</div>
                {a.company && (
                  <div className="text-xs text-ink-600 mt-1 flex items-center gap-1">
                    <Briefcase size={10} /> {a.position} @ {a.company}
                  </div>
                )}
              </div>
            </div>
            {a.testimonial && (
              <div className="mt-3 p-3 rounded-xl bg-ink-50 text-sm text-ink-600 italic flex items-start gap-2">
                <Quote size={14} className="text-ink-300 shrink-0 mt-0.5" />
                "{a.testimonial}"
              </div>
            )}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-ink-100">
              {a.email && <a href={`mailto:${a.email}`} className="p-1.5 rounded-lg hover:bg-ink-100 text-ink-400 hover:text-brand-600"><Mail size={14} /></a>}
              {a.linkedin && <a href={a.linkedin} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-ink-100 text-ink-400 hover:text-blue-600"><Linkedin size={14} /></a>}
            </div>
          </div>
        ))}
      </div>

      {showRegister && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowRegister(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg"><GraduationCap size={20} className="inline mr-2 text-brand-600" />{lang === 'en' ? 'Alumni Registration' : "Enregistrement ancien"}</h3>
              <button onClick={() => setShowRegister(false)} className="p-1 hover:bg-ink-100 rounded-lg"><X size={18} /></button>
            </div>
            <form onSubmit={handleRegister} className="space-y-4">
              <div><label className="label">{lang === 'en' ? 'Full Name' : 'Nom complet'} *</label><input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">{lang === 'en' ? 'Graduation Year' : 'Année diplôme'} *</label><input type="number" className="input" value={form.graduationYear} onChange={e => setForm({ ...form, graduationYear: e.target.value })} required /></div>
                <div><label className="label">{lang === 'en' ? 'Program' : 'Programme'} *</label><input className="input" value={form.program} onChange={e => setForm({ ...form, program: e.target.value })} required /></div>
              </div>
              <div><label className="label">Email</label><input type="email" className="input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">{lang === 'en' ? 'Company' : 'Entreprise'}</label><input className="input" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} /></div>
                <div><label className="label">{lang === 'en' ? 'Position' : 'Poste'}</label><input className="input" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} /></div>
              </div>
              <div><label className="label">LinkedIn</label><input className="input" value={form.linkedin} onChange={e => setForm({ ...form, linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." /></div>
              <div><label className="label">{lang === 'en' ? 'Testimonial' : 'Témoignage'}</label><textarea className="input min-h-[80px]" value={form.testimonial} onChange={e => setForm({ ...form, testimonial: e.target.value })} placeholder={lang === 'en' ? 'Share your experience at IUGET...' : 'Partagez votre expérience...'} /></div>
              <button type="submit" className="btn-primary w-full"><GraduationCap size={16} /> {lang === 'en' ? 'Register' : "S'enregistrer"}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
