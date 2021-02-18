import Yueact from './Yueact'

function Counter () {
  const [count, setCount] = Yueact.useState(1)

  return (
    <h2 onClick={() => setCount(c => c + 1)}>Count: {count}</h2>
  )
}

/** @jsx Yueact.createElement */
function App (props) {
  return (
    <main>
      <h1>Hi, {props.name}</h1>
      <Counter />
    </main>
  )
}

/** @jsx Yueact.createElement */
const element = <App name="YUEQiNG" />

const container = document.getElementById('root')
Yueact.render(element, container)
