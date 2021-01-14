import performUnitOfWork from './performUnitOfWork'

// 下一个工作单元 fiber
// 【引入 fiber tree 是为了做时间切片】- 个人理解
let nextUnitOfWork = null
// 【引入 wip (work in process) 是为了避免 Fiber 局部 ui 渲染】- 个人理解
let wipRoot = null

function commitRoot () {
  commitWork(wipRoot.child)
  wipRoot = null
}

// 递归的将 node append 到 dom
function commitWork (fiber) {
  if (!fiber) {
    return
  }
  const domParent = fiber.parent.dom
  domParent.appendChild(fiber.dom)
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function workLoop (deadline) {
  let shouldYield = false

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


function render (element, container) {
  // 设置 fiber root
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
  }

  nextUnitOfWork = wipRoot
}

export default render
