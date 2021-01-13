import Yueact from './Yueact'

/** @jsx Yueact.createElement */
const element = <h1 title="foo">Hello</h1>

// // step 0.1
// const element = {
//   type: "h1",
//   props: {
//     title: "foo",
//     children: "Hello", // string or array
//   },
// }

const container = document.getElementById('root')
Yueact.render(element, container)

// // step 0.2
// const node = document.createElement(element.type)
// node['title'] = element.props.title

// const text = document.createTextNode('')
// text['nodeValue'] = element.props.children

// node.appendChild(text)
// container.appendChild(node)
