import {RootState} from '@/store';

export const selectClocks = (state: RootState) => state.clocksInOut;
