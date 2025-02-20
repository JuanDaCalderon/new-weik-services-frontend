import {RootState} from '@/store';

export const selectNoticias = (state: RootState) => state.noticias.noticias;

export const selectIsLoadingNoticias = (state: RootState) => state.noticias.isLoading;
