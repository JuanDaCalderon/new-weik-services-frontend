/** Months of the year with Index started in 0 and the name in spanish */
const months: {index: number; name: string}[] = [
  {index: 0, name: 'Enero'},
  {index: 1, name: 'Febrero'},
  {index: 2, name: 'Marzo'},
  {index: 3, name: 'Abril'},
  {index: 4, name: 'Mayo'},
  {index: 5, name: 'Junio'},
  {index: 6, name: 'Julio'},
  {index: 7, name: 'Agosto'},
  {index: 8, name: 'Septiembre'},
  {index: 9, name: 'Octubre'},
  {index: 10, name: 'Noviembre'},
  {index: 11, name: 'Diciembre'}
];
/** Current year in number */
const year: number = new Date().getFullYear();

export {months, year};
