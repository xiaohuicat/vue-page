# 安装vue-page
目前暂不支持npm安装，将本目录复制到vue3项目的node_modules即可，支持的版本vue3.4。

# 初始化页面对象
```javascript
// 创建一个页面管理对象
import { Page } from 'vue-page'
// 给你的应用创建一个页面管理对象
const page = new Page();
// 解构获取代理上下文，$是数据、函数等的代理对象，访问ref或computed变量可以自动解包。
// 你可以通过$.name读取值，$.name = 100设置值。
// 如果你想要原始的ref，$['[getRef]name']读取，$['[getRef]name'] = ref(100)设置，但不建议设置，在VUE模板中会失去响应性。
const { $ } = page;
```

# 设置响应式数据
```javascript
// 设置ref和computed
page.setRefs({
  num: 0,                  // 响应式数据ref
  total: () => $.num+'个',  // 计算属性computed
});
```

# 设置vue函数
```javascript
// 设置多个vue函数
page.setFuns({clear: () => { $.num = 0; }});
// 根据名称和对应的函数设置vue函数
page.setFun('double', () => { $.num = $.num*2; });
```

# 添加生命周期
```javascript
// 一次添加多个生命周期，可以多次添加，触发时按顺序执行
page.setLives({
  onReady(){setTimeout(() => $.num++, 3000);},  // 页面准备好了
  onDestroy(){() => { }}                        // 页面销毁前
})
// 添加一个生命周期
page.setLive('onLoad', func);
```

# 完整案例
在<script setup></script>中使用
```javascript
import { Page } from 'vue-page';
const page = new Page;
const { $ } = page;
page.setRefs({
  num: 0,                   // 响应式数据ref
  price: 100,               // 响应式数据ref
  total: () => ($.num*$.price)+'元',  // 计算属性computed
});
page.setFuns({clear: () => { $.num = 0; }});
```
```html
<template>
  <div>数量：{{num}}</div>
  <div>单价：{{price}}</div>
  <div>总价：{{total}}</div>
  <button @click="clear">重置</button>
</template>
```

# 数据加载
```javascript
// 获取本地数据，key可以是'a.b.c'，根据 '.' 分隔逐层取对象属性，key为空时获取全部
page.local.get(key);
// 设置本地数据, key可以是'a.b.c'，根据 '.' 分隔逐层设置对象属性
page.local.set(key, value);
// 更新本地数据，没有值时不更新，返回false，否则更新，返回true。
page.local.update(key, value);
// 删除本地数据，没有值时，返回false，否则返回true。
page.local.delete(key);
// 设置并保存本地数据，没有值时直接保存数据
page.local.save(key, value);
// 释放数据，解除引用，不删除本地数据
page.local.free();
// 清除数据，解除引用，删除本地数据
page.local.clear();
// 查看数据大小
page.local.size();
```

# >>>后续更新

# 拓展功能
```javascript
page.thread(data, func, callback);
page.wait(time, callback);
page.subscribe(topic, callback);
```

# 全局数据
```javascript
// 获取全局数据
page.store.get(key);
// 设置全局数据
page.store.set(key, value);
// 保存为本地数据
page.store.saveAsLocal(name);
// 加载本地数据和网络数据到全局数据
page.loadAsStore(name);
// 请求数据和网络数据到全局数据
page.requestAsStore(url, params, callback);
```

# 了解更多
GitHub：https://github.com/xiaohuicat/vue-page
web: https://greatnote.cn/vue-page/
wechat: before-i-know
email: 1258702350@qq.com