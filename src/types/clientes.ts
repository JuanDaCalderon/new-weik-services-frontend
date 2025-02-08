export type Cliente = {
  id: string;
  nombre: string;
  domain: string;
  branding: string;
  logo: string;
  fechaCreacion: string;
};

export type PayLoadClientType = {
  clientes: Cliente[];
  isLoading: boolean;
};
