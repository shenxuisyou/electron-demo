import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './views/Home/index'
import About from './views/About/index'
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from './store/reducers/counter'

function App(): JSX.Element {
  const count = useSelector((state) => state.counter.value)
  const dispatch = useDispatch()
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav>
        <button aria-label="Increment value" onClick={() => dispatch(increment())}>
          Increment
        </button>
        <span>{count}</span>
        <button aria-label="Decrement value" onClick={() => dispatch(decrement())}>
          Decrement
        </button>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
