import {ExportColumn} from '@/types';
import {utils, writeFile} from 'xlsx';

const useExportToExcel = <T>() => {
  const exportToExcel = (data: T[], columns: ExportColumn<T>[], fileName: string = 'exportFromDevikGo') => {
    const mappedData = data.map((item) => {
      const row: Record<string, any> = {};
      columns.forEach((col) => {
        row[col.header] = item[col.field];
      });
      return row;
    });

    const worksheet = utils.json_to_sheet(mappedData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Hoja1');

    writeFile(workbook, `${fileName}.xlsx`);
  };

  return {exportToExcel};
};

export default useExportToExcel;
