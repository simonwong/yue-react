import {createContainer, updateContainer} from '../../../react-reconciler/src/ReactFiberReconciler';

import {BlockingRoot, ConcurrentRoot, LegacyRoot} from '../../../shared/ReactRootTags'

function createRootImpl(container, tag, options) {
  // tag 用来标记是使用 ConcurrentRoot 还是 LegacyRoot
  const hydrate = options != null && options.hydrate === true;
  const hydrationCallbacks = (options != null && options.hydrationOptions) || null;
  const root = createContainer(container, tag, hydrate, hydrationCallbacks);
  markContainerAsRoot(root.current, container);
  if (hydrate && tag !== LegacyRoot) {
    const doc =
      container.nodeType === DOCUMENT_NODE
        ? container
        : container.ownerDocument;
    eagerlyTrapReplayableEvents(container, doc);
  }
  return root;
}

function ReactDOMRoot(container, options) {
  this._internalRoot = createRootImpl(container, ConcurrentRoot, options);
}

function ReactDOMBlockingRoot(container, tag, options) {
  this._internalRoot = createRootImpl(container, tag, options);
}

ReactDOMRoot.prototype.render = ReactDOMBlockingRoot.prototype.render = function(children) {
  const root = this._internalRoot;
  updateContainer(children, root, null, null);
};

ReactDOMRoot.prototype.unmount = ReactDOMBlockingRoot.prototype.unmount = function() {
  // 不支持回调，但可以在 useEffect 的回调中调用
  const root = this._internalRoot;
  const container = root.containerInfo;
  updateContainer(null, root, null, () => {
    unmarkContainerAsRoot(container);
  });
};

export function createLegacyRoot(container, options) {
  return new ReactDOMBlockingRoot(container, LegacyRoot, options);
}