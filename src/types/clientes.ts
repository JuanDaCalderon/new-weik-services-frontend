export type Cliente = {
  id: string;
  nombre: string;
  domain: string;
  branding: string;
  logo: string;
  documento: string;
  fechaCreacion: string;
  telefonoCliente: string;
  nombrePersonaContacto: string;
  emailPersonaContacto: string;
  telefonoPersonaContacto: string;
  direccionFisicaCliente: string;
  idNitCliente: string;
};

export type PayLoadClientType = {
  clientes: Cliente[];
  isLoading: boolean;
};
