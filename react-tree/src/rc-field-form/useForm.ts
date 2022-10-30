import { useRef, useState } from 'react';
import Schema from './async-validator';

class FormStore {
  private store: Record<string, any>;
  private callbacks: Record<string, any>;
  private forceRootRender: () => void;
  private fieldEntities: any[];
  constructor(forceRootRender: () => void) {
    // 用来存放表单值
    this.store = {};
    // form 上方法
    this.callbacks = {};
    // 刷新组件
    this.forceRootRender = forceRootRender;
    // Field 实例
    this.fieldEntities = [];
  }

  private registerField = (fieldEntity: any) => {
    this.fieldEntities.push(fieldEntity);
  }

  private setInitValues = (initialValues: any, mounted: boolean) => {
    if (!mounted) {
      this.store = { ...(initialValues || {}) };
    }
  }

  private getFieldValue = (name: string) => {
    return this.store[name];
  }

  private getFieldsValue = () => {
    return this.store;
  }

  private forceUpdate = () => {
    this.fieldEntities.forEach(entity => {
      entity.onStoreChange();
    })
  }

  private setFieldValue = (name: string, value: any) => {
    this.store[name] = value;
    this.forceUpdate();
  }

  private setFieldsValue = (newStore = {}) => {
    this.store = {
      ...this.store,
      ...newStore
    }
    this.forceUpdate();
  }

  private setCallback = (callbacks: any) => {
    this.callbacks = callbacks;
  }

  private validateFields = () => {
    const values = this.getFieldsValue();
    const descriptor: any = this.fieldEntities.reduce((desc, entity) => {
      const rules = entity.props.rules;
      if (Array.isArray(rules) && rules.length > 0) {
        const config = rules.reduce((memo, rule) => {
          memo = { ...memo, ...rule }
          return memo;
        }, {})
        desc[entity.props.name] = config;
      }
      return desc;
    }, {});
    return new Schema(descriptor).validate(values);
  }

  private submit = () => {
    this.validateFields()
      .then((values: any) => {
        const { onFinish } = this.callbacks;
        if (typeof onFinish === 'function') {
          onFinish(values);
        }
      })
      .catch((errorInfo: any) => {
        const { onFinishFailed } = this.callbacks;
        if (typeof onFinishFailed === 'function') {
          onFinishFailed(errorInfo);
        }
      })
  }

  getForm = () => {
    return {
      getFieldValue: this.getFieldValue,
      getFieldsValue: this.getFieldsValue,
      setFieldValue: this.setFieldValue,
      setFieldsValue: this.setFieldsValue,
      setCallback: this.setCallback,
      setInitValues: this.setInitValues,
      registerField: this.registerField,
      submit: this.submit
    }
  }
}

const useForm = (): any[] => {
  let formRef = useRef<any>(null);
  const [, forceUpdate] = useState({});

  if (!formRef.current) {
    const forceReRender = () => {
      forceUpdate({});
    }
    const formStore = new FormStore(forceReRender);
    const formInstance = formStore.getForm();

    formRef.current = formInstance;
  }

  return [formRef.current];
}

export default useForm;