
import { ConcurrentRoot, BlockingRoot } from '../../shared/ReactRootTags'
import { ConcurrentMode, BlockingMode, StrictMode } from './ReactTypeOfMode'

function FiberNode(tag, pendingProps, key, mode) {
  /* 实例 */
  this.tag = tag;
  // 节点 key，主要用于了优化列表 diff
  this.key = key;
  // 节点类型；FunctionComponent: 0, ClassComponent: 1, HostRoot: 3 ...
  this.elementType = null;
  this.type = null;
  // 对应到页面的真实 DOM 节点
  this.stateNode = null;

  /* Fiber */
  // 父节点
  this.return = null;
  // 子节点
  this.child = null;
  // 兄弟节点
  this.sibling = null;
  this.index = 0;

  this.ref = null;

  // 新传入的 props
  this.pendingProps = pendingProps;
  // 之前的 props
  this.memoizedProps = null;
  // 更新队列，用于暂存 setState 的值
  this.updateQueue = null;
  // 之前的 state
  this.memoizedState = null;
  this.dependencies = null;

  this.mode = mode;

  // Effects
  this.flags = NoFlags;
  this.subtreeFlags = NoFlags;
  this.deletions = null;

  // 节点更新过期时间，用于时间分片
  this.lanes = NoLanes;
  this.childLanes = NoLanes;

  // 缓存之前的 Fiber 节点，如果是空就是首次渲染
  this.alternate = null;

  // 省略了 feature 内容
  // 省略了 dev 内容
}


const createFiber = function(tag, pendingProps, key, mode) {
  return new FiberNode(tag, pendingProps, key, mode);
}

export function createHostRootFiber(tag) {

  // 省略了 mode 判断

  // 省略了 feature 内容

  return createFiber(HostRoot, null, null, mode);
}