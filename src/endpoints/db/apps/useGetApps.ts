import {db} from '@/firebase';
import {collection, getDocs} from 'firebase/firestore';
import {useDispatch} from 'react-redux';
import {useCallback} from 'react';
import {DebugUtil} from '@/utils';
import {isLoadingApps, setApps, clearApps} from '@/store/slices/apps';
import {APPS_PATH} from '@/constants';
import {Apps} from '@/types';

export default function useGetApps() {
  const dispatch = useDispatch();

  const getAppsSync = useCallback(async (): Promise<void> => {
    dispatch(isLoadingApps(true));
    try {
      const querySnapshotDocs = await getDocs(collection(db, APPS_PATH));
      const apps: Apps[] = querySnapshotDocs.docs.map((doc) => ({
        ...(doc.data() as Apps),
        id: doc.id
      }));
      dispatch(clearApps());
      dispatch(setApps(apps));
      DebugUtil.logSuccess('Apps (Accesos directos) cacheadas y actualizadas en el store.', apps);
    } catch (error: any) {
      DebugUtil.logError(error.message, error);
    } finally {
      dispatch(isLoadingApps(false));
    }
  }, [dispatch]);

  return {
    getAppsSync
  };
}
