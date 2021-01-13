import ReactNoopUpdateQueue from './ReactNoopUpdateQueue'

const emptyObject = {}

/**
 * 更新组件状态的基类
 */
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  // 稍后将会给 refs 分配不同的对象
  this.refs = emptyObject;
  // 初始化了默认的更新器，但真实是由 renderer 注入
  this.updater = updater || ReactNoopUpdateQueue;
}


Component.prototype.isReactComponent = {}

/**
 * 1、应该总是用它来改变状态，并保证 `this.state` 保持 immutable
 * 2、不保证 `this.state` 会立即更新，可能返回旧值
 * 3、无法保证 `setState` 同步运行，因为最终会分批放在一起
 * 4、
 * @param {object|function} partialState 下一个部分状态将会和当前状态合并
 * @param {?function} callback 状态更新后的回调
 */
Component.prototype.setState = function(partialState, callback) {
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
}

/**
 * 强制更新
 * @param {?function} callback 
 */
Component.prototype.forceUpdate = function(callback) {
  // this.updater.enqueueSetState(this, callback, 'forceUpdate');
}

function ComponentDummy() {}
ComponentDummy.prototype = Component.prototype;

/**
 * 自带浅比较
 */
function PureComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}

// 寄生组合式继承
const pureComponentPrototype = (PureComponent.prototype = new ComponentDummy());
pureComponentPrototype.constructor = PureComponent;
Object.assign(pureComponentPrototype, Component.prototype);
pureComponentPrototype.isPureReactComponent = true;

export {
  Component,
  PureComponent
}
