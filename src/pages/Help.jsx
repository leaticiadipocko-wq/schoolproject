import { useState, useMemo } from 'react'
import {
  Search, ChevronDown, HelpCircle, User, Wallet, FileText, Wrench, Megaphone,
  Mail, Phone, MessageCircle, ExternalLink,
} from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import { useLang } from '@/context/LanguageContext'

/* Categorised FAQs — bilingual */
const FAQ = {
  account: {
    icon: User,
    title:    { en: 'Account & sign-in', fr: 'Compte & connexion' },
    items: [
      {
        q: { en: 'I forgot my password — what should I do?',
             fr: 'J\'ai oublié mon mot de passe — que faire ?' },
        a: { en: 'Click "Forgot password?" on the login screen and enter your university email. A reset link will be sent to that address. The link expires in 30 minutes.',
             fr: 'Cliquez sur « Mot de passe oublié ? » à la page de connexion et entrez votre e-mail universitaire. Un lien de réinitialisation vous sera envoyé et expirera après 30 minutes.' },
      },
      {
        q: { en: 'How do I change my email?',
             fr: 'Comment puis-je changer mon adresse e-mail ?' },
        a: { en: 'Email changes must be requested at the registrar\'s office, who will update your university account. You can update your personal email on the Profile page.',
             fr: 'Les changements d\'e-mail doivent être demandés au bureau du registrar, qui mettra votre compte à jour. Vous pouvez modifier votre e-mail personnel depuis la page Profil.' },
      },
      {
        q: { en: 'Can I enable two-factor authentication?',
             fr: 'Puis-je activer l\'authentification à deux facteurs ?' },
        a: { en: 'Yes — go to Profile > Security and switch on Two-factor authentication. You will receive a 6-digit code on your phone for every new sign-in.',
             fr: 'Oui — rendez-vous dans Profil > Sécurité et activez l\'authentification à deux facteurs. Vous recevrez un code à 6 chiffres sur votre téléphone pour chaque nouvelle connexion.' },
      },
    ],
  },
  tuition: {
    icon: Wallet,
    title:    { en: 'Tuition & payment', fr: 'Scolarité & paiement' },
    items: [
      {
        q: { en: 'Which payment methods are accepted?',
             fr: 'Quels modes de paiement sont acceptés ?' },
        a: { en: 'SIARM supports MTN Mobile Money, Orange Money, Visa/Mastercard, PayPal, and bank transfer (Afriland First Bank).',
             fr: 'SIARM accepte MTN Mobile Money, Orange Money, Visa/Mastercard, PayPal et le virement bancaire (Afriland First Bank).' },
      },
      {
        q: { en: 'Are receipts valid for tax purposes?',
             fr: 'Les reçus sont-ils valables fiscalement ?' },
        a: { en: 'Yes — every receipt issued through SIARM carries a QR code and a unique reference that can be verified at verify.iuget.cm. They are accepted as proof of tuition payment by Cameroonian tax authorities.',
             fr: 'Oui — chaque reçu émis par SIARM contient un QR code et une référence unique vérifiable sur verify.iuget.cm. Ils sont acceptés comme preuve de paiement de la scolarité par l\'administration fiscale camerounaise.' },
      },
      {
        q: { en: 'Can I pay in two instalments?',
             fr: 'Puis-je payer en deux tranches ?' },
        a: { en: 'Yes — 50% at registration and 50% before the final examinations. Both instalments can be paid by the same or different channels.',
             fr: 'Oui — 50 % à l\'inscription et 50 % avant les examens finaux. Les deux tranches peuvent être réglées par le même mode ou par des modes différents.' },
      },
      {
        q: { en: 'Is my PIN or card stored after payment?',
             fr: 'Mon code PIN ou ma carte sont-ils conservés après le paiement ?' },
        a: { en: 'No. SIARM never stores PIN codes, passwords or card data. Credentials are forwarded directly to the provider and erased from memory once the transaction completes.',
             fr: 'Non. SIARM ne conserve jamais les codes PIN, mots de passe ou données de carte. Les identifiants sont transmis directement au fournisseur et effacés de la mémoire à la fin de la transaction.' },
      },
    ],
  },
  results: {
    icon: FileText,
    title:    { en: 'Results & transcripts', fr: 'Résultats & relevés' },
    items: [
      {
        q: { en: 'When are results published?',
             fr: 'Quand les résultats sont-ils publiés ?' },
        a: { en: 'Continuous-assessment (CA) results are published within 7 days of the test. Examination results are published within 21 days of the end of the examination period.',
             fr: 'Les notes de contrôle continu (CC) sont publiées dans les 7 jours suivant l\'épreuve. Les notes d\'examen sont publiées dans les 21 jours suivant la fin de la session.' },
      },
      {
        q: { en: 'How do I download an official transcript?',
             fr: 'Comment télécharger un relevé officiel ?' },
        a: { en: 'Navigate to Transcript in the sidebar, then click "Download PDF". The document carries the IUGET letterhead, registrar\'s signature line and a QR verification code.',
             fr: 'Allez dans Relevé de notes dans la barre latérale, puis cliquez sur « Télécharger PDF ». Le document comporte l\'en-tête IUGET, la signature du registrar et un QR code de vérification.' },
      },
      {
        q: { en: 'Can I print my student ID card?',
             fr: 'Puis-je imprimer ma carte d\'étudiant ?' },
        a: { en: 'Yes — open ID Card, click "PDF". The PDF is sized at standard ID-1 dimensions (85.60 × 53.98 mm) so it can be cut and laminated.',
             fr: 'Oui — ouvrez Carte étudiant, cliquez sur « PDF ». Le fichier est au format ID-1 standard (85,60 × 53,98 mm) afin d\'être découpé et plastifié.' },
      },
    ],
  },
  technical: {
    icon: Wrench,
    title:    { en: 'Technical', fr: 'Technique' },
    items: [
      {
        q: { en: 'Does SIARM work offline?',
             fr: 'SIARM fonctionne-t-il hors-ligne ?' },
        a: { en: 'Yes — once you have visited the application at least once, the most-recently-seen pages remain available offline. An amber banner at the top indicates the offline state.',
             fr: 'Oui — après une première visite, les pages récemment consultées restent disponibles hors-ligne. Une bannière ambre en haut signale l\'état hors-ligne.' },
      },
      {
        q: { en: 'Can I install SIARM on my phone?',
             fr: 'Puis-je installer SIARM sur mon téléphone ?' },
        a: { en: 'Yes — on Android Chrome an "Install SIARM" button appears. On iOS Safari, tap Share > Add to Home Screen.',
             fr: 'Oui — sur Android Chrome, un bouton « Installer SIARM » apparaît. Sur iOS Safari, touchez Partager > Sur l\'écran d\'accueil.' },
      },
      {
        q: { en: 'Which browsers are supported?',
             fr: 'Quels navigateurs sont pris en charge ?' },
        a: { en: 'Chrome, Edge, Firefox, Safari — current and previous major version. Internet Explorer is not supported.',
             fr: 'Chrome, Edge, Firefox, Safari — version actuelle et précédente. Internet Explorer n\'est pas pris en charge.' },
      },
      {
        q: { en: 'How do I open the keyboard command palette?',
             fr: 'Comment ouvrir la palette de commandes au clavier ?' },
        a: { en: 'Press Cmd+K on macOS or Ctrl+K on Windows / Linux to open the global command palette and navigate the application instantly.',
             fr: 'Appuyez sur Cmd+K sur macOS ou Ctrl+K sur Windows / Linux pour ouvrir la palette globale et naviguer instantanément dans l\'application.' },
      },
    ],
  },
  registrar: {
    icon: Megaphone,
    title:    { en: 'Registrar & administration', fr: 'Registrar & administration' },
    items: [
      {
        q: { en: 'How do I request a document not yet available?',
             fr: 'Comment demander un document non encore disponible ?' },
        a: { en: 'Use the "Contact registrar" button at the bottom of this page, or send an email directly to registrar@iuget.cm with your matricule and the document you need.',
             fr: 'Utilisez le bouton « Contacter le registrar » en bas de cette page, ou envoyez un e-mail à registrar@iuget.cm en précisant votre matricule et le document souhaité.' },
      },
      {
        q: { en: 'How are announcements distributed?',
             fr: 'Comment les annonces sont-elles diffusées ?' },
        a: { en: 'Through the Announcements page in your dashboard, by email to your university address, and as a banner on the SIARM home screen for urgent notices.',
             fr: 'Via la page Annonces du tableau de bord, par e-mail sur votre adresse universitaire, et sous forme de bannière sur l\'écran d\'accueil pour les avis urgents.' },
      },
    ],
  },
}

