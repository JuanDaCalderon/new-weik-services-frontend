import {RootState} from '@/store';
import {Apps} from '@/types';

export const selectApps = (state: RootState): Apps[] => state.apps.apps;

export const selectIsLoadingApps = (state: RootState): boolean => state.apps.isLoading;
