import { createFiberRoot } from './ReactFiberRoot';
import {createUpdate, enqueueUpdate} from './ReactUpdateQueue';
import { unbatchedUpdates, requestEventTime } from './ReactFiberWorkLoop'

export function createContainer(containerInfo, tag, hydrate, hydrationCallbacks) {
  return createFiberRoot(containerInfo, tag, hydrate, hydrationCallbacks);
}

function getContextForSubtree(parentComponent) {
  if (!parentComponent) {
    // emptyContextObject
    return {};
  }
  // const fiber = getInstance(parentComponent);
  const fiber = parentComponent._reactInternals;
  const parentContext = findCurrentUnmaskedContext(fiber);

  if (fiber.tag === ClassComponent) {
    const Component = fiber.type;
    if (isLegacyContextProvider(Component)) {
      return processChildContext(fiber, Component, parentContext);
    }
  }

  return parentContext;
}

export function updateContainer(element, container, parentComponent, callback) {
  const current = container.current;
  const eventTime = requestEventTime();
  const lane = requestUpdateLane(current);

  // 从父组件收集 context parentComponent = document.querySelector('#root')
  const context = getContextForSubtree(parentComponent);
  // container = fiberNode
  if (container.context === null) {
    container.context = context;
  } else {
    container.pendingContext = context;
  }

  const update = createUpdate(eventTime, lane);
  // Caution: React DevTools currently depends on this property being called "element".
  // element = <app />
  update.payload = {element};

  callback = callback === undefined ? null : callback;

  enqueueUpdate(current, update);
  scheduleUpdateOnFiber(current, lane, eventTime);

  return lane;
}

export {
  unbatchedUpdates
}
