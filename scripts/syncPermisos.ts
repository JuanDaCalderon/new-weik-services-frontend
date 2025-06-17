import dotenv from 'dotenv';
dotenv.config();
import {cert, initializeApp} from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';
import {PERMISOS_MAP_IDS, PERMISOS_PATH} from '../src/constants';
import {getApps} from 'firebase-admin/app';
import {readFileSync} from 'fs';
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
  const permisosCollection = db.collection(PERMISOS_PATH);
  const permisos = Object.values(PERMISOS_MAP_IDS);

  for (let i = 0; i < permisos.length; i++) {
    const permiso = permisos[i];
    const id = (i + 1).toString();
    const existing = await permisosCollection.doc(id).get();
    if (!existing.exists) {
      const labelName = permiso.replace(/-/g, ' ');
      await permisosCollection.doc(id).set({
        permiso,
        labelName
      });
      console.log(`✅ Permiso creado [${id}]: ${permiso} - 💾: ${db.databaseId}`);
    }
  }
  console.log('✔️ Sincronización completa');
};

run().catch(console.error);
