import {createLegacyRoot, isValidContainer} from './ReactDOMRoot';
import { updateContainer } from '../../../react-reconciler/src/ReactFiberReconciler'

function legacyCreateRootFromDOMContainer(container, forceHydrate) {
  // 省略了 判断 container 干不干净
  // 省略了 不干净要清除 清除容器节点的子节点

  // React v17 服务端渲染，不能再使用 ReactDOM.render() ， 而是 ReactDOM.hydrate()

  return createLegacyRoot(
    container,
    shouldHydrate ? { hydrate: true } : undefined,
  );
}

// 渲染子树到容器
function legacyRenderSubtreeIntoContainer (parentComponent, children, container, forceHydrate, callback) {
  let root = container._reactRootContainer;
  let fiberRoot;
  if (!root) {
    // 初始化挂载节点
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
      container,
      forceHydrate,
    );
    fiberRoot = root._internalRoot;

    // 省略了 callback 处理
    
    // 非批量更新
    // （概念：批量更新batchedUpdate，合并同一阶段的更新）
    unbatchedUpdates(() => {
      // 开始构建整颗 FiberNode 树，以及完成 DOM 渲染
      updateContainer(children, fiberRoot, parentComponent);
    });
  } else {
    fiberRoot = root._internalRoot;

    // 省略了 callback 处理

    // 更新节点
    updateContainer(children, fiberRoot, parentComponent);
  }
  return getPublicRootInstance(fiberRoot);
}

export function render(element, container, callback) {
  return legacyRenderSubtreeIntoContainer(
    null,
    element,
    container,
    false,
    callback,
  );
}