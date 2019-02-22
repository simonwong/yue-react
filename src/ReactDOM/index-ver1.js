const TEXT_ELEMENT = 'TEXT ELEMENT'

function render (element, parentDom) {
    const { type, props } = element // 获取类型 和 属性对象

    // 创建该类型的节点
    const isTextElement = type === TEXT_ELEMENT
    const dom = isTextElement
        ? document.createTextNode('')
        : document.createElement(type)

    // 绑定事件
    const isListener = name => name.startsWith('on')
    Object.keys(props).filter(isListener).forEach(name => {
        const eventType = name.toLowerCase().substring(2)
        dom.addEventListener(eventType, props[name])
    })

    // 设置属性
    const isAttribute = name => !isListener(name) && name !== 'children'
    Object.keys(props).filter(isAttribute).forEach(name => {
        dom[name] = props[name]
    })

    // 将他的children节点们递归加入
    const childElements = props.children || []
    childElements.forEach(childElement => render(childElement, dom))

    // 添加/更新 在父节点中
    if (!parentDom.lastChild) {
        parentDom.appendChild(dom)
    } else {
        parentDom.replaceChild(dom, parentDom.lastChild)
    }
}

const ReactDOM = {
    render,
}

export default ReactDOM
