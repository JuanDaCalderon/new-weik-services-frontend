import {RootState} from '@/store';

export const selectNoticias = (state: RootState) => state.noticias.noticias;

export const isLoadingNoticias = (state: RootState) => state.noticias.isLoading;
