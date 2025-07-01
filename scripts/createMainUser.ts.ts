import dotenv from 'dotenv';
dotenv.config();
import {cert, getApps, initializeApp} from 'firebase-admin/app';
import {getFirestore, Timestamp} from 'firebase-admin/firestore';
import {getAuth} from 'firebase-admin/auth';
import {readFileSync} from 'fs';
import {
  FIRESTORE_USUARIOS_PATH,
  FIRESTORE_ROLES_PATH,
  MAIN_ROL_ID,
  MAIN_ROL_NAME,
  ESTADOS,
  MAIN_DEFAULT_PASSWORD
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
const auth = getAuth(app);

const EMAIL = 'juandacalji@gmail.com'; // se debe reemplazar por el email consumido desde la base de datos de configuracion
const NOMBRES = 'juan david'; // se debe reemplazar por los nombres consumido desde la base de datos de configuracion
const APELLIDOS = 'calderon jimenez'; // se debe reemplazar por los apellidos consumido desde la base de datos de configuracion

const MAIN_USER_DATA = {
  email: EMAIL,
  nombres: NOMBRES,
  apellidos: APELLIDOS,
  userImage: '',
  userName: `${NOMBRES} ${APELLIDOS}`,
  cargo: MAIN_ROL_NAME,
  estado: ESTADOS.offline,
  isMainUser: true
};

const getFechaNacimiento = (): Timestamp => {
  const now = new Date();
  now.setFullYear(now.getFullYear() - 18);
  return Timestamp.fromDate(now);
};

const run = async () => {
  const rolesCollection = db.collection(FIRESTORE_ROLES_PATH);
  const usuariosCollection = db.collection(FIRESTORE_USUARIOS_PATH);

  const rolRef = rolesCollection.doc(MAIN_ROL_ID);
  const rolDoc = await rolRef.get();

  if (!rolDoc.exists) {
    console.error(`❌ No se encontró el rol principal con ID=${MAIN_ROL_ID}. Abortando...`);
    return;
  }

  let authUser;

  try {
    authUser = await auth.getUserByEmail(MAIN_USER_DATA.email);
    console.log(`ℹ️ El usuario ya existe en Firebase Auth: UID=${authUser.uid}`);
  } catch (err: any) {
    if (err.code === 'auth/user-not-found') {
      authUser = await auth.createUser({
        email: MAIN_USER_DATA.email,
        password: MAIN_DEFAULT_PASSWORD
      });
      console.log(`✅ Usuario creado en Auth con UID=${authUser.uid}`);
    } else {
      console.error('🚨 Error al verificar/crear el usuario en Auth:', err);
      return;
    }
  }

  const existingUserSnapshot = await usuariosCollection.where('email', '==', MAIN_USER_DATA.email).get();

  if (!existingUserSnapshot.empty) {
    console.log(`ℹ️ Ya existe un usuario con el email ${MAIN_USER_DATA.email} en Firestore. Abortando...`);
    return;
  }

  const nuevoUsuarioDoc = {
    ...MAIN_USER_DATA,
    fechaCreacion: Timestamp.now(),
    fechaNacimiento: getFechaNacimiento(),
    roles: [rolRef]
  };

  const newUserRef = await usuariosCollection.add(nuevoUsuarioDoc);
  console.log(`✅ Usuario principal creado en Firestore con ID: ${newUserRef.id}`);

  await rolRef.update({
    usuarioCreacion: newUserRef,
    usuarioUpdated: newUserRef
  });

  console.log(`✅ Referencias de creación y actualización añadidas al rol principal`);
};

run().catch(console.error);
