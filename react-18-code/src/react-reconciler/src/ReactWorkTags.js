export const FunctionComponent = 0;

export const ClassComponent = 1;

// 一开始不知道是函数组件或者类组件，统一标识
export const IndeterminateComponent = 2;

// 跟 fiber 节点类型
export const HostRoot = 3;

// 原生 div，span
export const HostComponent = 5;

export const HostText = 6;