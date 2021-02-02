store-collection
================

### Installation

```html
<script src="store.js"></script>
```
```js
npm i store-collection
```

### API

```js
import Store from 'store-collection'
const VhStorage = new Store('vhall-')

 /*
  * 使用new 操作符创建实例，可传入一个字符串（preKey），用于存储、读取时，key值默认添加前缀
  * */

const Obj = {
      a: 1,
      b: [1,2,3],
      c: {
        a: 5,
        b: 6
      },
      d: null,
      e: undefined,
      f: '',
      g: 'string 123',
      h: true,
      i: false,
      j: function () {
        console.log(1)
      }
    }
VhStorage.set(Object.keys(Obj), Object.values(Obj))
VhStorage.set(Object.keys(Obj), Object.values(Obj), true)

/**
 * set 方法：
 *  arguments: 
 *      1、存储的key，初始化时如果传入前缀（preKey），存储到sessionStorage或localStorage默认拼接前缀，
 *         避免和其他平台混存，可传String或Array类型，如果为Array会便利存储
 *      2、存储的value，可传String或Array类型，如果传入的key参数为Array，那么value参数也为Array，
 *         则可按照key和value一一对应的关系，进行存储
 *      3、存储类型，Boolean类型，可不传，默认false，当为true时会把传入的数据，存储到sessionStorage中
 *         否则存储到localStorage中
*/

VhStorage.get(Object.keys(Obj)) // get localStorage

/**
 * get 方法：
 *   arguments:
 *     1、获取时的key值，必传字段，可传入String或Array类型
 *     2、获取类型，Boolean类型，可不传，默认false，当为true时会获取sessionStorage中的值，
 *        否则获取localStorage的值
*/

VhStorage.remove(key, isSession)

/**
 * remove 方法：
 *   arguments:
 *     1、要删除的key值，必传字段，可传入String或Array类型
 *     2、删除类型，Boolean类型，可不传，默认false，当为true时会删除sessionStorage里面的数据
*/

VhStorage.removeAll()
/**
 * removeAll 方法：
 *   删除所有带有prekey字段的存储，包含sessionStorage和localStorage
*/

Store.checkStorage(type)

/**
 * checkStorage 静态方法：
 *   检查浏览器是否支持Storage的读写功能
 * type: 为sessionStorage或localStorage对象
 * 
*/

Store.clearSession()

/**
 * clearSession 静态方法：清除所有sessionStorage的存储
 * 
*/

Store.clearLocal()

/**
 * clearLocal 静态方法：清除所有localStorage的存储
 * 
*/

Store.clearAll()

/**
 * clearAll 静态方法：清除所有Storage的存储
 * 
*/


```