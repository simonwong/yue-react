/**
 * 创建(实例化)组件
 * @param {*} component 
 * @param {*} props 
 */
function createComponent (component, props) {
    let inst;

    // 类定义组件 --> 返回实例
    if (component.prototype && component.prototype.render) {
        inst = new component(props)
    
    // 函数定义组件 --> 扩展为类定义组件
    } else {
        inst = new Component(props)
        inst.constructor = component
        inst.render = function () {
            return this.constructor(props)
        }
    }

    return inst
}

/**
 * 更新props，并实现componentWillMount componentWillReceiveProps生命周期
 * @param {*} component 
 * @param {*} props 
 */
function setComponentProps (component, props) {
    if (!component.base) {
        component.componentWillMount && component.componentWillMount()
    } else if (component.componentWillReceiveProps) {
        component.componentWillReceiveProps(props)
    }

    component.porps = props

    renderComponent(component)
}

/**
 * 渲染组件，setState会直接调用该方法
 * 实现生命周期componentWillUpdate componentDidUpdate componentDidMount
 * @param {*} component 
 */
function renderComponent (component) {
    let base
    const renderer = component.render()

    if (component.base && component.componentWillUpdate) {
        component.componentWillUpdate()
    }

    base = _render(renderer)

    if (component.base) {
        component.componentDidUpdate && component.componentDidUpdate();
    } else if (component.componentDidMount) {
        component.componentDidMount();
    }

    if (component.base && component.base.parentNode ) {
        component.base.parentNode.replaceChild( base, component.base );
    }

    component.base = base;
    base._component = component;
}

/**
 * 给节点设置属性
 * @param {*} dom 
 * @param {*} name 
 * @param {*} value 
 */
function setAttribute (dom, name, value) {
    // className --> class
    if (name === 'className') name = 'class';

    // onXXX --> 事件监听方法
    if (/on\w+/.test(name)) {
        name = name.toLowerCase();
        dom[name] = value || '';
    // style --> 新style对象
    } else if (name === 'style') {
        if (!value || typeof value === 'string') {
            dom.style.cssText = value || '';
        } else if (value && typeof value === 'object') {
            for (let name in value) {
                // 可以通过style={ width: 20 }这种形式来设置样式，可以省略掉单位px
                dom.style[name] = typeof value[name] === 'number' ? value[name] + 'px' : value[name];
            }
        }
    // 普通属性则直接更新属性
    } else {
        if (name in dom) {
            dom[name] = value || '';
        }
        if (value) {
            dom.setAttribute(name, value);
        } else {
            dom.removeAttribute(name, value);
        }
    }
}

/**
 * 判断节点类型再输出
 * 这里是用了直接替换节点的方式， 省略了diff算法
 * @param {*} vnode 
 */
function _render (vnode) {
    if (vnode === undefined || vnode === null || typeof vnode === 'boolean') {
        vnode = ''
    }
    if (typeof vnode === 'number') {
        vnode = String(vnode)
    }
    if (typeof vnode === 'string') {
        let textNode = document.createTextNode(vnode)
        return textNode
    }
    // 判断是否是组件
    if (typeof vnode.tag === 'function') {
        const component = createComponent(vnode.tag, vnode.attrs)
        setComponentProps(component, vnode.attrs)
        return component.base
    }

    const dom = document.createElement(vnode.tag)

    if (vnode.attrs) {
        Object.keys(vnode.attrs).forEach((key) => {
            const value = vnode.attrs[key]

            // 节点设置属性
            setAttribute(dom, key, value)
        })
    }

    // 递归子节点
    vnode.children.forEach(child => render(child, dom))

    return dom
}

/**
 * 渲染jsx的vnode到真实节点
 * @param {*} vnode 
 * @param {*} container 
 */
export function render (vnode, container) {
    return container.appendChild(_render(vnode))
}

/**
 * component的类
 */
export default class Component {
    constructor(props = {}) {
        this.state = {}
        this.props = props
    }
    
    setState (stateChange) {
        Object.assign(this.state, stateChange)
        renderComponent(this)
    }
}