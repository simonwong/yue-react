// import Component from './component'

const TEXT_ELEMENT = 'TEXT ELEMENT'

function createElement (type, config, ...args) {
    const props = Object.assign({}, config)
    const hasChildren = args.length > 0
    const rawChildren = hasChildren ? [].concat(...args) : []

    // 过滤空值，将文本类型的转成规范数据格式
    props.children = rawChildren
        .filter(c => c != null && c !== false)
        .map(c => c instanceof Object ? c : createTextElement(c))

    return { type, props }
}

function createTextElement (value) {
    // 规范数据格式
    return createElement(TEXT_ELEMENT, { nodeValue: value })
}

const React = {
    createElement,
    // Component
}

export default React
