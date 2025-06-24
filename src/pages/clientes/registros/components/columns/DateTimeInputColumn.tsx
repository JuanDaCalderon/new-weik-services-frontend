import {memo, useCallback, useState, MouseEvent, FocusEvent} from 'react';
import type {Row as TableRow} from '@tanstack/react-table';
import {Registros} from '@/types';
import {Form} from 'react-bootstrap';
import useUpdateRegistros from '@/endpoints/db/registros/useUpdateRegistros';
import {useParams} from 'react-router-dom';
import {SkeletonLoader} from '@/components/SkeletonLoader';
import {DateUtils as du} from '@/utils';
import {Timestamp} from 'firebase/firestore';

type FormControlElement = HTMLInputElement | HTMLTextAreaElement;
type Props = {
  row: TableRow<Registros>;
  registerType: string;
  field: keyof Registros;
};
const DateTimeInputColumn = memo(function DateTimeInputColumn({row, registerType, field}: Props) {
  const originalValue = row.original[field] as string;
  const id = row.original.id;
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
  return (
    <div className="w-100 h-100" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
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
    </div>
  );
});
export default DateTimeInputColumn;
