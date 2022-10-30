import React from "react";
import { Button } from 'antd';
// import Form, { Field } from 'rc-field-form';
import Form, { Field } from '../../rc-field-form';

class CustomFrom extends React.Component {
  render() {
    return (
      <div>
        <div>
          <Button type="primary">按钮</Button>
        </div>

        <Form
          // initialValues={{ username: '111', password: '222' }}
          onFinish={(values: any) => {
            console.log('成功', values)
          }}
          onFinishFailed={(errorInfo: any) => {
            console.log('失败', errorInfo)
          }}
        >
          <Field
            name="username"
            rules={[
              {
                required: true,
                message: 'Username'
              },
              {
                validator: (rule: any, value: any) => {
                  return new Promise((resolve, reject) => {
                    if (value === 'zimu') {
                      resolve('名字重复')
                    } else {
                      resolve('');
                    }
                  })
                }
              }
            ]}
          >
            <input type="text" placeholder="用户名" />
          </Field>
          <Field
            name="password"
            rules={[
              {
                required: true,
                message: 'Username'
              },
              {
                min: 4,
                message: '最小4个字符'
              },
              {
                max: 10,
                message: '最大10个字符'
              }
            ]}
          >
            <input type="text" placeholder="密码" />
          </Field>
          <button>提交</button>
        </Form>
      </div>
    )
  }
}

export default CustomFrom;