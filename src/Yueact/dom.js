// fiber 要做三件事情
// 添加元素到 DOM
// 为子元素创建 fiber
// 选择下一个工作单元

// 特殊的 props ，事件监听
const isEvent = key => key.startsWith('on')
const isProperty = key => key !== 'children' && !isEvent(key)
const isNew = (prev, next) => key => prev[key] !== next[key]
const isGone = (prev, next) => key => !(key in next)

export function createDom (fiber) {
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

export function updateDom (dom, prevProps, nextProps) {
  console.log(dom, prevProps, nextProps)
  // 移除事件监听
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(
      key =>
        !(key in nextProps) ||
        isNew(prevProps, nextProps)(key)
    )
    .forEach(name => {
      const eventType = name
        .toLowerCase()
        .substring(2)

      dom.removeEventListener(
        eventType,
        prevProps[name]
      )
    })

  // remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => {
      dom[name] = ''
    })

  // set new or change
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      dom[name] = nextProps[name]
    })
  // 添加事件监听
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name
        .toLowerCase()
        .substring(2)

      dom.addEventListener(
        eventType,
        nextProps[name]
      )
    })
}
