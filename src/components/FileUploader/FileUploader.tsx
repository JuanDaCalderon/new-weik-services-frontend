import {Card, Button, ProgressBar, Image} from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import useFileUploader from './useFileUploader';
import {useEffect} from 'react';

export type FileType = File & {
  preview?: string;
  formattedSize?: string;
};

type FileUploaderProps = {
  onFileUpload?: (files: FileType) => void;
  onFileRemoved?: () => void;
  resetFile?: boolean;
  showPreview?: boolean;
  isRounded?: boolean;
  acceptedFileTypes?: string[];
  isSquarePreview?: boolean;
  ratio?: string;
};

const FileUploader = ({
  showPreview = true,
  onFileUpload,
  isRounded = false,
  onFileRemoved,
  resetFile = false,
  isSquarePreview = false,
  acceptedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'], // Por defecto, solo imágenes
  ratio = '4x3'
}: FileUploaderProps) => {
  const {selectedFile, uploadProgress, handleAcceptedFiles, removeFile} = useFileUploader(showPreview);

  useEffect(() => {
    if (resetFile) removeFile(onFileRemoved);
  }, [onFileRemoved, removeFile, resetFile]);

  return (
    <>
      {!selectedFile && (
        <Dropzone onDrop={(acceptedFiles) => handleAcceptedFiles(acceptedFiles, onFileUpload, acceptedFileTypes)}>
          {({getRootProps, getInputProps}) => (
            <div className={`dropzone ${isRounded && 'rounded-circle'} m-0 p-0`}>
              <div className="dz-message needsclick m-0 p-0" {...getRootProps()}>
                <input {...getInputProps()} />
                <i className="h2 text-muted ri-upload-cloud-2-line p-0 m-0"></i>
                <p className="m-0 p-0">Haz clic para subir.</p>
              </div>
            </div>
          )}
        </Dropzone>
      )}

      {showPreview && !!selectedFile && (
        <div
          className={`dropzone-previews ${!isSquarePreview ? 'rounded-circle' : ''} w-100 ${!isSquarePreview ? 'h-100' : ''}`}
          id="uploadPreviewTemplate">
          <Card
            className={`m-0 p-0 ${!isSquarePreview ? 'rounded-circle' : ''} shadow-none border w-100 ${!isSquarePreview ? 'h-100' : ''}`}>
            {selectedFile.preview && (
              <>
                {isSquarePreview ? (
                  <div className={`w-100 position-relative ratio ratio-${ratio}`}>
                    <Image
                      src={selectedFile.preview}
                      alt={selectedFile.name}
                      fluid
                      loading="lazy"
                      className="w-100 h-100 object-fit-fill rounded"
                    />
                  </div>
                ) : (
                  <img
                    className={`img-thumbnail ${!isSquarePreview ? 'rounded-circle' : ''} bg-light object-fit-cover h-100`}
                    width="100%"
                    height="100%"
                    alt={selectedFile.name}
                    src={selectedFile.preview}
                  />
                )}
              </>
            )}

            <Button
              variant="danger"
              className="btn-icon shadow-none p-0 m-0 position-absolute top-0 end-0 d-flex justify-content-center align-items-center"
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '100px',
                borderColor: 'transparent'
              }}
              onClick={() => removeFile(onFileRemoved)}>
              <i className="ri-close-line font-24"></i>
            </Button>
          </Card>
        </div>
      )}

      {!!uploadProgress && (
        <ProgressBar
          now={uploadProgress}
          label={`${uploadProgress}%`}
          variant="success"
          className="position-relative mt-1"
          animated
          striped
        />
      )}
    </>
  );
};

export {FileUploader};
