let isBatchUpdate = false
let state = { number: 0 }

let updateQueue = []

function setState(newState) {
  if (isBatchUpdate) {
    updateQueue.push(newState)
  } else {
    state = newState
  }
}

const handleClick = () => {
  // 批量的
  setState({ number: state.number + 1 })

  console.log(state.number)
  setState({ number: state.number + 1 })

  console.log(state.number)
  setTimeout(() => {
    // 非批量，同步的
    setState({ number: state.number + 1 })

    console.log(state.number)
    setState({ number: state.number + 1 })
    console.log(state.number)
  }, 1000)
}

function batchUpdate(fn) {
  isBatchUpdate = true
  fn()

  isBatchUpdate = false
  updateQueue.forEach((newState) => {
    state = newState
  })
}

batchUpdate(handleClick)
