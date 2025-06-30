import {isPlainObject, Middleware, UnknownAction} from '@reduxjs/toolkit';
import {setSelectedRows} from '@/store/slices/selected-row';
import {RootState} from '@/store';
import {SelectedRowType} from '@/types';

export const dedupeSelectedRowMiddleware: Middleware = (store) => (next) => (action) => {
  if (!isPlainObject(action)) return next(action);
  const state = store.getState() as RootState;

  if ((action as UnknownAction).type === setSelectedRows.type) {
    const selectedRows = (action as UnknownAction).payload as SelectedRowType[];
    const currentSelectedRows = state.selectedRow.selectedRows;
    if (currentSelectedRows) {
      const areEqual =
        currentSelectedRows.length === selectedRows.length &&
        JSON.stringify(currentSelectedRows) === JSON.stringify(selectedRows);
      if (areEqual) return;
    }
  }

  return next(action);
};
