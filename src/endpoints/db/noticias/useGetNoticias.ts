import {db} from '@/firebase';
import {Unsubscribe, collection, getDocs, onSnapshot} from 'firebase/firestore';
import {useDispatch} from 'react-redux';
import {useCallback} from 'react';
import {DateUtils, DebugUtil} from '@/utils';
import {isLoadingNoticias, clearNoticias, setNoticias} from '@/store/slices/noticias';
import {FIRESTORE_NOTICIAS_PATH} from '@/constants';
import {Noticia, NoticiaToDb} from '@/types';

export default function useGetNoticias() {
  const dispatch = useDispatch();

  const getNoticiasSync = useCallback(async (): Promise<void> => {
    dispatch(isLoadingNoticias(true));
    try {
      const querySnapshotDocs = await getDocs(collection(db, FIRESTORE_NOTICIAS_PATH));
      const noticias: Noticia[] = querySnapshotDocs.docs.map((doc) => ({
        ...(doc.data() as Noticia),
        id: doc.id,
        rangoFechas: [
          DateUtils.formatDateToString((doc.data() as NoticiaToDb).rangoFechas[0].toDate()),
          DateUtils.formatDateToString((doc.data() as NoticiaToDb).rangoFechas[1].toDate())
        ]
      }));
      dispatch(clearNoticias());
      dispatch(setNoticias(noticias));
      DebugUtil.logSuccess('Noticias cacheadas y actualizadas en el store.', noticias);
    } catch (error: any) {
      DebugUtil.logError(error.message, error);
    } finally {
      dispatch(isLoadingNoticias(false));
    }
  }, [dispatch]);

  const getNoticiasListener = useCallback((): Unsubscribe => {
    dispatch(isLoadingNoticias(true));
    let unsubscribe: Unsubscribe = {} as Unsubscribe;
    try {
      unsubscribe = onSnapshot(collection(db, FIRESTORE_NOTICIAS_PATH), async (querySnapshotDocs) => {
        const noticias: Noticia[] = [];
        querySnapshotDocs.forEach((doc) => {
          noticias.push({
            ...(doc.data() as Noticia),
            id: doc.id,
            rangoFechas: [
              DateUtils.formatDateToString((doc.data() as NoticiaToDb).rangoFechas[0].toDate()),
              DateUtils.formatDateToString((doc.data() as NoticiaToDb).rangoFechas[1].toDate())
            ]
          });
        });
        dispatch(clearNoticias());
        dispatch(setNoticias(noticias));
        dispatch(isLoadingNoticias(false));
        DebugUtil.logSuccess('Se han consultado las noticias correctamente y ya deben estar en el store', noticias);
      });
    } catch (error: any) {
      DebugUtil.logError(error.message, error);
    }
    return unsubscribe;
  }, [dispatch]);

  return {
    getNoticiasListener,
    getNoticiasSync
  };
}
