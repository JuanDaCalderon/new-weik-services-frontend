import {RootState} from '@/store';
import {filtrarElementosVigentes} from '@/utils';

export const selectNoticias = (state: RootState) => state.noticias.noticias;

export const selectIsLoadingNoticias = (state: RootState) => state.noticias.isLoading;

export const selectActiveNoticias = (state: RootState) => {
  if (state.noticias.noticias.length === 0) return false;
  const noticiasFiltradas = filtrarElementosVigentes(state.noticias.noticias);
  if (noticiasFiltradas.length > 0) return true;
  else return false;
};
