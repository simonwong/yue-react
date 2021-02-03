import { createDom, updateDom } from './dom'

// 下一个工作单元 fiber
// 【引入 fiber tree 是为了做时间切片】- 个人理解
let nextUnitOfWork = null
// 【引入 wip (work in process) 是为了避免 Fiber 局部 ui 渲染】- 个人理解
let wipRoot = null

let currentRoot = null

// 跟踪被删除的节点
let deletions = null


function commitDeletion (fiber, domParent) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom)
  } else {
    commitDeletion(fiber.child, domParent)
  }
}

// 递归的处理节点，append ，update 或者 remove
export function commitWork (fiber) {
  if (!fiber) {
    return
  }

  let domParentFiber = fiber.parent

  // 寻找具有 DOM 节点的父节点
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent
  }

  const domParent = domParentFiber.dom

  if (
    fiber.effectTag === "PLACEMENT" &&
    fiber.dom != null
  ) {
    domParent.appendChild(fiber.dom)
  } else if (
    fiber.effectTag === "UPDATE" &&
    fiber.dom != null
  ) {
    updateDom(
      fiber.dom,
      fiber.alternate.props,
      fiber.props
    )
  } else if (fiber.effectTag === "DELETION") {
    commitDeletion(fiber, domParent)
  }
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

// commit 阶段
export function commitRoot () {
  deletions.forEach(commitWork)
  commitWork(wipRoot.child)

  currentRoot = wipRoot
  wipRoot = null
}

/**
 * 调度
 * @param {*} wipFiber
 * @param {*} elements
 */
export function reconcileChildren (wipFiber, elements) {
  let index = 0
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child
  let prevSibling = null

  // 同时遍历 old fiber 和 elements
  // elements 是我们要渲染到 DOM 上的对象
  // oldFiber 是我们上一次渲染的
  while (
    index < elements.length ||
    oldFiber != null
  ) {
    const element = elements[index]
    let newFiber = null

    // compare oldFiber to element
    // 1. 如果拥有相同的 type， 那么保持 DOM， 更新新的 props
    // 2. 如果类型不同，且有新的节点，那么我们需要创建新的 DOM
    // 3. 如果累心不同，且有旧的fiber，那么我要要删除旧的节点
    // React 还使用了 key ，来更好的协调，比如子节点位置调换
    // 新增增了属性 effectTag，将在 commit 阶段使用
    const sameType = oldFiber && element && element.type == oldFiber.type

    if (sameType) {
      // update node
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        parent: wipFiber,
        dom: oldFiber.dom,
        alternate: oldFiber,
        effectTag: 'UPDATE',
      }
    }
    if (element && !sameType) {
      // add node
      newFiber = {
        type: element.type,
        props: element.props,
        parent: wipFiber,
        dom: null,
        alternate: null,
        effectTag: 'PLACEMENT',
      }
    }
    if (oldFiber && !sameType) {
      // delete oldFiber's node
      oldFiber.effectTag = "DELETION"
      deletions.push(oldFiber)
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }

    if (index === 0) {
      wipFiber.child = newFiber
    } else {
      // 赋兄弟节点 上一个fiber.sibling = 新的fiber
      prevSibling.sibling = newFiber
    }
    prevSibling = newFiber
    index++
  }
}

/**
 * 更新函数组件
 * @param {*} fiber
 */
function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)]

  reconcileChildren(fiber, children)
}


/**
 * 更新类组件
 * @param {*} fiber
 */
function updateHostComponent(fiber) {
  /**
   * step1: 为当前工作单元创建真实 DOM 节点
   */
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
  // 这个会在浏览器做其他工作时，页面会显示不完整
  // if (fiber.parent) {
  //   fiber.parent.dom.appendChild(fiber.dom)
  // }
  /**
   * step2: 创建新的 fibers ，即当前节点的子节点们，并关联他们的关系
   * fiber 是一个链表数据结构，拥有 child parent sibling ，来更快的寻找父子兄弟节点
   */
  const elements = fiber.props.children
  reconcileChildren(fiber, elements)
}

/**
 * 执行单元工作，并且返回下一个工作单元
 * @param {*} fiber
 */
export function performUnitOfWork (fiber) {
  const isFunctionComponent = fiber.type instanceof Function

  if (isFunctionComponent) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }

  /**
   * step3: 返回下一个工作单元 fiber
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

/**
 * 创建 fiber 根节点
 * @param {*} element
 * @param {*} container
 */
export function createFiberRoot (element, container) {
  // 设置 fiber root
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot, // 指向上一次 commit 到 DOM 的 fiber
  }
  deletions = []
  nextUnitOfWork = wipRoot
}

/**
 * WorkLoop
 * @param {*} deadline
 */
export function workLoop (deadline) {
  let shouldYield = false

  // 是 NodeTree => FiberTree 的过程
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)

    // 检查浏览器下一次控制我们的时间
    shouldYield = deadline.timeRemaining() < 1
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }

  window.requestIdleCallback(workLoop)
}

// 在浏览器空闲时段调用函数排队
// React 不再使用 requestIdleCallback, 而是 scheduler package，概念上差不多
window.requestIdleCallback(workLoop)
