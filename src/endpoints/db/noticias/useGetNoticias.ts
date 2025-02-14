import {db} from '@/firebase';
import {Unsubscribe, collection, onSnapshot} from 'firebase/firestore';
import {useDispatch} from 'react-redux';
import {useCallback} from 'react';
import {DateUtils, DebugUtil} from '@/utils';
import {isLoadingNoticias, resetNoticias, setNoticias} from '@/store/slices/noticias';
import {NOTICIAS_PATH} from '@/constants';
import {Noticia, NoticiaToDb} from '@/types';

export default function useGetNoticias() {
  const dispatch = useDispatch();

  const getNoticiasListener = useCallback((): Unsubscribe => {
    dispatch(isLoadingNoticias(true));
    let unsubscribe: Unsubscribe = {} as Unsubscribe;
    try {
      unsubscribe = onSnapshot(collection(db, NOTICIAS_PATH), async (querySnapshotDocs) => {
        const noticias: Noticia[] = [];
        querySnapshotDocs.forEach((doc) => {
          noticias.push({
            ...(doc.data() as Noticia),
            id: doc.id,
            rangoFechas: (doc.data() as NoticiaToDb).rangoFechas.map((date) =>
              DateUtils.formatDateToString(date.toDate())
            )
          });
        });
        dispatch(resetNoticias());
        dispatch(setNoticias(noticias));
        dispatch(isLoadingNoticias(false));
        DebugUtil.logSuccess(
          'Se han consultado las noticias correctamente y ya deben estar en el store',
          noticias
        );
      });
    } catch (error: any) {
      DebugUtil.logError(error.message, error);
    }
    return unsubscribe;
  }, [dispatch]);

  return {
    getNoticiasListener
  };
}
