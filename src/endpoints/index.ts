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
import useUploadFiles from './db/utils/useUploadFiles';
import useDeleteFile from './db/utils/useDeleteFile';
import useAddNoticia from './db/noticias/useAddNoticia';
import useGetNoticias from './db/noticias/useGetNoticias';
import useDeleteNoticia from './db/noticias/useDeleteNoticia';
import useUpdateNoticia from './db/noticias/useUpdateNoticia';
import useGetApps from './db/apps/useGetApps';
import useAddApp from './db/apps/useAddApp';
import useDeleteApp from './db/apps/useDeleteApp';
import useAddEventos from './db/eventos/useAddEventos';
import useGetEventos from './db/eventos/useGetEventos';
import useDeleteEventos from './db/eventos/useDeleteEventos';
import useUpdateEventos from './db/eventos/useUpdateEventos';
import useAddHorario from './db/horarios/useAddHorario';
import useDeleteHorario from './db/horarios/useDeleteHorario';
import useUpdateHorario from './db/horarios/useUpdateHorario';
import useAddVacaciones from './db/vacaciones/useAddVacaciones';
import useApproveVacaciones from './db/vacaciones/useApproveVacaciones';
import useUpdateVacaciones from './db/vacaciones/useUpdateVacaciones';
import useAddObjetivos from './db/objetivos/useAddObjetivos';
import useGetObjetivos from './db/objetivos/useGetObjetivos';
import useDeleteObjetivos from './db/objetivos/useDeleteObjetivos';
import useUpdateObjetivos from './db/objetivos/useUpdateObjetivos';
import useEvaluateObjetivos from './db/objetivos/useEvaluateObjetivos';
import useRequiredSelfAssessment from './db/objetivos/useRequiredSelfAssessment';
import useSelfEvaluate from './db/objetivos/useSelfEvaluate';

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
  useUploadFiles,
  useDeleteFile,
  useCreateUserAuth,
  useCheckIn,
  useCheckOut,
  useAddNoticia,
  useGetNoticias,
  useDeleteNoticia,
  useUpdateNoticia,
  useGetApps,
  useAddApp,
  useDeleteApp,
  useAddEventos,
  useGetEventos,
  useDeleteEventos,
  useUpdateEventos,
  useAddHorario,
  useDeleteHorario,
  useUpdateHorario,
  useAddVacaciones,
  useApproveVacaciones,
  useUpdateVacaciones,
  useAddObjetivos,
  useGetObjetivos,
  useDeleteObjetivos,
  useUpdateObjetivos,
  useEvaluateObjetivos,
  useRequiredSelfAssessment,
  useSelfEvaluate
};
