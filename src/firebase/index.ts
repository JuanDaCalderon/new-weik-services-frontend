import config from '@/config';
import {FirebaseOptions, initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {initializeFirestore, persistentLocalCache, persistentMultipleTabManager} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';

const firebaseConfig: FirebaseOptions = {
  apiKey: config.FIREBASE_API_KEY,
  authDomain: config.FIREBASE_AUTH_DOMAIN,
  projectId: config.FIREBASE_PROJECT_ID,
  storageBucket: config.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: config.FIREBASE_MESSAGING_SENDER_ID,
  appId: config.FIREBASE_APP_ID
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(
  app,
  {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  },
  config.FIREBASE_DATABASE
);
export const storage = getStorage(app);
