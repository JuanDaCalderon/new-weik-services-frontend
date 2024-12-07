import {Card, Button} from 'react-bootstrap';
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
};

const FileUploader = ({
  showPreview = true,
  onFileUpload,
  isRounded = false,
  onFileRemoved,
  resetFile = false
}: FileUploaderProps) => {
  const {selectedFile, handleAcceptedFiles, removeFile} = useFileUploader(showPreview);

  useEffect(() => {
    if (resetFile) removeFile(onFileRemoved);
  }, [onFileRemoved, removeFile, resetFile]);

  return (
    <>
      {!selectedFile && (
        <Dropzone onDrop={(acceptedFiles) => handleAcceptedFiles(acceptedFiles, onFileUpload)}>
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
        <div className="dropzone-previews rounded-circle w-100 h-100" id="uploadPreviewTemplate">
          <Card className="m-0 p-0 rounded-circle shadow-none border w-100 h-100">
            {selectedFile.preview && (
              <img
                className="img-thumbnail rounded-circle bg-light object-fit-cover h-100"
                width="100%"
                height="100%"
                alt={selectedFile.name}
                src={selectedFile.preview}
              />
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
    </>
  );
};

export {FileUploader};
