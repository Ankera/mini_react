import React from 'react';
import { Upload, message } from 'antd';
import 'antd/lib/upload/style/index.css';
import Dragger from '../../dragger';

const DraggerDemo: React.FC = (): JSX.Element => {

  const uploadProps = {
    name: 'file',
    // action: 'https://www.mock.io/v2/5cc8019d30000098a055e76',
    action: 'http://localhost:8181/upload',
    onChange: (uploadFile: any) => {
      console.log(uploadFile);
      const { status } = uploadFile.file;
      if (status === 'done') {
        message.success('上传成功');
      } else {
        message.error('上传失败');
      }
    }
  }

  return (
    <div>
      <Dragger
        {...uploadProps}
      >
        上传文件
      </Dragger>
    </div>
  )
}

export default DraggerDemo;