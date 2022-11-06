import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = (): JSX.Element => {
  const [users] = useState(new Array(100).fill(0))
  return (
    <div className="list">
      <h1>列表页</h1>
      {
        users.map((user, i) => (
          <div key={i}>
            <Link to="/">{i}</Link>
          </div>
        ))
      }
    </div>
  )
}

export default Home;