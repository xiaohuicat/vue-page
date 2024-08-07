import { Callback } from "./Callback";
import { useRouter } from "vue-router";
import { isObject, setObjectProperty } from "./utils";
import HELP from "./config";

import {
  onMounted,
  onBeforeUnmount,
  onUpdated,
  onUnmounted,
  onBeforeMount,
  onBeforeUpdate,
  getCurrentInstance,
  watch,
  isRef,
  ref,
  computed,
} from '@vue/runtime-core'
import { LocalStore } from "./LocalStore";

const LIVE_MAP = {
  onMounted,
  onBeforeMount,
  onBeforeUpdate,
  onUpdated,
  onUnmounted,
  onBeforeUnmount,
  onLoad: onBeforeMount,
  onReady: onMounted,
  onDestroy: onUnmounted,
}

function createRef(val){
  if (typeof val === 'function') {
    return computed(val);
  } else {
    return ref(val);
  }

}

function createRefs(ctx, obj) {
  for (const key in obj) {
    ctx[key] = createRef(obj[key]);
  }

  return ctx;
}

export function createFuns(ctx, obj) {
  for (const key in obj) {
    ctx[key] = typeof obj[key] === 'function' ? obj[key] : ()=>obj[key];
  }
  
  return ctx;
}

export class Page{
  constructor(localStoreName){
    this.instance = getCurrentInstance();
    const {props, emit, proxy} = this.instance;
    this.props = props;
    this.emit = emit;
    this.$ = new Proxy({...proxy}, {
      get: (target, key)=>{
        if (typeof key === 'string' && key.indexOf('[getRef]') > -1) {
          key = key.replace('[getRef]', '');
          return target[key];
        }

        return isRef(target[key]) ? target[key].value : target[key];
      },
      set: (target, key, value)=>{
        if (typeof key === 'string' && key.indexOf('[setRef]') > -1) {
          key = key.replace('[setRef]', '');
          target[key] = isRef(value) ? value : createRef(value);
          return true;
        }

        if (key in target) {
          if (isRef(target[key])) {
            target[key].value = value;
          } else {
            target[key] = value;
          }

        } else {
          target[key] = value;
        }

        return true;
      }
    });

    console.log(this.props);
    
    this.router = useRouter();
    this.callback = new Callback();
    this.local = new LocalStore(localStoreName?localStoreName:'vue-page-store');

    // vue卸载时自动销毁
    onUnmounted(()=>this?.destroy());
  }
  help(){
    console.log(HELP);
    return HELP
  }
  // ref对象的配置、获取和设置
  setRefs(refs){
    this.instance['proxy'] = createRefs(this.$, refs);
  }
  setRef(key, value){
    let [head, ...others] = key.split('.');
    let ref_value = {};
    if (this.$ && head in this.$) {
      ref_value = this.$[head];
      this.$['[setRef]'+head] = others.length > 0 ? setObjectProperty(ref_value, others.join('.'), value) : value;
    } else {
      this.instance['proxy'] = createRefs(this.$, {[key]: value});
    }
  }
  getRef(key){
    return this.$['[getRef]'+key];
  }
  set(key, value){
    let [head, ...others] = key.split('.');
    let ref_value = {};
    if (this.$ && head in this.$) {
      ref_value = this.$[head];
      this.$[head] = others.length > 0 ? setObjectProperty(ref_value, others.join('.'), value) : value;
    } else {
      this.instance['proxy'] = createRefs(this.$, {[key]: value});
    }    
  }
  get(key){
    return this.$[key];
  }
  setFuns(funs){
    this.instance['proxy'] = createFuns(this.$, funs);
  }
  setFun(key, value){
    this.instance['proxy'] = createFuns(this.$, {[key]: value});
  }
  getFun(key){
    return this.$[key];
  }
  // watch数据对象
  watch(ref_or_fun, callback){
    watch(ref_or_fun, (newValue, oldValue) => {
      if (typeof callback === "function") {
        callback(newValue, oldValue);
      } else {
        this.callback.run(callback, newValue, oldValue);
      }
    })
  }
  // watch数据对象
  watchRef(name, callback){
    let [head, ...others] = name.split('.');
    if (!(this.$ && head in this.$)) {
      console.log(`refs中没有该${head}，检查是否初始化！`);
      return;
    }

    watch( 
      () =>{
        let ref_value = this.$[head];
        if (others.length) {
          for (let i = 0; i < others.length; i++) {
            ref_value = ref_value[others[i]];
          }
        }
        return ref_value;
      },
      (newValue, oldValue) => {
        if (typeof callback === "function") {
          callback(newValue, oldValue);
        } else {
          this.callback.run(callback, newValue, oldValue);
        }
      }
    );
  }
  // watch数据对象
  watchProps(name, callback){
    if (!(this.props && name in this.props)) {
      console.log(`props中没有该${name}，检查是否初始化！`);
      return;
    }
    watch( this.props[name].value ? this.props[name] : ()=>this.props[name], (newValue, oldValue) => {
      if (typeof callback === "function") {
        callback(newValue, oldValue);
      } else {
        this.callback.run(callback, newValue, oldValue);
      }
    });
  }
  // 生命周期的函数的配置和设置
  setLives(LIVE){
    if (isObject(LIVE)) {
      for (let key in LIVE) {
        if (key in LIVE_MAP) {
          let val = LIVE[key];
          if (typeof val !== "function") {
            console.log(`${key}'s value need to be a function`);
            return;
          }
          LIVE_MAP[key](val);
        } else {
          console.log(`${key} is not a life function`);
        }
      }
    }
  }
  setLive(name, func){
    if (typeof name === "string" && typeof func === "function") {
      if (name in LIVE_MAP) {
        if (typeof func !== "function") {
          console.log(`func need to be a function`);
          return;
        }
        LIVE_MAP[name](func);
      } else {
        console.log(`${name} is not a life function`);
      }
    }
  }
  destroy(){
    this.instance = null;
    this.props = null;
    this.emit = null;
    this.proxy = null;
    this.$ = null;
    this.router = null;
    this.local.free();
    this.local = null;
    this.callback.run('destroy');
    this.callback.destroy();
    this.callback = null;
  }
  binds(funs){
    for(let key in funs){
      const val = funs[key];
      if (typeof val === "function") {
        this[key] = (...args)=>val.call(this, ...args);
      }
    }
  }
  bind(name, fun){
    if (typeof name === "string" && typeof fun === "function") {
      this[name] = (...args)=>fun.call(this, ...args);
    }
  }
}