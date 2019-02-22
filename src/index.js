import React from './React'
import ReactDOM from './ReactDOM'

// class Welcome extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             count: 0
//         }

//         this.handleAddCount = this.handleAddCount.bind(this)
//     }
//     componentWillMount () {
//         console.log('WillMount')
//     }
//     componentWillReceiveProps () {
//         console.log('WillReceiveProps')
//     }
//     componentWillUpdate () {
//         console.log('WillUpdate')
//     }
//     componentDidUpdate () {
//         console.log('DidUpdate')
//     }
//     componentDidMount () {
//         console.log('DidMount')
//     }
    
//     handleAddCount () {
//         this.setState({
//             count: this.state.count + 1
//         })
//     }

//     render () {
//         return (
//             <div>
//                 <h1>Hello, { this.props.name }</h1>
//                 <h3>当前数值 <span style={{color: 'red'}}>{ this.state.count }</span></h3>
//                 <button onClick={this.handleAddCount}>Add</button>
//             </div>
//         )
//     }
// }

// const element = <Welcome name="World" />

// ReactDOM.render(
//     element,
//     document.getElementById('root')
// )

function tick () {
    const time = new Date().toLocaleTimeString()
    const clockElement = <h1>{time}</h1>

    ReactDOM.render(clockElement, document.getElementById('root'))
}

tick()

setInterval(tick, 1000)
