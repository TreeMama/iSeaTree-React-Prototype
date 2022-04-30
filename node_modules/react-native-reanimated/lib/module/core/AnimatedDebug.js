function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import invariant from 'fbjs/lib/invariant';
import { NativeModules } from 'react-native';
import { val } from '../val';
import { adapt, createAnimatedBlock as block } from './AnimatedBlock';
import { createAnimatedCall as call } from './AnimatedCall';
import AnimatedNode from './AnimatedNode';

class AnimatedDebug extends AnimatedNode {
  constructor(message, value) {
    invariant(typeof message === 'string', "Reanimated: Animated.debug node first argument should be of type string but got ".concat(message));
    invariant(value instanceof AnimatedNode, "Reanimated: Animated.debug node second argument should be of type AnimatedNode but got ".concat(value));
    super({
      type: 'debug',
      message,
      value
    }, [value]);

    _defineProperty(this, "_message", void 0);

    _defineProperty(this, "_value", void 0);

    this._message = message;
    this._value = value;
  }

  toString() {
    return "AnimatedDebug, id: ".concat(this.__nodeID);
  }

  __onEvaluate() {
    const value = val(this._value);
    console.log(this._message, value);
    return value;
  }

}

export function createAnimatedDebug(message, value) {
  if (__DEV__) {
    var _NativeModules$Native, _NativeModules$Native2, _NativeModules$Native3;

    // hack to detect if app is running in remote debugger
    // https://stackoverflow.com/questions/39022216
    const runningInRemoteDebugger = typeof atob !== 'undefined'; // read the executionEnvironment off of expo-constants without explicitly
    // depending on the package

    const runningInExpoShell = ((_NativeModules$Native = NativeModules.NativeUnimoduleProxy) === null || _NativeModules$Native === void 0 ? void 0 : (_NativeModules$Native2 = _NativeModules$Native.modulesConstants) === null || _NativeModules$Native2 === void 0 ? void 0 : (_NativeModules$Native3 = _NativeModules$Native2.ExponentConstants) === null || _NativeModules$Native3 === void 0 ? void 0 : _NativeModules$Native3.executionEnvironment) === 'storeClient';

    if (runningInRemoteDebugger || runningInExpoShell) {
      // When running in expo or remote debugger we use JS console.log to output variables
      // otherwise we output to the native console using native debug node
      return block([call([value], ([a]) => console.log("".concat(message, " ").concat(a))), value]);
    } else {
      return new AnimatedDebug(message, adapt(value));
    }
  } // Debugging is disabled in PROD


  return value;
}
//# sourceMappingURL=AnimatedDebug.js.map