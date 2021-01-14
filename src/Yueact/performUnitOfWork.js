import createDom from './createDom'

// 执行单元工作，并且返回下一个工作单元
function performUnitOfWork (fiber) {
  /**
   * step1: add dom node
   */
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
  // 这个会在浏览器做其他工作时，页面会显示不完整
  // if (fiber.parent) {
  //   fiber.parent.dom.appendChild(fiber.dom)
  // }
  /**
   * step2: crate new fibers
   * 也是 NodeTree => FiberTree 的过程
   * fiber 是一个链表数据结构，拥有 child parent sibling ，来更快的寻找父子兄弟节点
   */
  const elements = fiber.props.children
  let index = 0
  let prevSibling = null

  // 遍历 children ，构建 fiber
  while (index < elements.length) {
    const element = elements[index]
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    }
    if (index === 0) {
      fiber.child = newFiber
    } else {
      // 赋兄弟节点 上一个fiber.sibling = 新的fiber
      prevSibling.sibling = newFiber
    }
    prevSibling = newFiber
    index++
  }

  /**
   * step3: return next unit of work
   * 1. 如果有 child ，下一个工作单元就是 child
   * 2. 如果没有 child ，下一个工作单元是 sibling
   * 3. 如果没有 child ，和 sibling ，下一个工作单元是 “uncle”，即 parent 的 sibling
   * 4. 如果 parent 没有 sibling，那么继续往上找，直到根节点，表示完成渲染工作
   */
  if (fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber

  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }

  return nextFiber
}

export default performUnitOfWork
