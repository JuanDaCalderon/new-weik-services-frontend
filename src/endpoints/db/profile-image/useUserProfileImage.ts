import {useCallback} from 'react';
import {db, storage} from '@/firebase';
import {useDispatch} from 'react-redux';
import {FileType} from '@/components';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import {USUARIOS_PATH} from '@/constants';
import {doc, setDoc} from 'firebase/firestore';
import toast from 'react-hot-toast';
import {DebugUtil} from '@/utils';
import {updateUserImage} from '@/store/slices/user';
import {useAppSelector} from '@/store';
import {selectUser} from '@/store/selectores';

const useUserProfileImage = () => {
  const {userName, id} = useAppSelector(selectUser);
  const dispatch = useDispatch();

  const updateProfileImage = useCallback(
    async (image: FileType): Promise<void> => {
      const newImage = image;
      const storageRef = ref(storage, `weik/users/${id}_${userName}`);
      try {
        await uploadBytes(storageRef, newImage);
        const userImage = await getDownloadURL(storageRef);
        await setDoc(doc(db, USUARIOS_PATH, id), {userImage}, {merge: true});
        dispatch(updateUserImage(userImage));
        toast.success(`Imagen de perfil actualizada.`);
      } catch (error: any) {
        toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
        DebugUtil.logError(error.message, error);
      }
    },
    [dispatch, id, userName]
  );

  return {
    updateProfileImage
  };
};

export default useUserProfileImage;
