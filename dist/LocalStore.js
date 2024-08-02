// 本地数据存储
export class LocalStore {
  constructor(name){
    this.name = name || 'LocalStore'
  }

  get(key, default_val){
    let data;
    try{
      data = JSON.parse(localStorage.getItem(this.name))
    }catch(err){
      data = {}
    }
    if(!data){data = {}}

    // 没有输入key值获取全部参数
    if(!key&&typeof key != "string"){
      return data
    }
    // 输入了key值获取指定参数
    if(key in data){
      return data[key]
    }else{
      return default_val;
    }
  }

  save(key,value){
    // key值不存在，直接退出
    if(!key)return
    let data = this.get() || {}
    // 如果key是字符串，保存指定参数的值
    if(typeof key == 'string'){
      data[key] = value
    // key是词典，拆分键值对储存
    }else{
      for(let each of Object.keys(key)){
        data[each] = key[each]
      }
    }
    // 保存数据
    localStorage[this.name] = JSON.stringify(data)
  }

  delete(key){
    if(!key)return
    let data = JSON.parse(localStorage.getItem(this.name));
    if(key in data){
      delete data[key];
      localStorage[this.name] = JSON.stringify(data);
    }
  }

  clear(){
    delete localStorage[this.name];
  }
  
  size(){
    let str = localStorage.getItem(this.name) || ''
    return new Blob([str]).size
  }
}