function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Store = factory());
})(this, function () {
  'use strict';

  function isArray(val) {
    return Array.isArray(val);
  }

  function isString(val) {
    return typeof val === 'string';
  }

  function storageAvailable(type) {
    var storage;

    try {
      storage = window[type];
      var x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return e instanceof DOMException && ( // everything except Firefox
      e.code === 22 || // Firefox
      e.code === 1014 || // test name field too, because code might not be present
      // everything except Firefox
      e.name === 'QuotaExceededError' || // Firefox
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED') && // acknowledge QuotaExceededError only if there's something already stored
      storage && storage.length !== 0;
    }
  }

  var Store = /*#__PURE__*/function () {
    function Store(preKey) {
      _classCallCheck(this, Store);

      this.preKey = preKey;

      var FullKey = this.FullKey = this._returnFullKey('_StoreKeys');

      var SessionList = JSON.parse(sessionStorage[FullKey] || '{}');
      var LocalList = JSON.parse(localStorage[FullKey] || '{}');
      this.sessionKeys = _objectSpread({}, SessionList);
      this.localKeys = _objectSpread({}, LocalList);
      this.sessionTime = '';
      this.localTime = '';
    }

    _createClass(Store, [{
      key: "_getKeys",
      value: function _getKeys(obj) {
        return Object.keys(obj);
      }
    }, {
      key: "_storeType",
      value: function _storeType(isSession) {
        return isSession ? sessionStorage : localStorage;
      }
    }, {
      key: "_returnFullKey",
      value: function _returnFullKey(key) {
        return this.preKey + key;
      }
    }, {
      key: "_returnKeyAndType",
      value: function _returnKeyAndType(key, isSession) {
        return {
          store: this._storeType(isSession),
          fullKey: this._returnFullKey(key)
        };
      }
    }, {
      key: "_setOnly",
      value: function _setOnly(key, value, isSession) {
        var _this$_returnKeyAndTy = this._returnKeyAndType(key, isSession),
            store = _this$_returnKeyAndTy.store,
            fullKey = _this$_returnKeyAndTy.fullKey;

        if (_typeof(value) === 'object') {
          value = JSON.stringify(value);
        }

        store[fullKey] = value;
        isSession ? this.sessionKeys[key] = 1 : this.localKeys[key] = 1;

        this._setStoreFullKey(store, isSession);
      }
    }, {
      key: "_setStoreFullKey",
      value: function _setStoreFullKey(store, isSession) {
        store[this.FullKey] = JSON.stringify(isSession ? this.sessionKeys : this.localKeys);
      }
    }, {
      key: "_getOnly",
      value: function _getOnly(key, isSession) {
        var _this$_returnKeyAndTy2 = this._returnKeyAndType(key, isSession),
            store = _this$_returnKeyAndTy2.store,
            fullKey = _this$_returnKeyAndTy2.fullKey;

        var Value = store[fullKey];

        try {
          return JSON.parse(Value);
        } catch (e) {
          return Value;
        }
      }
    }, {
      key: "_removeOnly",
      value: function _removeOnly(key, isSession) {
        var _this$_returnKeyAndTy3 = this._returnKeyAndType(key, isSession),
            store = _this$_returnKeyAndTy3.store,
            fullKey = _this$_returnKeyAndTy3.fullKey;

        store.removeItem(fullKey);
        isSession ? delete this.sessionKeys[key] : delete this.localKeys[key];

        this._setStoreFullKey(store, isSession);
      }
    }, {
      key: "_notStringAndArray",
      value: function _notStringAndArray(val, warnString) {
        var keyIsString = isString(val);
        var keyIsArray = isArray(val);
        if (!keyIsString && !keyIsArray) throw new Error("".concat(warnString, " type error"));
        return [keyIsString, keyIsArray];
      }
    }, {
      key: "set",
      value: function set(key, value, isSession) {
        var _this = this;

        var _this$_notStringAndAr = this._notStringAndArray(key, 'key'),
            _this$_notStringAndAr2 = _slicedToArray(_this$_notStringAndAr, 2),
            keyIsString = _this$_notStringAndAr2[0],
            keyIsArray = _this$_notStringAndAr2[1];

        var _this$_notStringAndAr3 = this._notStringAndArray(value, 'value'),
            _this$_notStringAndAr4 = _slicedToArray(_this$_notStringAndAr3, 2),
            valIsString = _this$_notStringAndAr4[0],
            valIsArray = _this$_notStringAndAr4[1];

        if (keyIsString && valIsString) {
          this._setOnly(key, value, isSession);

          return;
        }

        if (keyIsArray && valIsArray) {
          key.forEach(function (item, i) {
            _this._setOnly(item, value[i], isSession);
          });
        }
      }
    }, {
      key: "get",
      value: function get(key, isSession) {
        var _this2 = this;

        var _this$_notStringAndAr5 = this._notStringAndArray(key),
            _this$_notStringAndAr6 = _slicedToArray(_this$_notStringAndAr5, 2),
            keyIsString = _this$_notStringAndAr6[0],
            keyIsArray = _this$_notStringAndAr6[1];

        if (keyIsString) {
          return this._getOnly(key, isSession);
        }

        if (keyIsArray) {
          return key.map(function (item) {
            return _this2._getOnly(item, isSession);
          });
        }
      }
    }, {
      key: "remove",
      value: function remove(key, isSession) {
        var _this3 = this;

        var _this$_notStringAndAr7 = this._notStringAndArray(key),
            _this$_notStringAndAr8 = _slicedToArray(_this$_notStringAndAr7, 2),
            keyIsString = _this$_notStringAndAr8[0],
            keyIsArray = _this$_notStringAndAr8[1];

        if (keyIsString) {
          this._removeOnly(key, isSession);

          return;
        }

        if (keyIsArray) {
          key.forEach(function (item) {
            return _this3._removeOnly(item, isSession);
          });
        }
      }
    }, {
      key: "removeAll",
      value: function removeAll() {
        this.remove(Object.keys(this.sessionKeys), true);
        this.remove(Object.keys(this.localKeys));
      }
    }], [{
      key: "checkStorage",
      value: function checkStorage(type) {
        return storageAvailable(type);
      }
    }, {
      key: "clearSession",
      value: function clearSession() {
        sessionStorage.clear();
      }
    }, {
      key: "clearLocal",
      value: function clearLocal() {
        localStorage.clear();
      }
    }, {
      key: "clearAll",
      value: function clearAll() {
        this.clearSession();
        this.clearLocal();
      }
    }]);

    return Store;
  }();

  return Store;
});
