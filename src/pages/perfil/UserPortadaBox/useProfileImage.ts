import {FileType} from '@/components';
import {useUserProfileImage} from '@/endpoints';
import {useToggle} from '@/hooks';
import {useCallback, useState} from 'react';

export default function useProfileImage() {
  const [isProfileImageEdit, toggleProfileImageEdit, _s, hideProfileImageEdit] = useToggle(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [profileImage, setProfileImage] = useState<FileType>();
  const [isUpdatingProfileImage, setIsUpdatingProfileImage] = useState<{
    startToLoad: boolean;
    hasLoad: boolean;
  }>({
    startToLoad: false,
    hasLoad: false
  });
  const {updateProfileImage} = useUserProfileImage();

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleImageFile = useCallback((file: FileType) => {
    setProfileImage(file);
  }, []);

  const handleImageRemoved = useCallback(() => {
    setProfileImage(undefined);
  }, []);

  const resetLoaders = useCallback(() => {
    setIsUpdatingProfileImage({startToLoad: false, hasLoad: false});
  }, []);

  const handleOnSubmit = useCallback(async () => {
    setIsUpdatingProfileImage({startToLoad: true, hasLoad: false});
    if (profileImage) await updateProfileImage(profileImage);
    setIsUpdatingProfileImage({startToLoad: false, hasLoad: true});
  }, [profileImage, updateProfileImage]);

  return {
    isProfileImageEdit,
    isLoading,
    profileImage,
    isUpdatingProfileImage,
    toggleProfileImageEdit,
    hideProfileImageEdit,
    handleImageLoad,
    handleImageFile,
    handleImageRemoved,
    handleOnSubmit,
    resetLoaders
  };
}
