export const NoFlags = /*                      */ 0b00000000000000000000000000;
export const PerformedWork = /*                */ 0b00000000000000000000000001;

export const Placement = /*                    */ 0b00000000000000000000000010;
export const Update = /*                       */ 0b00000000000000000000000100;

export const ChildDeletion = /* */ 0b00000000000000000000001000;

// 如果函数组件使用了 useEffect，那么函数组件 flags 上有1024
export const Passive = /* */ 0b00000000000000010000000000;

export const MutationMask = Placement | Update | ChildDeletion;

export const LayoutMask = Update;