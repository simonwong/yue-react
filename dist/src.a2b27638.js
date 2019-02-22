// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"src/React/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
// import Component from './component'
var TEXT_ELEMENT = 'TEXT ELEMENT';

function createElement(type, config) {
  var _ref;

  var props = Object.assign({}, config);

  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  var hasChildren = args.length > 0;
  var rawChildren = hasChildren ? (_ref = []).concat.apply(_ref, args) : []; // 过滤空值，将文本类型的转成规范数据格式

  props.children = rawChildren.filter(function (c) {
    return c != null && c !== false;
  }).map(function (c) {
    return c instanceof Object ? c : createTextElement(c);
  });
  return {
    type: type,
    props: props
  };
}

function createTextElement(value) {
  // 规范数据格式
  return createElement(TEXT_ELEMENT, {
    nodeValue: value
  });
}

var React = {
  createElement: createElement // Component

};
var _default = React;
exports.default = _default;
},{}],"src/ReactDOM/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var rootInstance = null;

function render(element, container) {
  var prevInstance = rootInstance;
  var nextInstance = reconcile(container, prevInstance, element);
  rootInstance = nextInstance;
}
/**
 * 
 * @param {*} parentDom 
 * @param {*} instance 
 * @param {*} element 
 */


function reconcile(parentDom, instance, element) {
  if (instance === null) {
    var newInstance = instantiate(element);
    parentDom.appendChild(newInstance.dom);
    return newInstance;
  } else if (instance.element.type === element.type) {
    updateDomProperties(instance.dom, instance.element.props, element.props);
    instance.element = element;
    return instance;
  } else {
    var _newInstance = instantiate(element);

    parentDom.appendChild(_newInstance.dom, instance.dom);
    return _newInstance;
  }
}
/**
 * 
 * @param {*} element 
 */


function instantiate(element) {
  var type = element.type,
      props = element.props;
  /** 1 */
  // 创建dom节点

  var isTextElement = type === 'TEXT ELEMENT';
  var dom = isTextElement ? document.createTextNode('') : document.createElement(type);
  updateDomProperties(dom, [], props); // <--------------

  /** 2 */
  // 将他的children节点们递归 创建实例

  var childElements = props.children || [];
  var childInstances = childElements.map(instantiate);
  /** 3 */

  var childDoms = childInstances.map(function (childInstance) {
    return childInstance.dom;
  });
  /** 4 */

  childDoms.forEach(function (childDom) {
    return dom.appendChild(childDom);
  });
  var instance = {
    dom: dom,
    element: element,
    childInstances: childInstances
  };
  return instance;
}
/**
 * 从dom节点中，删除所有旧属性，添加新属性
 * @param {*} dom 
 * @param {*} prevProps 
 * @param {*} nextProps 
 */


function updateDomProperties(dom, prevProps, nextProps) {
  var isEvent = function isEvent(name) {
    return name.startsWith('on');
  };

  var isAttribute = function isAttribute(name) {
    return !isEvent(name) && name !== 'children';
  }; // 解绑prev事件


  Object.keys(prevProps).filter(isEvent).forEach(function (name) {
    var eventType = name.toLowerCase().substring(2);
    dom.removeEventListener(eventType, prevProps[name]);
  }); // 移除prev属性

  Object.keys(prevProps).filter(isAttribute).forEach(function (name) {
    dom[name] = null;
  }); // 绑定next事件

  Object.keys(nextProps).filter(isEvent).forEach(function (name) {
    var eventType = name.toLowerCase().substring(2);
    dom.addEventListener(eventType, nextProps[name]);
  }); // 设置next属性

  Object.keys(nextProps).filter(isAttribute).forEach(function (name) {
    dom[name] = nextProps[name];
  });
}

var ReactDOM = {
  render: render
};
var _default = ReactDOM;
exports.default = _default;
},{}],"src/index.js":[function(require,module,exports) {
"use strict";

var _React = _interopRequireDefault(require("./React"));

var _ReactDOM = _interopRequireDefault(require("./ReactDOM"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// class Welcome extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             count: 0
//         }
//         this.handleAddCount = this.handleAddCount.bind(this)
//     }
//     componentWillMount () {
//         console.log('WillMount')
//     }
//     componentWillReceiveProps () {
//         console.log('WillReceiveProps')
//     }
//     componentWillUpdate () {
//         console.log('WillUpdate')
//     }
//     componentDidUpdate () {
//         console.log('DidUpdate')
//     }
//     componentDidMount () {
//         console.log('DidMount')
//     }
//     handleAddCount () {
//         this.setState({
//             count: this.state.count + 1
//         })
//     }
//     render () {
//         return (
//             <div>
//                 <h1>Hello, { this.props.name }</h1>
//                 <h3>当前数值 <span style={{color: 'red'}}>{ this.state.count }</span></h3>
//                 <button onClick={this.handleAddCount}>Add</button>
//             </div>
//         )
//     }
// }
// const element = <Welcome name="World" />
// ReactDOM.render(
//     element,
//     document.getElementById('root')
// )
function tick() {
  var time = new Date().toLocaleTimeString();

  var clockElement = _React.default.createElement("h1", null, time);

  _ReactDOM.default.render(clockElement, document.getElementById('root'));
}

tick();
setInterval(tick, 1000);
},{"./React":"src/React/index.js","./ReactDOM":"src/ReactDOM/index.js"}],"../../../../../../usr/local/lib/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "54340" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../../../../../usr/local/lib/node_modules/parcel/src/builtins/hmr-runtime.js","src/index.js"], null)
//# sourceMappingURL=/src.a2b27638.map