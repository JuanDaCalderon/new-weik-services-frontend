import {Form} from 'react-bootstrap';
import {ChangeEvent, Dispatch, memo, SetStateAction, useCallback} from 'react';
import {DatepickerRange, FileType, FileUploader} from '@/components';
import {ACCEPTED_FILE_TYPES} from '@/constants';
import {noticiaCreationType} from '@/types';

const CrearNoticiaBodyModal = memo(function CrearNoticiaBodyModal({
  formData,
  setFormData,
  handleFileUpload,
  handleFileRemoved,
  shouldResetImage,
  dateRange,
  onDateChangeRange
}: {
  formData: noticiaCreationType;
  handleFileUpload: (file: FileType) => void;
  handleFileRemoved: () => void;
  shouldResetImage: boolean;
  setFormData: Dispatch<SetStateAction<noticiaCreationType>>;
  isTouch?: Dispatch<SetStateAction<boolean>>;
  dateRange: [Date | null, Date | null];
  onDateChangeRange: (dates: any) => void;
}) {
  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const {name, value} = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    },
    [setFormData]
  );

  return (
    <>
      <div className="d-flex justify-content-center flex-column">
        <Form.Label className="mb-0" htmlFor="image">
          <strong>Noticia:</strong>
        </Form.Label>
        <div className="avatar-xl d-block me-auto ms-auto">
          <FileUploader
            onFileUpload={handleFileUpload}
            onFileRemoved={handleFileRemoved}
            acceptedFileTypes={ACCEPTED_FILE_TYPES}
            resetFile={shouldResetImage}
            isSquarePreview
          />
        </div>
        <p className="text-danger">
          Recuerda que para una visualización óptima, la imagen debe tener una relación de aspecto de 4:3 (por ejemplo:
          400x300px ó 1200x900px).
        </p>
      </div>
      <Form.Label className="text-dark cursor-pointer mb-0" htmlFor="titulo">
        <strong>Titulo de la noticia:</strong>
      </Form.Label>
      <Form.Control
        size="sm"
        type="text"
        id="titulo"
        name="titulo"
        placeholder="Ingresa el titulo de la noticia (opcional)"
        value={formData.titulo || ''}
        onChange={handleInputChange}
      />
      <Form.Label className="text-dark cursor-pointer mb-0 mt-1" htmlFor="link">
        <strong>Link externo de la noticia:</strong>
      </Form.Label>
      <Form.Control
        size="sm"
        type="url"
        id="link"
        name="link"
        pattern="https://.*"
        placeholder="Ingrese la URL asociada a la noticia (opcional)"
        value={formData.link || ''}
        onChange={handleInputChange}
      />
      <Form.Label className="text-dark cursor-pointer mb-0 mt-1" htmlFor="rangoFechas">
        <strong>Rango de fechas en el que va a durar esta noticia:</strong>
      </Form.Label>
      <DatepickerRange
        dateFormat="MMMM d, yyyy"
        isRange={true}
        startDate={dateRange[0]}
        endDate={dateRange[1]}
        onChange={onDateChangeRange}
      />
    </>
  );
});

export {CrearNoticiaBodyModal};
