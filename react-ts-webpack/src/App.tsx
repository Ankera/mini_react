import React from 'react'
import Decor from "./decor";
import { getCurrentTime } from "@/utils/date";
import './App.less'

function App() {
  return (
    <div>
      <h1>{getCurrentTime()}</h1>
      <h2>Hello world === {process.env.NODE_ENV}</h2>

      <Decor/>
    </div>
  )
}

export default App;