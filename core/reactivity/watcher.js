// 观察者 Watcher
import { Dep } from './deps.js' 
export class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm;
    this.key = key;
    this.cb = cb;

    // 将当前 Watcher 实例指定到 Dep 的静态属性 target 上
    Dep.target = this;

    // 触发 getter 收集依赖
    this.vm[this.key];

    // 清空 Dep 的 target 属性
    Dep.target = null;
  }

  // 更新数据
  update() {
    console.log('执行watcher 的 update 方法，触发最初传入的 cb 方法')
    this.cb.call(this.vm, this.vm[this.key]);
  }
}
