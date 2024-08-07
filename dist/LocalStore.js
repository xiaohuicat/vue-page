import { getObjectProperty, setObjectExistProperty, setObjectProperty } from "./utils";

// 本地数据存储
export class LocalStore {
  constructor(name){
    this.name = name || 'LocalStore';
    this.data = null;
  }

  get(key, default_val){
    let data;
    try {
      data = JSON.parse(localStorage.getItem(this.name));
    } catch(err) {
      data = {};
    }

    if (!data) {data = {}};
    this.data;

    // 没有输入key值获取全部参数
    if (!key&&typeof key != "string") {
      return data;
    }
    // 输入了key值获取指定参数
    return getObjectProperty(data, key, default_val);
  }

  set(key, value){
    // key值不存在，直接退出
    if (!key) return;
    // 如果key是字符串，保存指定参数的值
    if (typeof key == 'string'){
      this.data = setObjectProperty(this.data, key, value);
    // key是词典，拆分键值对储存
    } else {
      for (let each of Object.keys(key)) {
        this.data[each] = key[each];
      }
    }
  }

  update(key, value){
    // key值不存在，直接退出
    if (!key) return;
    if (typeof key == 'string'){
      this.data = setObjectExistProperty(this.data, key, value);
    } else {
      for (let each of Object.keys(key)) {
        if (each in this.data){
          this.data[each] = key[each];
        }
      }
    }  
  }

  delete(key){
    if (!key) return;
    if (key in this.data) {
      delete this.get(key);
    }
  }

  save(key, value){
    this.set(key, value);
    localStorage[this.name] = JSON.stringify(this.data);
  }

  free(){
    this.data = null;
  }

  clear(){
    delete localStorage[this.name];
  }
  
  size(){
    let str = localStorage.getItem(this.name) || '';
    return new Blob([str]).size;
  }
}