import {memo, useCallback, useState, MouseEvent, FocusEvent, useMemo, JSX} from 'react';
import type {Row as TableRow} from '@tanstack/react-table';
import {Registros} from '@/types';
import {Form} from 'react-bootstrap';
import useUpdateRegistros from '@/endpoints/db/registros/useUpdateRegistros';
import {useParams} from 'react-router-dom';
import {SkeletonLoader} from '@/components/SkeletonLoader';
import {DateUtils, DateUtils as du} from '@/utils';
import {Timestamp} from 'firebase/firestore';
import {REGISTRO_STATUS} from '@/constants';

type FormControlElement = HTMLInputElement | HTMLTextAreaElement;
type Props = {
  row: TableRow<Registros>;
  registerType: string;
  field: keyof Registros;
  showStatusIcons?: boolean;
};
const DateTimeInputColumn = memo(function DateTimeInputColumn({
  row,
  registerType,
  field,
  showStatusIcons = false
}: Props) {
  const originalValue = row.original[field] as string;
  const id = row.original.id;
  const deliveryDate = DateUtils.parseStringToDate(row.original.deliverAt);
  const status = row.original.estado as REGISTRO_STATUS;
  const [inputValue, setInputValue] = useState<string>(
    du.formatDateToDatetimeLocal(du.parseStringToDate(originalValue))
  );
  const [disabledHover, setDisabledHover] = useState<boolean>(true);
  const {cliente} = useParams<{cliente: string}>();
  const {isUpdatingRegistro, updateRegistroPerClienteType} = useUpdateRegistros();
  const onMouseEnter = useCallback(() => setDisabledHover(false), []);
  const onMouseLeave = useCallback(() => setDisabledHover(true), []);
  const onDispatchAction = useCallback(
    async (e: MouseEvent<FormControlElement> | FocusEvent<FormControlElement>) => {
      const {name, value} = e.target as FormControlElement;
      const originalDate = du.parseStringToDate(originalValue);
      const formattedOriginal = du.formatDateToDatetimeLocal(originalDate)?.trim().toLowerCase();
      const newFormatted = value.trim().toLowerCase();
      if (newFormatted === formattedOriginal || !cliente) return;
      const parsedDate = du.parseDatetimeLocal(value) || new Date();
      await updateRegistroPerClienteType(cliente, registerType, id, {
        [name]: Timestamp.fromDate(parsedDate)
      });
    },
    [cliente, id, originalValue, registerType, updateRegistroPerClienteType]
  );

  const statusIcon: JSX.Element = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);
    if (status === REGISTRO_STATUS.COMPLETADO) return <i className="mdi mdi-check-decagram text-primary mx-1" />;
    if (status === REGISTRO_STATUS.ENTREGADO) return <i className="mdi mdi-check-decagram text-success mx-1" />;

    const inputTime = deliveryDate.getTime();

    const icon =
      inputTime < startOfToday.getTime() ? (
        <i className="mdi mdi-skull text-dark mx-1" />
      ) : inputTime > endOfToday.getTime() ? (
        <></>
      ) : (
        <i className="mdi mdi-alert text-danger mx-1" />
      );

    return icon;
  }, [deliveryDate, status]);

  return (
    <div
      className="w-100 h-100 d-flex justify-content-between align-content-center align-items-center"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}>
      {isUpdatingRegistro ? (
        <SkeletonLoader customClass="p-0 top-0 w-100" height="29px" />
      ) : (
        <Form.Control
          className="cursor-pointer"
          type="datetime-local"
          value={inputValue}
          name={field}
          disabled={disabledHover}
          onChange={(e) => setInputValue(e.target.value)}
          onMouseLeave={onDispatchAction}
          onBlurCapture={onDispatchAction}
        />
      )}
      {showStatusIcons && statusIcon}
    </div>
  );
});
export default DateTimeInputColumn;
