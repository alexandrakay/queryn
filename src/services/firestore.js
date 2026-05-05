import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

export async function saveSession(uid, sessionData) {
  const ref = await addDoc(collection(db, `users/${uid}/sessions`), {
    ...sessionData,
    createdAt: serverTimestamp(),
  })
  return ref.id
}
