/* CLIENTES */
import useGetClients from './db/clientes/useGetClients';
import useAddClient from './db/clientes/useAddClient';
import useDeleteClient from './db/clientes/useDeleteClient';
import useUpdateClient from './db/clientes/useUpdateClient';
/* USUARIOS */
import useRemoveRolesFromUser from './db/users/useRemoveRolesFromUser';
import useDeleteUser from './db/users/useDeleteUser';
import useAddUser from './db/users/useAddUser';
import useCreateUserAuth from './auth/useCreateUserAuth';
import useAuth from './auth/useAuth';
import useChangePassword from './auth/useChangePassword';
import useCheckIn from './db/horarios/useCheckIn';
import useCheckOut from './db/horarios/useCheckOut';
import useRolesYPermisos from './db/roles-permisos/useRolesYPermisos';
import useDeleteRol from './db/roles-permisos/useDeleteRol';
import useGetUsers from './db/users/useGetUsers';
import useSetEstadoUser from './db/users/useSetEstadoUser';
import useUpdateUser from './db/users/useUpdateUser';
import useUserProfileImage from './db/profile-image/useUserProfileImage';
import useGetEmployees from './db/users/useGetEmployees';
import useUploadImage from './db/utils/useUploadImage';
import useDeleteImage from './db/utils/useDeleteImage';
import useAddNoticia from './db/noticias/useAddNoticia';
import useGetNoticias from './db/noticias/useGetNoticias';
import useDeleteNoticia from './db/noticias/useDeleteNoticia';
import useUpdateNoticia from './db/noticias/useUpdateNoticia';

export {
  useGetClients,
  useAddClient,
  useDeleteClient,
  useUpdateClient,
  useRemoveRolesFromUser,
  useDeleteUser,
  useAddUser,
  useAuth,
  useRolesYPermisos,
  useDeleteRol,
  useGetUsers,
  useSetEstadoUser,
  useUserProfileImage,
  useUpdateUser,
  useGetEmployees,
  useChangePassword,
  useUploadImage,
  useDeleteImage,
  useCreateUserAuth,
  useCheckIn,
  useCheckOut,
  useAddNoticia,
  useGetNoticias,
  useDeleteNoticia,
  useUpdateNoticia
};
