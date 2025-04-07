import {Col, Form, Row} from 'react-bootstrap';
import {FileType} from '@/components';
import {ChangeEvent, memo, useCallback, useMemo, useState} from 'react';
import {Cliente} from '@/types';
import {useAppSelector} from '@/store';
import {selectClientes} from '@/store/selectores';
import toast from 'react-hot-toast';
import {DateUtils, DebugUtil, isValidDomain, isValidName, formatText, formatDomain} from '@/utils';
import {FileUploader} from '@/components';
import {useFileManager} from '@/hooks';
import {
  ACCEPTED_DOC_TYPES,
  ACCEPTED_FILE_TYPES,
  STORAGE_DOCS_CLIENTES_PATH,
  STORAGE_LOGOS_CLIENTES_PATH
} from '@/constants';
import {useGetClients, useUploadFiles} from '@/endpoints';
import {useAddClient} from '@/endpoints';
import {checkIfClientExists} from '@/utils';
import {FormWrapper, InputField} from '@/components/Form2';
const clienteDatosIniciales: Cliente = {
  id: '',
  logo: '',
  documento: '',
  fechaCreacion: '',
  nombre: '',
  domain: '',
  branding: '',
  nombrePersonaContacto: '',
  emailPersonaContacto: '',
  telefonoPersonaContacto: '',
  idNitCliente: '',
  direccionFisicaCliente: '',
  telefonoCliente: ''
};

