import {RootState} from '@/store';

export const selectNoticiasIsExpanded = (state: RootState): boolean => state.utilities.noticias.isExpanded;
