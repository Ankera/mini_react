let state = { number: 0 }

let updateQueue = []

// 数字越小，优先级越高
let InputPriority = 1
let NormalPriority = 2

// 上一次优先级
let lastPriority

function setState(newState, priority) {
  updateQueue.push(newState)

  if (lastPriority === priority) {
    return
  }
  lastPriority = priority

  setTimeout(() => {
    updateQueue.forEach((newState) => {
      state = newState
    })
    updateQueue.length = 0
  }, 0)
}

const handleClick = () => {
  // 批量的
  setState({ number: state.number + 1 }, InputPriority)

  console.log(state.number)
  setState({ number: state.number + 1 }, InputPriority)

  console.log(state.number)
  setTimeout(() => {
    // 非批量，同步的
    setState({ number: state.number + 1 }, NormalPriority)

    console.log(state.number)
    setState({ number: state.number + 1 }, NormalPriority)
    console.log(state.number)
  }, 1000)
}

function batchUpdate(fn) {
  fn()
}

batchUpdate(handleClick)

/**
 * react 17 以前 批量更新是依赖 isBatchUpdate
 *
 * react 18 批量更新是依赖优先级
 */
