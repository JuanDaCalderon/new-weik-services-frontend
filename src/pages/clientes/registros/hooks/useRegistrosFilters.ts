import {useMemo, useState} from 'react';
import {Registros, RegistrosFilterMode} from '@/types';
import {DateUtils} from '@/utils';
import {REGISTRO_FILTER_MODE_DEFAULT, REGISTRO_PRIORIDAD, REGISTRO_STATUS_SIN_ENTREGADO} from '@/constants';
import {useDatePicker} from '@/hooks';

export const useRegistrosFilters = (registros: Registros[]) => {
  /* Filtros states */
  const [filterMode, setFilterMode] = useState<RegistrosFilterMode>(REGISTRO_FILTER_MODE_DEFAULT);
  const [requestFilterDate, setRequestFilterDate] = useState<Date>(new Date());
  const [deliveryFilterDate, setDeliveryFilterDate] = useState<Date>(new Date());
  const [filterStados, setFilterStados] = useState<REGISTRO_STATUS_SIN_ENTREGADO>(REGISTRO_STATUS_SIN_ENTREGADO.ALL);
  const [filterPrioridad, setFilterPrioridad] = useState<REGISTRO_PRIORIDAD>(REGISTRO_PRIORIDAD.SINPRIORIDAD);
  const {dateRange, onDateChangeRange} = useDatePicker();

  const filterRegisters = useMemo(() => {
    if (filterMode.isInEstado) {
      if (filterStados === REGISTRO_STATUS_SIN_ENTREGADO.ALL) return registros;
      else return registros.filter((r) => r.estado === (filterStados as unknown as typeof r.estado));
    }
    if (filterMode.isInDeliveryDate) {
      return registros.filter((r) => {
        const deliveryDate = DateUtils.parseStringToDate(r.deliverAt);
        return DateUtils.areDatesEqual(deliveryDate, deliveryFilterDate);
      });
    }
    if (filterMode.isInRequestDate) {
      return registros.filter((r) => {
        const requestDate = DateUtils.parseStringToDate(r.requestAt);
        return DateUtils.areDatesEqual(requestDate, requestFilterDate);
      });
    }
    if (filterMode.isInRangeDates) {
      return registros.filter((r) => {
        const requestDate = DateUtils.parseStringToDate(r.requestAt);
        return DateUtils.isDateInRange(
          dateRange.map((date) => DateUtils.formatDateToString(date ?? new Date())) as [string, string],
          requestDate
        );
      });
    }
    if (filterMode.isInPrioridad) return registros.filter((r) => r.prioridad === filterPrioridad);
    return registros;
  }, [
    dateRange,
    deliveryFilterDate,
    filterMode.isInDeliveryDate,
    filterMode.isInEstado,
    filterMode.isInPrioridad,
    filterMode.isInRangeDates,
    filterMode.isInRequestDate,
    filterPrioridad,
    filterStados,
    registros,
    requestFilterDate
  ]);

  const hasAnyFilterApply = useMemo(() => {
    return (
      filterMode.isInEstado ||
      filterMode.isInDeliveryDate ||
      filterMode.isInRequestDate ||
      filterMode.isInRangeDates ||
      filterMode.isInPrioridad
    );
  }, [
    filterMode.isInDeliveryDate,
    filterMode.isInEstado,
    filterMode.isInPrioridad,
    filterMode.isInRangeDates,
    filterMode.isInRequestDate
  ]);

  return {
    filterRegisters,
    hasAnyFilterApply,
    setFilterMode,
    setRequestFilterDate,
    setDeliveryFilterDate,
    setFilterStados,
    setFilterPrioridad,
    onDateChangeRange,
    dateRange,
    requestFilterDate,
    deliveryFilterDate,
    filterStados,
    filterPrioridad
  };
};
