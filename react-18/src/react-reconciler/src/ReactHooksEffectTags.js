
// 无 effect
export const NoFlags = 0b0000;

// 有effect
export const HasEffect = 0b0001;

// 
export const Insertion = 0b0010;


// useLayoutEffect 积极的，会在 UI 绘制前执行，类似微任务
export const Layout = 0b0100;

// useEffect 消极的，会在 UI 绘制后执行，类似宏任务
export const Passive = 0b1000;