/* CLIENTES */
import useGetClients from './db/clientes/useGetClients';
import useAddClient from './db/clientes/useAddClient';
import useDeleteClient from './db/clientes/useDeleteClient';
import useUpdateClient from './db/clientes/useUpdateClient';
/* USUARIOS */
import useDeleteUser from './db/users/useDeleteUser';
import useAddUser from './db/users/useAddUser';
import useCreateUserAuth from './auth/useCreateUserAuth';
import useAuth from './auth/useAuth';
import useChangePassword from './auth/useChangePassword';
import useRolesYPermisos from './db/roles-permisos/useRolesYPermisos';
import useGetUsers from './db/users/useGetUsers';
import useSetEstadoUser from './db/users/useSetEstadoUser';
import useUpdateUser from './db/users/useUpdateUser';
import useUserProfileImage from './db/profile-image/useUserProfileImage';
import useGetEmployees from './db/users/useGetEmployees';
import useUploadImage from './db/utils/useUploadImage';
import useDeleteImage from './db/utils/useDeleteImage';

export {
  useGetClients,
  useAddClient,
  useDeleteClient,
  useUpdateClient,
  useDeleteUser,
  useAddUser,
  useAuth,
  useRolesYPermisos,
  useGetUsers,
  useSetEstadoUser,
  useUserProfileImage,
  useUpdateUser,
  useGetEmployees,
  useChangePassword,
  useUploadImage,
  useDeleteImage,
  useCreateUserAuth
};
