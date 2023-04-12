import React, {
  useState,
  useEffect,
  startTransition,
  useDeferredValue,
} from 'react'

function getWords(keyWord) {
  const words = new Array<number>(10000).fill(keyWord)
  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve(words)
  //   }, 1000)
  // })

  return Promise.resolve(words)
}

function Suggestions({ keyWord }) {
  const [word, setWord] = useState([])

  useEffect(() => {
    if (keyWord && keyWord.length > 0) {
      getWords(keyWord).then((data) => {
        startTransition(() => {
          setWord(data)
        })
      })
    }
  })
  return (
    <ul>
      {word.map((item, x) => (
        <li key={x}>{item}</li>
      ))}
    </ul>
  )
}

const StartTranstition = () => {
  const [keyWord, setKeyword] = useState('')
  return (
    <div>
      <input
        type="text"
        value={keyWord}
        onChange={(e) => {
          setKeyword(e.target.value)
        }}
      />
      <Suggestions keyWord={keyWord} />
    </div>
  )
}

export default StartTranstition
