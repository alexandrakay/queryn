import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

export async function getSessions(uid) {
  const q = query(collection(db, `users/${uid}/sessions`), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export async function saveSession(uid, sessionData) {
  const ref = await addDoc(collection(db, `users/${uid}/sessions`), {
    ...sessionData,
    createdAt: serverTimestamp(),
  })
  return ref.id
}
