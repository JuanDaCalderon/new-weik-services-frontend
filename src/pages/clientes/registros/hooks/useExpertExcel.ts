import {useCallback, useMemo} from 'react';
import {Registros, TipoRegistro} from '@/types';
import {useExportToExcel} from '@/hooks';
import {useGetColumns} from './useGetColumns';

export const useExpertExcel = (registros: Registros[], tiposRegistros: TipoRegistro[] = [], registerType: string) => {
  const {exportToExcel} = useExportToExcel<Registros>();
  const {registrosColumnsPdf} = useGetColumns(tiposRegistros, registerType);

  const exportData = useMemo(() => {
    return registros.map((registro) => ({
      requestAt: registro.requestAt,
      deliverAt: registro.deliverAt,
      nombre: registro.nombre,
      cliente: registro.cliente,
      solicitante: registro.solicitante,
      numeroOrden: registro.numeroOrden,
      prioridad: registro.prioridad,
      isSubRegistro: registro.isSubRegistro,
      encargado: registro.encargado,
      estado: registro.estado
    }));
  }, [registros]);

  const handleExportExcel = useCallback(() => {
    return exportToExcel(exportData as Registros[], registrosColumnsPdf, 'Reporte');
  }, [exportData, exportToExcel, registrosColumnsPdf]);

  return {
    exportData,
    handleExportExcel
  };
};
