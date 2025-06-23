import dotenv from 'dotenv';
dotenv.config();
import {cert, initializeApp, getApps} from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';
import {readFileSync} from 'fs';
import {ESTADOS, FIRESTORE_USUARIOS_PATH} from '../src/constants';
const CREDENTIALSPATH = process.env.VITE_FIREBASE_CREDENTIALS_PATH || '';

const serviceAccount = JSON.parse(readFileSync(CREDENTIALSPATH).toString());

const app = !getApps().length
  ? initializeApp({
      credential: cert(serviceAccount),
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      databaseURL: `https://${process.env.VITE_FIREBASE_DATABASE}.firebaseio.com`
    })
  : getApps()[0];

const db = getFirestore(app, process.env.VITE_FIREBASE_DATABASE || '');

const run = async () => {
  const usuariosCollection = db.collection(FIRESTORE_USUARIOS_PATH);
  const snapshot = await usuariosCollection.get();
  if (snapshot.empty) {
    console.log('🚫 No hay usuarios en la colección.');
    return;
  }
  let cambios = 0;
  for (const doc of snapshot.docs) {
    const data = doc.data();
    const estadoActual = data.estado;
    if (estadoActual === ESTADOS.online) {
      await doc.ref.update({estado: ESTADOS.offline});
      console.log(`🔄 Usuario ${doc.id} - ${data.email} actualizado a ${ESTADOS.offline}`);
      cambios++;
    }
  }
  console.log(`✔️ Actualización completa. Usuarios actualizados: ${cambios}`);
};

run().catch(console.error);
