import { updateInstance } from '../ReactDOM/index'

export default class Component {
    constructor(props = {}) {
        this.props = props
        this.state = this.state || {}
    }
    
    setState (partialState) {
        this.state = Object.assign({}, this.state, partialState)
        
        // 内部实例的引用，更新虚拟dom树以及html
        updateInstance(this.__internalInstance)
    }
}