function isArray(val) {
  return Array.isArray(val)
}

function isString (val) {
  return typeof val === 'string'
}

function storageAvailable(type) {
  var storage;
  try {
      storage = window[type];
      var x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
  }
  catch(e) {
      return e instanceof DOMException && (
          // everything except Firefox
          e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === 'QuotaExceededError' ||
          // Firefox
          e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
          // acknowledge QuotaExceededError only if there's something already stored
          (storage && storage.length !== 0);
  }
}

class Store {
  constructor(preKey) {
    this.preKey = preKey
    this.sessionKeys = {}
    this.localKeys = {}
    this.sessionTime = ''
    this.localTime = ''
  }

  _getKeys (obj) {
    return Object.keys(obj)
  }
  _storeType(isSession) {
    return isSession ? sessionStorage : localStorage
  }

  _returnFullKey (key) {
    return this.preKey + key
  }
  _returnKeyAndType (key, isSession) {
    return {
      store: this._storeType(isSession),
      fullKey: this._returnFullKey(key)
    }
  }
  _setOnly (key, value, isSession) {
    const {store, fullKey} = this._returnKeyAndType(key, isSession)
    if (typeof value === 'object') {
      value = JSON.stringify(value)
    }
    store[fullKey] = value
    isSession ? this.sessionKeys[key] = 1 : this.localKeys[key] = 1
  }
  _getOnly (key, isSession) {
    const {store, fullKey} = this._returnKeyAndType(key, isSession)
    const Value = store[fullKey]
    try {
      return JSON.parse(Value)
    } catch (e) {
      return Value
    }
  }
  _removeOnly (key, isSession) {
    const {store, fullKey} = this._returnKeyAndType(key, isSession)
    store.removeItem(fullKey)
    isSession ? delete this.sessionKeys[key] : delete this.localKeys[key]
  }
  _notStringAndArray (val, warnString) {
    const keyIsString = isString(val)
    const keyIsArray = isArray(val)
    if (!keyIsString && !keyIsArray) throw new Error(`${warnString} type error`)
    return [keyIsString, keyIsArray]
  }
  set (key, value, isSession) {
    const [keyIsString, keyIsArray] = this._notStringAndArray(key, 'key')
    const [valIsString, valIsArray] = this._notStringAndArray(value, 'value')
    if (keyIsString && valIsString) {
      this._setOnly(key, value, isSession)
      return
    }
    if (keyIsArray && valIsArray) {
      key.forEach((item, i) => {
        this._setOnly(item, value[i], isSession)
      })
    }
  }
  get (key, isSession) {
    const [keyIsString, keyIsArray] = this._notStringAndArray(key)
    if (keyIsString) {
      return this._getOnly(key, isSession)
    }
    if (keyIsArray) {
      return key.map(item => this._getOnly(item, isSession))
    }
  }
  remove (key, isSession) {
    const [keyIsString, keyIsArray] = this._notStringAndArray(key)
    if (keyIsString) {
      this._removeOnly(key, isSession)
      return
    }
    if (keyIsArray) {
      key.forEach(item => this._removeOnly(item, isSession))
    }
  }
  removeAll () {
    this.remove(Object.keys(this.sessionKeys), true)
    this.remove(Object.keys(this.localKeys))
  }
  static checkStorage (type) {
    return storageAvailable(type) 
  }
  static clearSession () {
    sessionStorage.clear()
  }
  static clearLocal () {
    localStorage.clear()
  }
  static clearAll () {
    this.clearSession()
    this.clearLocal()
  }
}

export default Store
