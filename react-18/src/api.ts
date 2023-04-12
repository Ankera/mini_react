export function getUser(id = 1) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ id, name: 'Tom' })
      // reject({ errorMessage: '异常错误' })
    }, 1000 * id)
  })
}
