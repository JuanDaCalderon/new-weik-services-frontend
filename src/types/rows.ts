export type SelectedRowType = {id: string; [key: string]: any};
export interface PayLoadSelectedRowType<T extends {id: string}> {
  selectedRows: Array<T>;
}
