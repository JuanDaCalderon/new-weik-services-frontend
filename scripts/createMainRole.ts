import dotenv from 'dotenv';
dotenv.config();
import {cert, initializeApp, getApps} from 'firebase-admin/app';
import {getFirestore, Timestamp, DocumentReference} from 'firebase-admin/firestore';
import {readFileSync} from 'fs';
import {
  PERMISOS_MAP_IDS,
  FIRESTORE_PERMISOS_PATH,
  FIRESTORE_ROLES_PATH,
  MAIN_ROL_ID,
  MAIN_ROL_NAME
} from '../src/constants';
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
  const permisosCollection = db.collection(FIRESTORE_PERMISOS_PATH);
  const rolesCollection = db.collection(FIRESTORE_ROLES_PATH);

  const permisosIds = Object.values(PERMISOS_MAP_IDS);

  const permisosSnapshot = await Promise.all(
    permisosIds.map((_, i) => permisosCollection.doc((i + 1).toString()).get())
  );

  const permisosFaltantes = permisosSnapshot.filter((docSnap) => !docSnap.exists);

  if (permisosFaltantes.length > 0) {
    console.error('❌ No se encontraron todos los permisos necesarios. Abortando...');
    return;
  }

  const permisosRefs: DocumentReference[] = permisosSnapshot.map((snap) => snap.ref);

  const rolRef = rolesCollection.doc(MAIN_ROL_ID);
  const existingRol = await rolRef.get();

  if (existingRol.exists) {
    console.log(`ℹ️ El rol con ID ${MAIN_ROL_ID} ya existe. No se realizará ninguna acción.`);
    return;
  }

  await rolRef.set({
    rol: MAIN_ROL_NAME,
    descripcion: MAIN_ROL_NAME,
    fechaCreacion: Timestamp.now(),
    fechaActualizacion: Timestamp.now(),
    isMainRol: true,
    permisos: permisosRefs
  });

  console.log(`✅ Rol "${MAIN_ROL_NAME}" creado exitosamente con ${permisosRefs.length} permisos.`);
};

run().catch(console.error);
