import {createHostRootFiber} from './ReactFiber'

function FiberRootNode(containerInfo, tag, hydrate) {
  this.tag = tag;
  this.current = null;
  this.containerInfo = containerInfo;
  this.pendingChildren = null;
  this.pingCache = null;
  this.finishedExpirationTime = NoWork;
  this.finishedWork = null;
  this.timeoutHandle = noTimeout;
  this.context = null;
  this.pendingContext = null;
  this.hydrate = hydrate;
  this.callbackNode = null;
  this.callbackPriority = NoPriority;
  this.firstPendingTime = NoWork;
  this.firstSuspendedTime = NoWork;
  this.lastSuspendedTime = NoWork;
  this.nextKnownPendingLevel = NoWork;
  this.lastPingedTime = NoWork;
  this.lastExpiredTime = NoWork;

  // feature 通过 polifle 包使得生效
  // if (enableSchedulerTracing) {
  //   // this.interactionThreadID = unstable_getThreadID();
  //   this.memoizedInteractions = new Set();
  //   this.pendingInteractionMap = new Map();
  // }
  // if (enableSuspenseCallback) {
  //   this.hydrationCallbacks = null;
  // }
}

export function createFiberRoot(containerInfo, tag, hydrate, hydrationCallbacks) {
  // FiberRoot
  const root = new FiberRootNode(containerInfo, tag, hydrate);
  if (enableSuspenseCallback) {
    root.hydrationCallbacks = hydrationCallbacks;
  }


  const uninitializedFiber = createHostRootFiber(tag);
  // 互相引用
  root.current = uninitializedFiber;
  uninitializedFiber.stateNode = root;

  initializeUpdateQueue(uninitializedFiber);

  return root;
}