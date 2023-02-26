// 在渲染阶段都已经准备好了
const effects = [
  {
    type: 'useEffect',
    create: 'useEffect1Create',
    destroy: 'useEffect1Destroy'
  },
  {
    type: 'useLayoutEffect',
    create: 'useLayoutEffect2Create',
    destroy: 'useLayoutEffect2Destroy'
  },
  {
    type: 'useEffect',
    create: 'useEffect3Create',
    destroy: 'useEffect3Destroy'
  },
  {
    type: 'useLayoutEffect',
    create: 'useLayoutEffect4Create',
    destroy: 'useLayoutEffect4Destroy'
  }
]

// 在提交阶段，在渲染之后会进入提交阶段 commit
/**
 * commit 分为三个步骤
 * 1、commitBeforeMutationEffects   DOM变更前
 * 2、commitMutationEffects         DOM变更
 * 3、commitHookLayoutEffects       DOM变更后
 * 
 * 初次挂载
 * 3、commitHookLayoutEffects 同步执行 useLayoutEffect2Create  和 useLayoutEffect4Create
 *                            异步执行 useEffect1Create 和 useEffect3Create
 * 
 * 更新的时候
 * 现在 2、commitMutationEffects 中同步执行 useLayoutEffect2Destroy  和 useLayoutEffect4Destroy
 *                               紧接着同步执行 useLayoutEffect2Create  和 useLayoutEffect4Create
 *                              异步执行  useEffect1Destroy 和 useEffect3Destroy
 *                                       useEffect1Create 和 useEffect3Create
 */