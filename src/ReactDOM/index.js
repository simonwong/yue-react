import { render } from '../React/component'

const ReactDOM = {
    render: (vnode, container) => {
        container.innerHTML = ''
        render(vnode, container)
    }
}

export default ReactDOM
