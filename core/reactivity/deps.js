// 依赖管理器 Dep
export class Dep {
  constructor() {
    this.subs = []; // 存储所有的观察者
  }

  // 添加观察者 watcher
  addSub(sub) {
    if (sub && sub.update) {
      this.subs.push(sub);
    }
  }

  // 通知观察者更新数据
  notify() {
    console.log('触发依赖管理器的 notify，通知每个依赖更新')
    this.subs.forEach(sub => {
      sub.update();
    });
  }
}