const CrearCliente = memo(function CrearCliente() {
  const [hasTouched, setHasTouched] = useState<boolean>(false);
  const clientes = useAppSelector(selectClientes);
  const [newCliente, setNewCliente] = useState<Cliente>(clienteDatosIniciales);

  const [shouldResetImage, setShouldResetImage] = useState<boolean>(false);
  const [shouldResetFile, setShouldResetFile] = useState<boolean>(false);
  const {file: logo, handleFile: handleLogo, handleFileRemoved: handleLogoRemoved} = useFileManager();
  const {file, handleFile, handleFileRemoved} = useFileManager();

  const {isLoadingUploadFile, uploadFile} = useUploadFiles();
  const {isLoadingAddClient, addClient} = useAddClient();
  const {getClientesSync} = useGetClients();

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setNewCliente((prev) => ({...prev, [e.target.name]: e.target.value}));
    setHasTouched(true);
  }, []);

  const handleImageUpload = useCallback(
    (file: FileType) => {
      setShouldResetImage(false);
      handleLogo(file);
      setHasTouched(true);
    },
    [handleLogo]
  );

  const handleFileUpload = useCallback(
    (file: FileType) => {
      setShouldResetFile(false);
      handleFile(file);
      setHasTouched(true);
    },
    [handleFile]
  );

  const resetForm = useCallback(() => {
    setShouldResetImage(true);
    setShouldResetFile(true);
    setNewCliente(clienteDatosIniciales);
    setHasTouched(false);
  }, []);

  const enviarCliente = useCallback(async () => {
    if (!file || !logo) {
      if (!file) toast.error(`Asegúrese de haber subido el documento del cliente.`);
      if (!logo) toast.error(`Asegúrese de haber subido el logo del cliente.`);
      if (!file) setShouldResetFile(!file);
      if (!logo) setShouldResetImage(!logo);
      setHasTouched(false);
      return;
    }
    if (checkIfClientExists(newCliente, clientes)) {
      toast.error('El cliente no se pudo crear, ya existen registros con el mismo nombre y/o dominio.');
      return;
    }
    if (!isValidDomain(newCliente.domain) || !isValidName(newCliente.nombre)) {
      if (!isValidDomain(newCliente.domain)) toast.error('El dominio no puede contener caracteres especiales.');
      if (!isValidName(newCliente.nombre)) toast.error('El nombre no puede contener caracteres especiales.');
      return;
    }
    try {
      const refName = formatText(newCliente.nombre);
      const refDomain = formatDomain(newCliente.domain);
      const fileName = `${refName}_${refDomain}_${DateUtils.getDateOnly(new Date(), '_')}`;
      const logoUrl = await uploadFile(STORAGE_LOGOS_CLIENTES_PATH, fileName, logo);
      const documentoUrl = await uploadFile(STORAGE_DOCS_CLIENTES_PATH, fileName, file);
      const cliente: Partial<Cliente> = {
        ...newCliente,
        nombre: newCliente.nombre,
        domain: refDomain,
        branding: newCliente.branding,
        logo: logoUrl,
        documento: documentoUrl
      };
      delete cliente.id;
      await addClient(cliente as Cliente);
      await getClientesSync();
      resetForm();
    } catch (error: any) {
      DebugUtil.logError(error.message, error);
    }
  }, [addClient, clientes, file, getClientesSync, logo, newCliente, resetForm, uploadFile]);

  const isLoadingUploadCliente = useMemo(() => {
    return isLoadingAddClient || isLoadingUploadFile;
  }, [isLoadingAddClient, isLoadingUploadFile]);

  return (
    <>
      <Row>
        <Col xs={12} className="d-flex gap-3">
          <div>
            <h5 className="d-inline-block weik-text-grey-300 my-0 me-1">Nombre del cliente:</h5>
            <p className="d-inline-block weik-text-grey-200 my-0">Nombre completo del cliente</p>
          </div>
          <div>
            <h5 className="d-inline-block weik-text-grey-300 my-0 me-1">Dominio del cliente:</h5>
            <p className="d-inline-block weik-text-grey-200 my-0">
              @<b>dominio</b>.com, donde se asociarán los correos de los usuarios al cliente. No debe contener espacios.
            </p>
          </div>
        </Col>
        <Col xs={12}>
          <hr></hr>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={6}>
          <div className="d-flex justify-content-center flex-column mb-3">
            <Form.Label className="mb-0" htmlFor="logo">
              <strong>Logo o imagen del cliente</strong>
            </Form.Label>
            <div className="avatar-lg d-block me-auto ms-auto mb-1">
              <FileUploader
                onFileUpload={handleImageUpload}
                onFileRemoved={handleLogoRemoved}
                acceptedFileTypes={ACCEPTED_FILE_TYPES}
                resetFile={shouldResetImage}
                isRounded
              />
            </div>
          </div>
        </Col>
        <Col xs={12} md={6}>
          <div className="d-flex justify-content-center flex-column mb-3">
            <Form.Label className="mb-0" htmlFor="documento">
              <strong>Documento del cliente</strong>
            </Form.Label>
            <div className="avatar-lg d-block me-auto ms-auto mb-1">
              <FileUploader
                onFileUpload={handleFileUpload}
                onFileRemoved={handleFileRemoved}
                acceptedFileTypes={ACCEPTED_DOC_TYPES}
                resetFile={shouldResetFile}
                isSquarePreview
              />
            </div>
          </div>
        </Col>
      </Row>
      <FormWrapper
        isDisabled={!hasTouched || isLoadingUploadCliente}
        isLoading={isLoadingUploadCliente}
        submitLabel="Crear Cliente"
        onSubmit={enviarCliente}>
        <InputField
          xs={12}
          md={4}
          label="Nombre del cliente"
          type="text"
          required
          pattern="^[A-Za-zÑñ]+(?: [A-Za-zÑñ]+)*$"
          name="nombre"
          placeholder="Ingrese el nombre del cliente"
          helperText="El nombre del cliente no puede contener caracteres especiales."
          value={newCliente.nombre}
          onChange={handleInputChange}
        />
        <InputField
          xs={12}
          md={4}
          label="Dominio del cliente"
          type="text"
          required
          pattern="^[A-Za-zÑñ]+$"
          name="domain"
          placeholder="Ingrese el dominio del cliente"
          helperText="El dominio no podrá ser modificado, solo puede contener letras, sin espacios ni caracteres especiales."
          value={newCliente.domain}
          onChange={handleInputChange}
        />
        <InputField
          xs={12}
          md={4}
          label="Link del cliente"
          type="url"
          pattern="https://.*"
          required
          name="branding"
          placeholder="Ingrese la URL del link del cliente"
          helperText="Este link puede ser la web del cliente o una una URL de utilidad para este."
          value={newCliente.branding}
          onChange={handleInputChange}
        />
        <InputField
          xs={12}
          md={4}
          label="Persona de contacto"
          type="text"
          required
          name="nombrePersonaContacto"
          placeholder="Ingrese la persona de contacto"
          helperText="Nombre de la persona de contacto del cliente."
          value={newCliente.nombrePersonaContacto}
          onChange={handleInputChange}
        />
        <InputField
          xs={12}
          md={4}
          label="Email de la persona de contacto"
          type="email"
          required
          name="emailPersonaContacto"
          placeholder="Ingrese el email de la persona de contacto"
          helperText="Email de la persona de contacto del cliente."
          value={newCliente.emailPersonaContacto}
          onChange={handleInputChange}
        />
        <InputField
          xs={12}
          md={4}
          label="Teléfono de la persona de contacto"
          type="tel"
          required
          name="telefonoPersonaContacto"
          placeholder="Ingrese el teléfono de la persona de contacto"
          helperText="Ingrese un número móvil válido con el indicativo (ejemplo: +573001234567)."
          pattern="^\+\d{1,3} ?\d+$"
          value={newCliente.telefonoPersonaContacto}
          onChange={handleInputChange}
        />
        <InputField
          xs={12}
          md={4}
          label="ID NIT del cliente"
          type="text"
          required
          name="idNitCliente"
          placeholder="Ingrese el ID NIT del cliente"
          helperText="ID con el que se identifica al cliente ante la entidad tributaria."
          value={newCliente.idNitCliente}
          onChange={handleInputChange}
        />
        <InputField
          xs={12}
          md={4}
          label="Dirección del cliente"
          type="text"
          required
          name="direccionFisicaCliente"
          placeholder="Ingrese la dirección del cliente"
          helperText="Dirección física del cliente."
          value={newCliente.direccionFisicaCliente}
          onChange={handleInputChange}
        />
        <InputField
          xs={12}
          md={4}
          label="Teléfono del cliente"
          type="tel"
          required
          name="telefonoCliente"
          placeholder="Ingrese el teléfono del cliente"
          helperText="Ingrese un número móvil válido"
          value={newCliente.telefonoCliente}
          onChange={handleInputChange}
        />
      </FormWrapper>
    </>
  );
});

export {CrearCliente};
