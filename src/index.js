import Yueact from './Yueact'

/** @jsx Yueact.createElement */
function App (props) {
  return <h1>Hi, {props.name}</h1>
}

/** @jsx Yueact.createElement */
const element = <App name="YUEQiNG" />

const container = document.getElementById('root')
Yueact.render(element, container)
