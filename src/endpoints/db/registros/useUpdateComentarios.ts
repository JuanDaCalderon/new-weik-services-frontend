import {useCallback, useState} from 'react';
import {db} from '@/firebase';
import {DebugUtil} from '@/utils';
import {arrayUnion, doc, Timestamp, updateDoc} from 'firebase/firestore';
import {FIRESTORE_CLIENTES_PATH} from '@/constants';
import toast from 'react-hot-toast';
import {ComentariosToDb} from '@/types';
import {useAppSelector} from '@/store';
import {selectUser} from '@/store/selectores';

const useUpdateComentarios = () => {
  const [isUpdatingComentario, setIsUpdatingComentario] = useState<boolean>(false);
  const {id} = useAppSelector(selectUser);

  const updateComentariosPerClienteType = useCallback(
    async (cliente: string, tipo: string, registroId: string, newComment: string): Promise<void> => {
      setIsUpdatingComentario(true);
      try {
        const newCommentToDb: ComentariosToDb = {
          comentario: newComment,
          createdBy: id,
          createdAt: Timestamp.now()
        };
        const registroRef = doc(db, `${FIRESTORE_CLIENTES_PATH}/${cliente}/${tipo}`, registroId);
        await updateDoc(registroRef, {
          updatedBy: id,
          updatedAt: Timestamp.now(),
          comentarios: arrayUnion(newCommentToDb)
        });
        toast.success(`Se ha actualizado el registro correctamente`);
      } catch (error: any) {
        toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
        DebugUtil.logError(error.message, error);
      } finally {
        setIsUpdatingComentario(false);
      }
    },
    [id]
  );

  return {
    updateComentariosPerClienteType,
    isUpdatingComentario
  };
};

export default useUpdateComentarios;
