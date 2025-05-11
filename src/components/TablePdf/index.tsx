import {Page, Text, View, Document} from '@react-pdf/renderer';
import {useState, memo} from 'react';
import {genericPdfStyles} from './css/styles';
import {DocuPdfProps} from '@/types';

function TablePdfComponent<T>({columns, data, title, orientation = 'landscape'}: DocuPdfProps<T>) {
  const [styles] = useState(genericPdfStyles);
  return (
    <Document title={title}>
      <Page style={styles.page} orientation={orientation}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.tableHeader}>
          {columns.map(({header}, index) => (
            <Text key={index} style={styles.headerCell}>
              {header.toUpperCase()}
            </Text>
          ))}
        </View>

        {data.map((rowData, rowIndex) => (
          <View key={rowIndex} style={styles.tableRow}>
            {columns.map(({field}, colIndex) => (
              <Text key={colIndex} style={styles.cell}>
                {(rowData as Record<string, unknown>)[field as string] != null
                  ? String((rowData as Record<string, unknown>)[field as string])
                  : ''}
              </Text>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  );
}

const TablePdf = memo(TablePdfComponent) as typeof TablePdfComponent;

export default TablePdf;
