# 模仿网易云音乐pc端

先写写心得体会吧，经过半个月，我实现了网易云音乐的一些功能。最开始的时候，我记得我几乎写点东西，就会去看我学vue的笔记，（笔记真的好有用，什么忘记了，就拿出来看看，不懂的再百度）。我觉得这半个月最难的就是，音乐播放部分了，终于昨天晚上，我成功的实现了音乐自动播放下一首，点击按钮切换上一首，下一首，我真的好开心，哈哈哈哈哈哈。不过，项目中出现过很多问题，我要一点点的总结下来，[我的github地址](https://github.com/xhysah).

## 项目搭建
- ### 基本项目
	 **安装脚手架**：npm install -g  @vue/cli
  	**创建一个新项目**： vue create my-project(自己想取的项目名称)
	 1.Please pick a preset？(选择手动的，可以自己想要的配置)-------manully
	 2.Check the features needed for your project(询问项目需求)：我选择的如下图
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/20200516185345802.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hoeXh4aHducw==,size_16,color_FFFFFF,t_70)
	 2. Use history mode for router(路由模式是否使用history)? -------yes
	 3. Pick a CSS pre-processor(询问项目的css预处理器)：--------Stylus 
	 4.  Pick a linter / formatter config(询问项目的格式校验方式)：------Standard 
	 5.  Pick additional lint features:(询问项目是什么时候校验格式)------lint on save(保存时就校验，哈哈哈哈，因为我不知道怎么写代码是规范的，需要他实时约束我)
	 6.  Where do you prefer placing config for Babel, ESLint, etc.?（询问项目的配置文件放在那里）-----In dedicated config files
	 7.  Save this as a preset for future projects? (是否保存该配置，若是，你以后创建新项目的时候，就会看见这个配置)----no
 然后vue-cli就开始自己下载了，等待他
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200516185345739.png)
-  ### 引入项目中使用的东西------axios，element-Ul
	 **1.axios**
 	下载npm install axios --save，运行时也会使用，所有要保存在你的运行时依赖中
 	在src/main.js中：导入import axios from ‘axios’，
	 挂载到vue原型上Vue.prototype.$http = axios----使用的时候，就可以this.$http
 	全局配置axios.defaults.baseURL = 'http://192.168.1.5:3000'
	 axios.defaults.withCredentials = true 表示跨域请求时是否需要使用凭证
 	**2.element-UI**
 	下载npm i element-ui -save
 	我是在src下面建了一个elementUI文件夹，再建了一个element.js文件
 	在这个文件中，按需引入elementUI
 ```javacsipt
 import Vue from 'vue'
 import {
   	Form,
 	FormItem
  }from 'element-ui';
  Vue.use(Form)
  Vue.use(FormItem)
  ```
  再在main.js中引入import './elementUi/element'
 最后删掉views，components里面原本存在的vue文件，连同src/router/index.js里的路由一起删掉----然后做完这些，我就开始研究文档了，一开始真的好难上手
 [网易云github地址](https://github.com/Binaryify/NeteaseCloudMusicApi).
 下载后 node app.js 就可以了
## 遇到的问题
- ### 播放音乐
最开始的时候，我知道肯定会用audio标签，建立了一个musicPlayer组件，然后把它固定在浏览器底部，因为有好几个页面都有音乐播放，所以我只能把音乐数据放在vuex里面统一管理，传给vuex的值都是可用数据了，每次只能播放一首歌，播放完后，就直接停止了，我应该在他的ended事件里面做些什么。逻辑是这样的
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200516185345847.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hoeXh4aHducw==,size_16,color_FFFFFF,t_70)
大概吧，我真的不知道怎么表述了，反正数据，我都存在vuex里面了，
总结：
- 1.在actions里面可以调用mutation--------context.commit('事件类型','参数')，网络请求等异步操作，放在actions里面------------组件调用this.$store.dispatch('事件类型', '参数')
- 2.mutations------组件调用this$store.commit('事件类型','参数')--vuex的store状态的更新唯一方式，注意不能在actions里直接修改state里的值，改是可以改的，不提倡，容易出问题
- ### 路由跳转
问题：elementui中的导航菜单，自带的:default-active="activeIndex"，他只有点击才有对应的效果，你要是选择了第二项，然后刷新，他就会自动跳到第一个上面，整个导航菜单就会乱掉

- 我把首页里的activeName值保存在vuex中，同时也从vuex中取值，每次跳转时，都会在生命周期created里面提交修改activeName的值，路由就不会乱掉了
- ### flex布局
在项目中，我经常遇到布局问题，因为好多图片，都要居中对齐，看起来整洁一点，总结一下经常用的
- 容器的justify-content属性，属性值space-between两端项目之间的距离都相等，center居中对齐
- 容器的flex-warp----定义一行排不下item，如何换行----wrap换行
- 容器属性
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200516200935636.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hoeXh4aHducw==,size_16,color_FFFFFF,t_70)
- 项目属性
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200516200935595.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hoeXh4aHducw==,size_16,color_FFFFFF,t_70)
- ### 定位
relative：相对定位，不脱离文档流，参考自身的静态位置
absolute：绝对定位，参考最近一个不为static的父级元素的位置
fixed：固定定位，参照对象为可视窗口
static ：默认，按照正常流进行排列
## 项目截图
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200516191250866.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hoeXh4aHducw==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200516191250802.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hoeXh4aHducw==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200516191250274.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hoeXh4aHducw==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/2020051619125020.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hoeXh4aHducw==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200516191249824.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hoeXh4aHducw==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200516191249794.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hoeXh4aHducw==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200516191249719.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hoeXh4aHducw==,size_16,color_FFFFFF,t_70)
