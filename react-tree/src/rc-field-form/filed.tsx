import React from "react";
import FormContext from "./fieldContext";

interface FieldProps {
  name?: string;
  onFinish?: any;
  rules?: any;
  children: any;
}

class Field extends React.Component<FieldProps> {
  static contextType = FormContext;

  getControlled = (childProps: any) => {
    const { getFieldValue, setFieldValue } = this.context;
    const { name } = this.props;
    return {
      ...childProps,
      value: getFieldValue(name) || '',
      onChange: (event: any) => {
        setFieldValue(name, event.target.value);
      }
    }
  }

  onStoreChange = () => {
    this.forceUpdate();
  }

  componentDidMount() {
    const { registerField } = this.context;
    registerField(this);
  }

  render() {
    const { children } = this.props;
    return React.cloneElement(children, this.getControlled(children.props));
  }
}

export default Field;