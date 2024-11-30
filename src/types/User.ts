export type Employee = {
  email: string;
  nombres: string;
  apellidos: string;
};

export interface User extends Employee {
  id: number;
  uid: string;
  token: string;
}

export type PayLoadUserType = {
  user: User;
  domain: string;
  isLoggedIn: boolean;
};
