// fiber 要做三件事情
// 添加元素到 DOM
// 为子元素创建 fiber
// 选择下一个工作单元

const isProperty = key => key !== 'children'

function createDom (fiber) {
  // 处理特殊类型 TEXT_ELEMENT
  const dom = fiber.type === 'TEXT_ELEMENT'
    ? document.createTextNode('') // 使用 textNode 而不是 innerText 允许我们以相同的方式处理
    : document.createElement(fiber.type)

  // 处理参数
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = fiber.props[name]
    })

  return dom
}

export default createDom
