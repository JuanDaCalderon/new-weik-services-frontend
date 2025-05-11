export interface ExportColumn<T> {
  id?: string;
  field: keyof T;
  header: string;
}

export interface DocuPdfProps<T> {
  columns: ExportColumn<T>[];
  data: T[];
  title?: string;
  orientation?: 'landscape' | 'portrait';
}
