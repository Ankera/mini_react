import React, { useRef } from 'react';
import FormContext from './fieldContext';
import useForm from './useForm';

interface FormProps {
  children?: React.ReactNode;
  onFinish?: any;
  onFinishFailed?: any;
  initialValues?: {
    [key: string]: any;
  }
}

const Form: React.FC<FormProps> = ({ initialValues, onFinish, onFinishFailed, children }) => {
  const [formInstance] = useForm();

  formInstance.setCallback({
    initialValues,
    onFinish,
    onFinishFailed
  });

  const mountRef = useRef<boolean | null>(null);

  formInstance.setInitValues(initialValues, mountRef.current);

  if (!mountRef.current) {
    mountRef.current = true;
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (typeof formInstance.submit === 'function') {
          formInstance.submit();
        }
      }}
    >
      <FormContext.Provider value={formInstance}>
        {children}
      </FormContext.Provider>
    </form>
  )
}

export default Form;