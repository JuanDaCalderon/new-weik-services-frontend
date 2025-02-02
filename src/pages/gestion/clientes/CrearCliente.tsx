import {FileType, Spinner} from '@/components';
import {ChangeEvent, memo, useCallback, useMemo, useState} from 'react';
import {Button, Form} from 'react-bootstrap';
import {Cliente} from '@/types';
import {useAppSelector} from '@/store';
import {selectClientes} from '@/store/selectores';
import toast from 'react-hot-toast';
import {DateUtils, DebugUtil, isValidDomain, isValidName, formatText, formatDomain} from '@/utils';
import {FileUploader} from '@/components';
import {useFileManager} from '@/hooks';
import {ACCEPTED_FILE_TYPES, STORAGE_CLIENTES_PATH} from '@/constants';
import {useGetClients, useUploadImage} from '@/endpoints';
import {useAddClient} from '@/endpoints';
import {checkIfClientExists} from '@/utils/cliente';
const clienteDatosIniciales: Cliente = {
  id: '',
  nombre: '',
  domain: '',
  branding: '',
  logo: ''
};

const CrearCliente = memo(function CrearCliente() {
  const clientes = useAppSelector(selectClientes);
  const [newCliente, setNewCliente] = useState<Cliente>(clienteDatosIniciales);
  const [shouldResetImage, setShouldResetImage] = useState<boolean>(false);
  const [hasTouched, setHasTouched] = useState<boolean>(false);
  const {file, handleFile, handleFileRemoved} = useFileManager();
  const {isLoadingUploadImage, uploadImage} = useUploadImage();
  const {isLoadingAddClient, addClient} = useAddClient();
  const {getClientesSync} = useGetClients();

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setNewCliente((prev) => ({...prev, [e.target.name]: e.target.value}));
    setHasTouched(true);
  }, []);

  const handleFileUpload = useCallback(
    (file: FileType) => {
      setShouldResetImage(false);
      handleFile(file);
      setHasTouched(true);
    },
    [handleFile]
  );

  const isValidClient = useCallback((clienteData: Cliente): boolean => {
    return (
      !!clienteData &&
      !!clienteData.nombre.trim() &&
      !!clienteData.domain.trim() &&
      !!clienteData.branding.trim()
    );
  }, []);

  const resetForm = useCallback(() => {
    setShouldResetImage(true);
    setNewCliente(clienteDatosIniciales);
    setHasTouched(false);
  }, []);

  const enviarCliente = useCallback(async () => {
    if (!isValidClient(newCliente) || !file) {
      toast.error(
        `Complete todos los campos${!file ? ' y asegúrese de haber subido una imagen' : ''}.`
      );
      setShouldResetImage(!file);
      setHasTouched(false);
      return;
    }
    if (checkIfClientExists(newCliente, clientes)) {
      toast.error(
        'El cliente no se pudo crear, ya existen registros con el mismo nombre y/o dominio.'
      );
      return;
    }
    if (!isValidDomain(newCliente.domain) || !isValidName(newCliente.nombre)) {
      if (!isValidDomain(newCliente.domain)) {
        toast.error('El dominio no puede contener caracteres especiales.');
      }
      if (!isValidName(newCliente.nombre)) {
        toast.error('El nombre no puede contener caracteres especiales.');
      }
      return;
    }

    try {
      const refName = formatText(newCliente.nombre);
      const refDomain = formatDomain(newCliente.domain);
      const imgName = `${refName}_${refDomain}_${DateUtils.getDateOnly(new Date(), '_')}`;
      const imgUrl = await uploadImage(STORAGE_CLIENTES_PATH, imgName, file);
      const cliente: Cliente = {
        nombre: newCliente.nombre,
        domain: refDomain,
        branding: newCliente.branding,
        logo: imgUrl
      } as Cliente;
      await addClient(cliente);
      await getClientesSync();
      resetForm();
    } catch (error: any) {
      DebugUtil.logError(error.message, error);
    }
  }, [
    addClient,
    clientes,
    file,
    getClientesSync,
    isValidClient,
    newCliente,
    resetForm,
    uploadImage
  ]);

  const isLoadingUploadCliente = useMemo(() => {
    return isLoadingAddClient || isLoadingUploadImage;
  }, [isLoadingAddClient, isLoadingUploadImage]);

  return (
    <>
      <p className="weik-text-grey-200 my-1">
        Completa los campos y haz clic en "Crear" para añadir un cliente.
      </p>
      <ul>
        <li>
          <h5 className="d-inline-block weik-text-grey-300 my-0">Nombre del cliente:</h5>
          <p className="d-inline-block weik-text-grey-200 ms-1 my-0">Nombre completo del cliente</p>
        </li>
        <li>
          <h5 className="d-inline-block weik-text-grey-300 my-0">Dominio del cliente:</h5>
          <p className="d-inline-block weik-text-grey-200 ms-1 my-0">
            @<b>dominio</b>.com, donde se asociarán los correos de los usuarios al cliente. No debe
            contener espacios.
          </p>
        </li>
      </ul>
      <div className="d-flex justify-content-center flex-column mb-3">
        <Form.Label className="mb-0" htmlFor="logo">
          <strong>Logo o imagen del cliente:</strong>
        </Form.Label>
        <div className="avatar-lg d-block me-auto ms-auto mb-1">
          <FileUploader
            onFileUpload={handleFileUpload}
            onFileRemoved={handleFileRemoved}
            acceptedFileTypes={ACCEPTED_FILE_TYPES}
            resetFile={shouldResetImage}
            isRounded
          />
        </div>
      </div>
      <Form.Label className="mb-0" htmlFor="nombre">
        <strong>Nombre del cliente:</strong>
      </Form.Label>
      <Form.Control
        size="sm"
        type="text"
        id="nombre"
        name="nombre"
        placeholder="Ingrese el nombre del cliente"
        value={newCliente.nombre}
        onChange={handleInputChange}
      />
      <Form.Label className="mb-0 mt-1" htmlFor="domain">
        <strong>Dominio del cliente:</strong>
      </Form.Label>
      <Form.Control
        size="sm"
        type="text"
        id="domain"
        name="domain"
        placeholder="Ingrese el dominio del cliente"
        value={newCliente.domain}
        onChange={handleInputChange}
      />
      <p className="d-inline-block p-0 m-0 font-12 text-danger w-100 text-end">
        una vez creado el dominio, no podrá ser modificado.
      </p>
      <Form.Label className="mb-0 mt-1" htmlFor="branding">
        <strong>Link al branding del cliente:</strong>
      </Form.Label>
      <Form.Control
        size="sm"
        type="url"
        id="branding"
        name="branding"
        pattern="https://.*"
        required
        placeholder="Ingrese la URL del branding del cliente"
        value={newCliente.branding}
        onChange={handleInputChange}
      />
      <Button
        disabled={!hasTouched || isLoadingUploadCliente}
        variant="success"
        className="w-100 mt-2"
        onClick={enviarCliente}>
        {isLoadingUploadCliente && (
          <Spinner className="spinner-border-sm" tag="span" color="white" />
        )}
        {!isLoadingUploadCliente && (
          <>
            <i className="mdi mdi-plus-circle me-1" /> Crear
          </>
        )}
      </Button>
    </>
  );
});

export {CrearCliente};
