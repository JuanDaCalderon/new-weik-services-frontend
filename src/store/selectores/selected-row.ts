import {RootState} from '@/store';
export const selectSelectedRows = (state: RootState) => state.selectedRow.selectedRows;
