/**
 * 更新队列的抽象 API
 */
const ReactNoopUpdateQueue = {
  /**
   * 检查复合组件是否已经挂载
   * @param {ReactClass} publicInstance 
   */
  isMounted: function(publicInstance) {
    return false;
  },

  enqueueForceUpdate: function(publicInstance, callback, callerName) {
  },

  enqueueReplaceState: function(publicInstance, completeState, callback, callerName) {
  },

  enqueueSetState: function(publicInstance, partialState, callback, callerName) {
  },
}

export default ReactNoopUpdateQueue
