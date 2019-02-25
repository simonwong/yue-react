let rootInstance = null

/**
 * render
 * @param {*} element 
 * @param {*} container 
 */
function render (element, container) {
    const prevInstance = rootInstance
    const nextInstance = reconcile(container, prevInstance, element)

    rootInstance = nextInstance
}

/**
 * 调度算法函数
 * @param {*} parentDom 
 * @param {*} instance 前一次渲染的实例
 * @param {*} element 新一次渲染的虚拟节点
 */
function reconcile (parentDom, instance, element) {
    if (instance == null) {
        const newInstance = instantiate(element)
        parentDom.appendChild(newInstance.dom)

        return newInstance
    } else if (element == null) {
        parentDom.removeChild(instance.dom)
        return null 
    } else if (instance.element.type !== element.type) {
        const newInstance = instantiate(element)
        parentDom.replaceChild(newInstance.dom, instance.dom)
        
        return newInstance
    } else if (typeof element.type === 'string') {
        // 节点没有改变，那么只进行更新属性
        updateDomProperties(instance.dom, instance.element.props, element.props)
        // 对孩子数组进行替换
        instance.childInstances = reconcileChildren(instance, element)
        instance.element = element

        return instance
    
    // 更新组件
    } else {
        instance.publicInstance.props = element.props // 更新props

        const childElement = instance.publicInstance.render() // 组件的render函数
        const oldChildInstance = instance.childInstance
        const childInstance = reconcile(parentDom, oldChildInstance, childElement) // 子节点对比

        instance.dom = childInstance.dom // 更新dom
        instance.childInstance = childInstance // 更新虚拟dom树
        instance.element = element // 更新元素

        return instance
    }
}

/**
 * 子节点的递归调度
 * @param {*} instance 
 * @param {*} element 
 */
function reconcileChildren (instance, element) {
    const { dom, childInstances } = instance
    const nextChildElements = element.props.children || []
    const newChildInstances = []

    const count = Math.max(childInstances.length, nextChildElements.length)
    for (let i = 0; i < count; i++) {
        const childInstance = childInstances[i]
        const childElement = nextChildElements[i]
        // 对子节点，递归调度函数
        const newChildInstance = reconcile(dom, childInstance, childElement)

        newChildInstances.push(newChildInstance)
    }

    return newChildInstances.filter(instance => instance != null)
}

/**
 * 创建公共实例
 * @param {*} element 
 * @param {*} internalInstance 
 */
function createPublicInstance (element, internalInstance) {
    const { type, props } = element
    // 新建一个实例
    const publicInstance = new type(props)

    publicInstance.__internalInstance = internalInstance

    return publicInstance
}

/**
 * 更新实例
 * @param {*} internalInstance 
 */
function updateInstance (internalInstance) {
    const parentDom = internalInstance.dom.parentNode
    const element = internalInstance.element

    reconcile(parentDom, internalInstance, element)
}

/**
 * 节点实例
 * @param {*} element 
 */
function instantiate (element) {
    const { type, props } = element
    const isDomElement = typeof type === 'string'

    if (isDomElement) {
        /** 1 */
        // 创建dom节点
        const isTextElement = type === 'TEXT ELEMENT'
        const dom = isTextElement
            ? document.createTextNode('')
            : document.createElement(type)
    
        updateDomProperties(dom, [], props)
    
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
    } else {
        const instance = {}

        // 创建公共实例
        // 1. 新建 newApp = new App()
        // 2. newApp.__internalInstance = instance
        // 3. publicInstance = newApp
        const  publicInstance = createPublicInstance(element, instance)

        const childElement = publicInstance.render()

        const childInstance = instantiate(childElement)
        const dom = childInstance.dom
        // 组件元素比普通元素多了一个自身的实例
        // 组件内部只能有一个子节点，所以是`childInstance`，而不是`childInstances`
        Object.assign(instance, { dom, element, childInstance, publicInstance })

        return instance
    }
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
    updateInstance,
}

export default ReactDOM