export default function Help() {
  const { lang, t } = useLang()
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState(null)

  // Flatten the FAQ for full-text search
  const flat = useMemo(() => {
    const out = []
    Object.entries(FAQ).forEach(([cat, group]) => {
      group.items.forEach((item, i) => {
        out.push({
          id: `${cat}-${i}`,
          cat,
          title: group.title[lang],
          icon:  group.icon,
          q: item.q[lang],
          a: item.a[lang],
        })
      })
    })
    return out
  }, [lang])

  const filtered = useMemo(() => {
    if (!query.trim()) return flat
    const q = query.toLowerCase()
    return flat.filter((it) => it.q.toLowerCase().includes(q) || it.a.toLowerCase().includes(q))
  }, [query, flat])

  // Group filtered back by category
  const grouped = useMemo(() => {
    const g = {}
    for (const it of filtered) {
      if (!g[it.cat]) g[it.cat] = { title: it.title, icon: it.icon, items: [] }
      g[it.cat].items.push(it)
    }
    return g
  }, [filtered])

  return (
    <div className="space-y-6">
      <PageHeader
        title={lang === 'en' ? 'Help & FAQ' : 'Aide & FAQ'}
        subtitle={lang === 'en' ? 'Answers to the most common questions about SIARM and IUGET.' : 'Réponses aux questions les plus courantes sur SIARM et IUGET.'}
      />

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            className="input pl-11 text-base py-3.5"
            placeholder={lang === 'en' ? 'Search the FAQ — try "tuition", "transcript", "offline"…' : 'Rechercher dans la FAQ — essayez « scolarité », « relevé », « hors-ligne »…'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
        <div className="mt-2 text-xs text-ink-500">
          {filtered.length} {lang === 'en' ? `result${filtered.length === 1 ? '' : 's'}` : `résultat${filtered.length === 1 ? '' : 's'}`} {query && `· "${query}"`}
        </div>
      </div>

      {/* FAQ categories */}
      {Object.keys(grouped).length === 0 && (
        <div className="card text-center py-10 text-ink-500">
          <HelpCircle size={28} className="mx-auto mb-2" />
          {lang === 'en' ? 'No results found. Try a different search term.' : 'Aucun résultat. Essayez un autre terme.'}
        </div>
      )}

      {Object.entries(grouped).map(([cat, group]) => {
        const Icon = group.icon
        return (
          <div key={cat} className="card">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
                <Icon size={18} />
              </div>
              <h3 className="font-display font-bold text-lg">{group.title}</h3>
            </div>
            <div className="divide-y divide-ink-100">
              {group.items.map((it) => {
                const isOpen = openId === it.id
                return (
                  <div key={it.id}>
                    <button
                      onClick={() => setOpenId(isOpen ? null : it.id)}
                      className="w-full py-3.5 flex items-center justify-between gap-3 text-left hover:text-brand-700 transition"
                    >
                      <span className="font-medium text-sm">{it.q}</span>
                      <ChevronDown size={16} className={`text-ink-400 shrink-0 transition ${isOpen ? 'rotate-180 text-brand-700' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="pb-4 pl-1 text-sm text-ink-600 leading-relaxed">
                        {it.a}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Contact card */}
      <div className="card bg-gradient-to-br from-brand-700 to-brand-900 text-white border-0">
        <div className="grid md:grid-cols-3 gap-4 items-center">
          <div className="md:col-span-2">
            <h3 className="font-display font-bold text-2xl">
              {lang === 'en' ? 'Still need help?' : 'Encore besoin d\'aide ?'}
            </h3>
            <p className="text-white/80 mt-1.5">
              {lang === 'en'
                ? 'Reach the registrar or bursary directly. We answer within one working day.'
                : 'Contactez directement le registrar ou la scolarité. Réponse sous un jour ouvré.'}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href="mailto:registrar@iuget.cm" className="bg-white text-brand-700 hover:bg-white/90 transition rounded-xl px-4 py-2.5 text-sm font-medium inline-flex items-center gap-2">
                <Mail size={16} /> registrar@iuget.cm
              </a>
              <a href="tel:+237233391212" className="bg-white/15 hover:bg-white/25 transition rounded-xl px-4 py-2.5 text-sm font-medium inline-flex items-center gap-2">
                <Phone size={16} /> +237 233 39 12 12
              </a>
              <a href="https://wa.me/237690000000" target="_blank" rel="noreferrer" className="bg-emerald-500 hover:bg-emerald-600 transition rounded-xl px-4 py-2.5 text-sm font-medium inline-flex items-center gap-2">
                <MessageCircle size={16} /> WhatsApp
              </a>
            </div>
          </div>
          <div className="text-right">
            <a href="https://iuget.cm" target="_blank" rel="noreferrer" className="text-white/80 hover:text-white text-sm inline-flex items-center gap-1.5">
              {lang === 'en' ? 'Visit IUGET website' : 'Site web IUGET'} <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
