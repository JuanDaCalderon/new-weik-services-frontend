import {SELECTED_ROW_NAME} from '@/constants';
import {PayLoadSelectedRowType, SelectedRowType} from '@/types';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: PayLoadSelectedRowType<SelectedRowType> = {
  selectedRows: []
};
export const selectedRowSlice = createSlice({
  name: SELECTED_ROW_NAME,
  initialState,
  reducers: {
    setSelectedRows: (
      state: PayLoadSelectedRowType<SelectedRowType>,
      action: PayloadAction<Array<SelectedRowType>>
    ) => {
      state.selectedRows = action.payload;
    }
  }
});

export const {setSelectedRows} = selectedRowSlice.actions;
export default selectedRowSlice.reducer;
