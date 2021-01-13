const isProperty = key => key !== 'children'

function render (element, container) {
  // 处理特殊类型 TEXT_ELEMENT
  const dom = element.type === 'TEXT_ELEMENT'
    ? document.createTextNode('') // 使用 textNode 而不是 innerText 允许我们以相同的方式处理
    : document.createElement(element.type)

  // 处理参数
  Object.keys(element.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = element.props[name]
    })

  element.props.children.forEach(child => {
    render(child, dom)
  })

  container.appendChild(dom)
}

export default render
