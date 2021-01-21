# Yueact 

Base react@16.8 without all the optimizations and non-essential features

## 思考与理解

### render 过程

**step 1: render && createElement**

通过 createElement 创建虚拟 DOM

render 函数通过虚拟 DOM 递归构建节点。

问题：递归构建节点，一旦开始渲染就不会停止，如果树很大，可能会长时间阻塞主线程。

**step 2.1: Concurrent Mode && Fibers**

引入 Fiber ，每次只在浏览器空闲的时候才去构建 Fiber 树。【 Virtual DOM tree => fiber tree 的过程，为了做时间切片 】

问题：通过 Fiber 加入新的 node ，浏览器可能会**打断**我们的工作，导致用户看到一个不完成的页面

**step 2.2: Render & Commit Phases**

构建完成后然后到了 commit 阶段，递归的将 dom 


引入 wipRoot (work in process root) ，在 Fiber tree 构建完后，进入到 Commit 阶段，
递归的将所有 fiber 节点一次性 append 上去 【 引入 wip (work in process) 是为了避免 Fiber 局部 ui 渲染 】


**step 3: Reconciliation**

根据 alternate （上一次更新后的 fiber）和 wipFiber （当前新的 fiber）做对比，在 commitWork 中不同情况用不同的方式处理

## 参考

- [build-your-own-react - Pombo](https://pomb.us/build-your-own-react/)
- [React 技术揭秘 - 卡颂大佬](https://react.iamkasong.com/)

## Legacy
react@15 version 👀 [tag: v1.0.0](https://github.com/simonwong/yue-react/tree/v1.0.0)
