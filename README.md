# mini-vue-core

## 流程梳理

1. new Vue 的时候会将 data 传给 observer，进行递归的数据劫持
  - get
    ```js
      // 收集依赖
      if (Dep.target) {
        dep.addSub(Dep.target);
      }
    ```
  - set
    ```js
      // 通知依赖更新
      dep.notify()
    ```

2. 在模板编译解析过程中，遇到响应式数据会对数据进行 new Watcher
  ```js
    // 编译插值表达式
    compileText(node) {
      const expr = RegExp.$1; // 获取 {{ xxx }} 中的 xxx
      node.textContent = this.$data[expr]; // 替换 xxx 为 vue.$data中 xxx 属性的值

      // 将 Watcher 添加到订阅者列表中，传入获取更新视图的回调函数
      new Watcher(this, expr, newValue => {
        node.textContent = newValue;
      })
    }
  ```

3. watcher 有三个属性和一个方法，分别是
  - vm：指向当前数据所在的 vue 实例
  - key：当前数据在 vue 实例中的key
  - cb：数据变动时的回调函数
  - update：`this.cb.call(this.vm, this.vm[this.key])`，更新 vm 实例上 key 属性的值

4. 在新建 watcher 实例的时候，除了上述的3个属性，还会进行如下操作
  - 通过 `Dep.target = this` 将依赖收集器 Dep 的静态属性 target 改为当前数据
  - 通过 `this.vm[this.key]` 触发 对当前数据的依赖收集
  - 收集完毕，清空 target 属性，Dep.target = null



所以，接下来当 vue 中数据 `oldName` 变成 `newName` 后

1. 触发 `name` 属性的 set 函数，设置新值 `newName，且` 调用 `dep.notify (注：该dep是进行数据劫持的时候创建的，所以是每个响应式数据的私有变量)`
2. `dep.notify` 实则调用的 deps 内所有 watcher 的 update 方法
3. watcher 的 update 方法传入 `this.vm[this.name](其实是newName)`，该回调是模板编译，新建 watcher 实例时，传入的 cb

```js
// compile
new Watcher(this, expr, newValue => {
  node.textContent = newValue;
})
```

至此，实现了 name 属性值变化后，视图自动更新的功能
