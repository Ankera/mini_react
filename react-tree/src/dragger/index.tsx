import React, { useState, useEffect, useRef, MutableRefObject, RefObject } from 'react';
import { Progress } from 'antd';
import 'antd/lib/progress/style/index.css';
import './index.less';

export type DraggerProps = React.PropsWithChildren<{
  name: string;
  onChange?: any;
  action: string;
}>

export interface UploadFile {
  file: File;
  percent: number;
  url?: string;
  status: string;
}

const Dragger: React.FC<DraggerProps> = (props): JSX.Element => {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const uploadContainer: MutableRefObject<HTMLDivElement | undefined> = useRef<HTMLDivElement | undefined>();

  const onDragEnter: (ev: DragEvent) => void = (ev: DragEvent): void => {
    ev.preventDefault();
    ev.stopPropagation();
  }

  const onDragOver: (ev: DragEvent) => void = (ev: DragEvent): void => {
    ev.preventDefault();
    ev.stopPropagation();
  }

  const onDragLeave: (ev: DragEvent) => void = (ev: DragEvent): void => {
    ev.preventDefault();
    ev.stopPropagation();
  }

  const onDragDrop: (ev: DragEvent) => void = (ev: DragEvent): void => {
    ev.preventDefault();
    ev.stopPropagation();
    console.log('drop');
    if (ev.dataTransfer && ev.dataTransfer.files) {
      upload(ev.dataTransfer.files)
    }
  }

  function upload(files: FileList) {
    console.log('files', files);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('filename', file.name);
      formData.append(props.name, file);
      const xhr = new XMLHttpRequest();
      xhr.open('POST', props.action);
      xhr.responseType = 'json';
      const uploadFile: UploadFile = {
        file,
        percent: 0,
        status: 'loading',
        url: '',
      };
      uploadFiles.push(uploadFile);

      xhr.onprogress = onUploadProgress;

      xhr.upload.onprogress = onUploadProgress;

      function onUploadProgress(event: ProgressEvent): void {
        if (event.lengthComputable) {
          const percent: number = parseInt((event.loaded / event.total * 100).toFixed(2), 10);
          uploadFile.percent = percent;
          if (percent >= 100) {
            uploadFile.status = 'done';
          }
          setUploadFiles([...uploadFiles]);
        }
      }

      xhr.onerror = function () {
        uploadFile.status = 'error';
        setUploadFiles([...uploadFiles]);
      }

      xhr.timeout = 10000;

      xhr.ontimeout = function () {
        uploadFile.status = 'onerror';
        setUploadFiles([...uploadFiles]);
      }

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          uploadFile.url = xhr.response.url;
          props.onChange(uploadFile);
        }
      }
      xhr.send(formData);
    }
  }

  useEffect(() => {
    if (uploadContainer.current) {
      uploadContainer.current.addEventListener('dragenter', onDragEnter);
      uploadContainer.current.addEventListener('dragover', onDragOver);
      uploadContainer.current.addEventListener('dragleave', onDragLeave);
      uploadContainer.current.addEventListener('drop', onDragDrop);

      return () => {
        if (uploadContainer.current) {
          uploadContainer.current.removeEventListener('dragenter', onDragEnter);
          uploadContainer.current.removeEventListener('dragover', onDragOver);
          uploadContainer.current.removeEventListener('dragleave', onDragLeave);
          uploadContainer.current.removeEventListener('drop', onDragDrop);
        }
      }
    }
  }, [])

  return (
    <>
      <div
        className="upload-container"
        ref={uploadContainer as RefObject<HTMLDivElement>}

      >
        上传文件
      </div>
      {
        uploadFiles.map((upload: UploadFile, index: number) => (
          <div key={index}>
            <div>
              <span>{upload.file.name}</span>
            </div>
            <Progress percent={upload.percent} />
          </div>
        ))
      }
    </>
  )
}

export default Dragger;