# learnin-project

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
# 以下分了四个角色
### demand为需求方
### admin为管理员
### contractor 为承接方
### canal 为渠道方

#### 获取点击行里的详情数据可以在el-table标签上加上`@row-click="getDetails"` 在methods里面定义这个“getDetails方法，默认的形参为row”