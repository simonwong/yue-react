let rootInstance = null

function render (element, container) {
    const prevInstance = rootInstance
    const nextInstance = reconcile(container, prevInstance, element)

    rootInstance = nextInstance
}

/**
 * 
 * @param {*} parentDom 
 * @param {*} instance 
 * @param {*} element 
 */
function reconcile (parentDom, instance, element) {
    if (instance === null) {
        const newInstance = instantiate(element)
        parentDom.appendChild(newInstance.dom)

        return newInstance
    } else if (instance.element.type === element.type) {
        updateDomProperties(instance.dom, instance.element.props, element.props)
        instance.element = element

        return instance
    } else {
        const newInstance = instantiate(element)
        parentDom.appendChild(newInstance.dom, instance.dom)

        return newInstance
    }
}

/**
 * 
 * @param {*} element 
 */
function instantiate (element) {
    const { type, props } = element

    /** 1 */
    // 创建dom节点
    const isTextElement = type === 'TEXT ELEMENT'
    const dom = isTextElement
        ? document.createTextNode('')
        : document.createElement(type)

    updateDomProperties(dom, [], props) // <--------------

    /** 2 */
    // 将他的children节点们递归 创建实例
    const childElements = props.children || []
    const childInstances = childElements.map(instantiate)
    /** 3 */
    const childDoms = childInstances.map(childInstance => childInstance.dom)
    
    /** 4 */
    childDoms.forEach(childDom => dom.appendChild(childDom))

    const instance = {
        dom,
        element,
        childInstances
    }

    return instance
}

/**
 * 从dom节点中，删除所有旧属性，添加新属性
 * @param {*} dom 
 * @param {*} prevProps 
 * @param {*} nextProps 
 */
function updateDomProperties (dom, prevProps, nextProps) {
    const isEvent = name => name.startsWith('on')
    const isAttribute = name => !isEvent(name) && name !== 'children'
    
    // 解绑prev事件
    Object.keys(prevProps).filter(isEvent).forEach(name => {
        const eventType = name.toLowerCase().substring(2)
        dom.removeEventListener(eventType, prevProps[name])
    })

    // 移除prev属性
    Object.keys(prevProps).filter(isAttribute).forEach(name => {
        dom[name] = null
    })

    // 绑定next事件
    Object.keys(nextProps).filter(isEvent).forEach(name => {
        const eventType = name.toLowerCase().substring(2)
        dom.addEventListener(eventType, nextProps[name])
    })

    // 设置next属性
    Object.keys(nextProps).filter(isAttribute).forEach(name => {
        dom[name] = nextProps[name]
    })
}

const ReactDOM = {
    render,
}

export default ReactDOM
