// 监听器 Observer
import { Dep } from "./deps.js";
export class Observer {
  constructor(data) {
    this.observe(data);
  }

  observe(data) {
    if (!data || typeof data !== 'object') {
      return;
    }

    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key]);
    });
  }

  defineReactive(obj, key, val) {
    const dep = new Dep();

    // 递归地监听子属性
    this.observe(val);

    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        // 收集依赖
        console.log('触发属性的 get')
        if (Dep.target) {
          console.log('收集依赖：', dep)
          dep.addSub(Dep.target);
        }
        return val;
      },
      set(newVal) {
        console.log(`触发属性的 set, ${val} -> ${newVal}`)
        if (val === newVal) {
          return;
        }
        val = newVal;
        console.log('通知依赖更新：', dep)
        // 通知依赖更新,实则调用了每个收集到的 watcher 的 update 函数
        dep.notify();
      }
    });
  }
}
