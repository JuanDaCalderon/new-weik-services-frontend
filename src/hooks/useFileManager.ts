import {FileType} from '@/components';
import {useTogglev2} from '@/hooks';
import {useCallback, useState} from 'react';

export default function useFileManager() {
  const {isOpen, toggle, hide} = useTogglev2(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [file, setFile] = useState<FileType>();
  const [isUpdatingFile, setIsUpdatingFile] = useState({startToLoad: false, hasLoad: false});

  const handleFileLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleFile = useCallback((file: FileType) => {
    setFile(file);
  }, []);

  const handleFileRemoved = useCallback(() => {
    setFile(undefined);
  }, []);

  const resetLoaders = useCallback(() => {
    setIsUpdatingFile({startToLoad: false, hasLoad: false});
  }, []);

  return {
    isFileManagerEdit: isOpen,
    isLoading,
    file,
    isUpdatingFile,
    toggleFileManagerEdit: toggle,
    hideFileManagerEdit: hide,
    handleFileLoad,
    handleFile,
    handleFileRemoved,
    setIsUpdatingFile,
    resetLoaders
  };
}
