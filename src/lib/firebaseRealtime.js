import { useEffect, useState } from 'react'
import {
  collection, doc, onSnapshot, query, orderBy, limit, where,
  enableIndexedDbPersistence, getDoc, setDoc, addDoc, updateDoc, deleteDoc,
} from 'firebase/firestore'
import { db, DEMO_MODE } from './firebase'

/**
 * Realtime helpers for SIARM. All hooks return [data, loading, error].
 *
 * Behaviour:
 *   - In DEMO_MODE every hook returns the seeded mock data immediately and
 *     does not subscribe to Firestore.
 *   - In production each hook attaches an onSnapshot listener that pushes
 *     fresh data to React state every time the collection changes — the
 *     "real-time" feel that IUGET admins expect.
 *   - Persistence is enabled (IndexedDB) so reads continue offline.
 */

/* ─── One-time IndexedDB persistence setup ────────────────── */
let persistenceInstalled = false
function ensurePersistence() {
  if (persistenceInstalled || !db) return
  persistenceInstalled = true
  enableIndexedDbPersistence(db).catch((err) => {
    // 'failed-precondition' = multiple tabs, 'unimplemented' = old browser
    console.warn('[SIARM] Firestore persistence unavailable:', err?.code)
  })
}

/* ─── Collection hook ─────────────────────────────────────── */
export function useCollection(name, opts = {}, demoFallback = []) {
  const [data, setData] = useState(demoFallback)
  const [loading, setLoading] = useState(!DEMO_MODE)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (DEMO_MODE || !db) {
      setData(demoFallback)
      setLoading(false)
      return
    }
    ensurePersistence()

    let q = collection(db, name)
    if (opts.where)   q = query(q, where(opts.where[0], opts.where[1], opts.where[2]))
    if (opts.orderBy) q = query(q, orderBy(opts.orderBy, opts.dir || 'asc'))
    if (opts.limit)   q = query(q, limit(opts.limit))

    const unsub = onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        setData(items)
        setLoading(false)
      },
      (err) => { setError(err); setLoading(false) }
    )
    return () => unsub()
  }, [name, JSON.stringify(opts)])  // eslint-disable-line

  return [data, loading, error]
}

/* ─── Document hook ───────────────────────────────────────── */
export function useDoc(path, demoFallback = null) {
  const [data, setData] = useState(demoFallback)
  const [loading, setLoading] = useState(!DEMO_MODE)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (DEMO_MODE || !db) { setData(demoFallback); setLoading(false); return }
    ensurePersistence()

    const ref = doc(db, ...path.split('/'))
    const unsub = onSnapshot(
      ref,
      (snap) => { setData(snap.exists() ? { id: snap.id, ...snap.data() } : null); setLoading(false) },
      (err) => { setError(err); setLoading(false) }
    )
    return () => unsub()
  }, [path])  // eslint-disable-line

  return [data, loading, error]
}

/* ─── Write helpers ───────────────────────────────────────── */
export async function writeDoc(path, payload) {
  if (DEMO_MODE || !db) return { id: `demo-${Date.now()}` }
  const ref = doc(db, ...path.split('/'))
  await setDoc(ref, payload, { merge: true })
  return { id: ref.id }
}

export async function pushDoc(collectionName, payload) {
  if (DEMO_MODE || !db) return { id: `demo-${Date.now()}` }
  const ref = await addDoc(collection(db, collectionName), payload)
  return { id: ref.id }
}

export async function patchDoc(path, payload) {
  if (DEMO_MODE || !db) return
  const ref = doc(db, ...path.split('/'))
  await updateDoc(ref, payload)
}

export async function removeDoc(path) {
  if (DEMO_MODE || !db) return
  const ref = doc(db, ...path.split('/'))
  await deleteDoc(ref)
}

export async function readDocOnce(path) {
  if (DEMO_MODE || !db) return null
  const ref = doc(db, ...path.split('/'))
  const snap = await getDoc(ref)
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}
