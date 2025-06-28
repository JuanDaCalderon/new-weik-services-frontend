import {memo, useCallback, useState, ChangeEvent, KeyboardEvent, MouseEvent} from 'react';
import type {Row} from '@tanstack/react-table';
import {Button, OverlayTrigger, Tooltip, Form} from 'react-bootstrap';
import useUpdateRegistros from '@/endpoints/db/registros/useUpdateRegistros';
import {useParams} from 'react-router-dom';
import {SkeletonLoader} from '@/components/SkeletonLoader';
import {Registros} from '@/types';

type FormControlElement = HTMLInputElement | HTMLTextAreaElement;
type Props = {row: Row<Registros>; registerType: string; field: keyof Registros};
const LinkColumn = memo(function LinkColumn({row, registerType, field}: Props) {
  const originalValue = row.original[field as keyof Registros] as string;
  const id = row.original.id;
  const [inputValue, setInputValue] = useState<string>(originalValue);
  const [hasClicked, setHasClicked] = useState<boolean>(false);
  const [disabledHover, setDisabledHover] = useState<boolean>(true);
  const {cliente} = useParams<{cliente: string}>();
  const {isUpdatingRegistro, updateRegistroPerClienteType} = useUpdateRegistros();
  const handleUpdate = useCallback(
    async (e: ChangeEvent<FormControlElement> | KeyboardEvent<FormControlElement> | MouseEvent<FormControlElement>) => {
      setHasClicked(false);
      const target = e.target as FormControlElement;
      if (target.value === originalValue) return;
      if (!cliente) return;
      await updateRegistroPerClienteType(cliente, registerType, id, {[target.name]: target.value});
    },
    [cliente, id, originalValue, registerType, updateRegistroPerClienteType]
  );
  const onMouseEnter = useCallback(() => setDisabledHover(false), []);
  const onMouseLeave = useCallback(() => setDisabledHover(true), []);
  const onClick = useCallback(() => setHasClicked(true), []);
  const onDispatchAction = useCallback(
    (e: ChangeEvent<FormControlElement> | KeyboardEvent<FormControlElement> | MouseEvent<FormControlElement>) => {
      const target = e.target as FormControlElement;
      if (hasClicked && target.value !== originalValue) handleUpdate(e);
    },
    [handleUpdate, hasClicked, originalValue]
  );
  return (
    <div className="w-100 h-100 d-flex align-items-center" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {isUpdatingRegistro ? (
        <SkeletonLoader customClass="p-0 top-0 w-100" height="29px" />
      ) : (
        <Form.Control
          type="url"
          pattern="https://.*"
          value={inputValue}
          name={field}
          disabled={disabledHover}
          onChange={(e) => setInputValue(e.target.value)}
          onClick={onClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onDispatchAction(e);
            } else if (e.key === 'Escape') {
              setInputValue(originalValue);
              setHasClicked(false);
            }
          }}
          onMouseLeave={onDispatchAction}
          onBlurCapture={onDispatchAction}
        />
      )}
      {row.original.link.trim() !== '' && (
        <OverlayTrigger overlay={<Tooltip id="link">{row.original.link}</Tooltip>}>
          <Button
            id="link"
            as="a"
            href={row.original.link}
            target="_blank"
            variant="outline-light py-0 px-1 d-flex align-items-center justify-content-center"
            className=" border-0 ms-1">
            <i className="uil-external-link-alt" />
          </Button>
        </OverlayTrigger>
      )}
    </div>
  );
});
export default LinkColumn;
