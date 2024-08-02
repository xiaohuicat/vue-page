export class Callback {
  constructor(callbackDict={}) {
    this.callbackDict = callbackDict;
  }
  // 添加回调函数，如果存在则替换
  add_hard(name, func){
    this.callbackDict[name] = func;
  }
  // 添加回调函数
  add(name, func) {
    if (name in this.callbackDict) {
      // 如果已存在回调
      if (Array.isArray(this.callbackDict[name])) {
        // 如果是回调列表
        const callbacks = [...this.callbackDict[name]];
        callbacks.push(func);
        this.callbackDict[name] = callbacks;
      } else {
        // 如果是回调函数
        this.callbackDict[name] = [this.callbackDict[name], func];
      }
    } else {
      // 如果不存在回调
      this.callbackDict[name] = func;
    }
  }

  // 获取回调函数
  get(name) {
    if (name in this.callbackDict) {
      const callback = this.callbackDict[name];
      if (Array.isArray(callback)) {
        return callback;
      } else {
        return [callback];
      }
    } else {
      return [];
    }
  }

  getDict() {
    return this.callbackDict;
  }

  // 运行回调函数
  run(name, ...param) {
    const callbackList = this.get(name);
    const result = [];
    if (callbackList.length > 0) {
      for (const each of callbackList) {
        if (param.length>0) {
          result.push(each(...param));
        } else {
          result.push(each());
        }
      }
    }
    return result;
  }

  // 移除回调函数
  remove(name) {
    if (!name) {
      for (const key in this.callbackDict) {
        // console.log("移除",key,"回调函数");
        delete this.callbackDict[key];
        return;
      }
    }
    if (name in this.callbackDict) {
      // console.log("移除",key,"回调函数");
      delete this.callbackDict[name];
    }
  }

  // 销毁回调管理对象
  destroy() {
    this.callbackDict = {};
  }
}
