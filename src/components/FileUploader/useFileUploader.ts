import {useState} from 'react';
import {FileType} from './index';
import toast from 'react-hot-toast';

export default function useFileUploader(showPreview: boolean = true) {
  const [selectedFile, setSelectedFile] = useState<FileType>();
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  /*
   * Removes the selected file
   */
  const removeFile = (callback?: () => void) => {
    if (selectedFile?.preview) URL.revokeObjectURL(selectedFile.preview);
    setSelectedFile(undefined);
    setUploadProgress(0);
    if (callback) callback();
  };

  /**
   * Handled the accepted files and shows the preview
   */
  const handleAcceptedFiles = (
    files: FileType[],
    callback?: (files: FileType) => void,
    acceptedFileTypes?: string[]
  ) => {
    const validFile = files.find((file) => !acceptedFileTypes || acceptedFileTypes.includes(file.type));
    if (validFile) {
      removeFile(); // Limpia el archivo anterior
      const file = validFile;

      // Configura el lector del archivo
      const reader = new FileReader();

      // Evento de progreso: actualiza el progreso
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress); // Actualiza el progreso
        }
      };

      // Evento cuando termina la lectura del archivo
      reader.onloadend = () => {
        if (showPreview) {
          Object.assign(file, {
            preview: validFile.type.startsWith('image') ? URL.createObjectURL(validFile) : null,
            formattedSize: formatBytes(validFile.size)
          });
          setSelectedFile(file);
        }
        setUploadProgress(100); // Progreso completo
        if (callback) callback(file);
      };

      // Evento en caso de error durante la lectura
      reader.onerror = () => {
        toast.error('Hubo un error al cargar el archivo.');
        setUploadProgress(0); // Reinicia el progreso
      };

      // Inicia la lectura del archivo (simula el proceso de carga)
      reader.readAsDataURL(file);
    } else {
      const allowedTypes = acceptedFileTypes?.join(', ') || 'archivos válidos';
      toast.error(`El archivo seleccionado no es válido. Tipos permitidos: ${allowedTypes}`);
    }
  };

  /**
   * Formats the size
   */
  const formatBytes = (bytes: number, decimals: number = 2): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return {
    selectedFile,
    uploadProgress,
    handleAcceptedFiles,
    removeFile
  };
}
