## 安装包的时候
- npm nrm use taobao
- yarn  yrm use taobao

- pnpm


09:40
Hedgehog
新旧差别大吗 一样
靜待雨落
旧的是不是 需要引入react  新的是 jsx 不需要引入react 


09:46
浅夏
我们现在用yarn3 
我赌你的枪里没有子弹
老师讲课也用pnpm吧 



人生只如初见
直接判断..children的长度不是一样么？ 
靜待雨落
肯定是个数组 判断长度是可以的
不一定是个 数组  页可能是null 
09:59
xiaohai
为啥没有导出就会自动编译呢 
1
为啥这个标识常量要搞个symbol包一下,直接用字符串不行吗 
字符串可能会重复
symbol永远不会重复的，独一无二的值

我赌你的枪里没有子弹
hello 为啥编译成props了 
children是props的一个属性
props.children = [hello]; 
👵
children不递归吗 
递归,但是这个递归是babel帮我们做的
babel会帮我们递归调用
人生只如初见撤回了一条消息
沉默的木子
是先通过babel编译成了React。createElement这样的语法嘛 
是的
xiaohai
index.js 



堆栈中createment执行上下文不止压一个吧
这个不一定，看你嵌套的个数
<div>
 <div>
   <div>
 </div>
</div>   
123
createElement 执行完毕生成的vdom 经过react-dom 处理生成真实的dom 插入页面 
靜待雨落
嗯嗯 明白了 



10:50
👵
调用函数组件那一行bable做了啥 
10:56
kkkk
class的type也是函数？ 
lzb
执行render 
浅夏
那如果人为的在函数组件上也添加这个静态属性，岂不是乱套了 
是的


double撤回了一条消息
人生只如初见
state对象里怎么删除某个属性？
无法删除，只能设置为null
setState({number:null}); 
double
在合成事件和钩子里面事异步 
靜待雨落
这样多次setState  就只更新一次了把 
现是同步的，更新没有合并，所以多次更次会更次多次
123
不能删，你要是不用，就不创建 


不要直接操作state
要想修改状态只能用this.setState();


11:55
沉默的木子
是在click事件里面 
double
dom 是不是直接全部换的 是的
废物的点心
在click里 
kkkk
在点击弄的短点 

11:59
xiaohai
相当于没有Dom diff 了吗 是的 
ilark
通过oldVdom获取真实DOM调用了2次，有优化空间 
yuanwang
再看一下 finddom相关的流程吧 

最佳划水选手
vdom.dom是在哪里赋值的？ 
老师，forceUpdate第三行不能这么写吧，对函数式组件不适应 

h2x撤回了一条消息
喜喜
实际使用不可能在事件函数里这么写吧 
因为不可能，所出就引出另一个实现 合成事件
合成事件两个目标
1.在实现批量更新时候帮我们调用 updateQueue.isBatchingUpdate = true; updateQueue.batchUpdate();
2.实现兼容性处理，把不标准的浏览器按着现变成标准的实现
靜待雨落
相同的状态是不是可以不用更新  
是的 这就是我们后讲的性能优化中 
React.PureComponent可以实现状态如果不变，就不用更新

人生只如初见
当前组件和子组件都更新了 
h2x
set了，我忘记了 
1
不是遍历set 里面的都更新吗 
h2x
我搞错了，是一次 
废物的点心
clear哪里来的 


函数组件没有render 呢 
人生只如初见
看一下set下面哪个函数实现呢 
kkkk
再看一下，咋实现的 
h2x
不需要用微任务来更新视图吗 




人生只如初见
updateComponent多次执行的话，render不是也执行多次了么？为什么不只执行最后一次的updateComponent 
沉默的木子
因为updaters是一个Set,而Set里的每个元素是唯一的。
现在是只有一个组件，调用的他的updateComponent 
人生只如初见
哦，set对多次setState时收集的同一个实例做了过滤 
喜喜
没理解委托这里 
123
storee【eventType】_store_ 上没有呢 
沉默的木子
let store = dom.store || (dom.store = {}) 
这不是先读dom.store，如果没有就执行后面的，先给dom.store => {}, 之后才是执行=号赋值 
123
这个event 从那里来的 
废物的点心
event就相当原生事件上的e，就是把任何元素的事件都挂在document上了 
喜喜
1 


沉默的木子
那要是两个按钮都绑定的click事件，那document[eventType]不是重复了？会覆盖吗 
给文档 对象绑一次就行了
123
那要是 button 外层也有个div。也帮定个onclick 事件呢。在document 上的 怎么执行呢，点击button  button上的事件执行完毕， div的事件 再执行 
人生只如初见
事件委托这里怎么处理冒泡 
h2x
要是我写 的事件里面阻止了冒泡呢 




如果建立多个组件  document会被多次绑定事件咯  感觉这一块放在初始化的地方好点 
人生只如初见
多个组件不会被多次绑定啊 
沉默的木子
原生事件执行就是在冒泡阶段执行的吧 
123
会走 
1
判断了target 就不会走div了 
韦林
因为事件没在Button 上 
喜喜
没懂为啥没冒泡，div不是也加了onclick的事件函数 
沉默的木子
就是说事件都是绑定在document上面的，所以就没法向上冒泡了，只是调用的方法是target上的handler 



如果建立多个组件  document会被多次绑定事件咯  感觉这一块放在初始化的地方好点 
1.多个组件，文档 不会绑定多个事件 因为做了判断了，如果绑过了就不绑了
2.其实在源码真的就是一上来就全在初始化阶段绑上了所有的事件
http://www.zhufengpeixun.com/strong/html/126.12.react-4.html#t204.1%20react-dom.js


人生只如初见
多个组件不会被多次绑定啊 
沉默的木子
原生事件执行就是在冒泡阶段执行的吧 是的
123
会走 
1
判断了target 就不会走div了 是的
韦林
因为事件没在Button 上 
喜喜
没懂为啥没冒泡，div不是也加了onclick的事件函数 
没有，我们没有给任何DOm添加onclick
只能document添加了事件函数
沉默的木子
就是说事件都是绑定在document上面的，所以就没法向上冒泡了，只是调用的方法是target上的handler 
人生只如初见
怎，1判断是否阻止冒泡 
123撤回了一条消息
123撤回了一条消息
14:48
h2x
51错了吧 
人生只如初见
51行是不是写错了？应该是 = nativeEvent 
123
一样的因为 从nativeEvent copy 了一遍 
喜喜
我还没懂最开始为啥冒泡没冒成 
人生只如初见
因为只有document上有事件，其他元素上没有事件 是的
沉默的木子
事件都是绑定在document上了，没法向上冒泡了啊  的
废物的点心
事件在docuemnt上 所以没冒成 是的
其实原生冒泡是执行了，一直冒泡到文档 对象上了
喜喜
div上不是绑了吗 
123
阻止了冒泡那事件不久绑定不到document 吗？ 
h2x
72也错了吧 
人生只如初见
绑定到document上和冒泡无关 
1
这样生成封装的事件对象 会不会很耗性能? 能不能直接用Object.create() 
漫漫人生
没有return 
h2x
54 
h2x
54，76错了 



div上面有，但是创建的时候是先创建了button，所以创建div的时候就不会再绑定事件了 
div上没有绑定事件
1.绑定时候先绑的是div

14:59
沉默的木子
是不是如果用Object.create的话，当是函数的时候this就不好保证了？ 
废物的点心
老师 你在模拟阻止冒泡的方法里调用了原生的阻止冒泡的方法， 不阻止也不会有问题吧？  
其实没有问题



喜喜
模拟阻止冒泡 是阻止 模拟冒泡那段吗 
张仁阳
休息5分 
h2x
如果我用同步任务setstate，把isbatchingupdate设为true，在用微任务更新视图，更新完视图的时候把isbatchingupdata设置false，这样可以替代合成事件吧 

如果我在像生命周期中这些地方执行setState, isbatchingupdate 不就没有执行吗 
看看阻止默认事件怎么做的 
 if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }

  漫漫人生
  成功把批量机制从react15更新到了react18


  
setState({number: this.state,number + 1})
setState({number: this.state,number + 2})
这样批量的话  最终是
setState({number: this.state,number + 2})吗 
是一样的
靜待雨落
写2个不一样的 


15:43
人生只如初见
ref是真实dom还是组件实例？ 
123
这个ref 是为了保证 这个值不变 
123
看你绑定在谁身上 
我赌你的枪里没有子弹
ref 也可以放一些其他值 
ref可以放任何的值
人生只如初见
讲讲ref怎么保持值不变，组件更新后保持同一个引用？ 
这个是没有问题的


为什么要调用一下 creatRef ?'
为了初始化Ref  
15:52
123撤回了一条消息
人生只如初见
普通对象不用ref的话更新后就不相等了吧 
这个问题在我们后面讲react hooks的时候会有详细 的讲
废物的点心撤回了一条消息
ilark
callback要把旧的值传回去 
Hedgehog
源码有diff，这里直接替换 
Hedgehog
callback调用完也要清空吧 
h2x
callback.call() 
人生只如初见
callback不应该在setState里调用么 
1
手写一个对象 不就行了 

16:02
h2x
不需要callback.call(classInstance)吗 
人生只如初见
箭头函数，不用 
h2x
不写箭头函数不就变了 


this.refs 已经废弃了

16:16
123
但是useRef 和forwardRef 有什么区别呢？ 
useRef我们会在后面讲react hooks

16:24
ilark
type.render属性 
韦林
forwardRef  为了把ref 传入函数组件中  是的
人生只如初见
type.render?type不就是函数组件么？ 
不是



123
函数组件也会销毁吗？ 
韦林
执行完就没了 
浅夏
这是15的生命周期吧 
kkkk
类组件执行完不也没了？ 
类组件一直都会在

123
函数组件的setTimeout 和addEventListener 不用手动销毁  
123撤回了一条消息
123撤回了一条消息
123撤回了一条消息
韦林
类 执行会产生 实例 new Class().      
123
24行 = 0 



17:07
漫漫人生
没有 
沉默的木子
子组件的props改变了，但是如果父组件不更新的话组组件也不更新？ 




子组件创建的时候  willReceiceProps 没有执行 

属性改变的时候 才会执行willReceiveProps 初次挂载不走

挂载的时候  父组件传的内容的值却有  感觉第一次挂载也要执行
   willReceiceNewProp 却没有执行  不太明白为什么 第一次就不接收属性吗  




这次的domdiff涉及fiber吗 
react15
喜喜
刚讲的批量更新只在事件处理函数处理了，要是其他地方有批量更新是怎么做的呢 
人生只如初见
react太灵活了 


刚讲的批量更新只在事件处理函数处理了，要是其他地方有批量更新是怎么做的呢 
在React17以前，如果想在事件函数之外实现批量更新
 ReactDOM.unstable_batchedUpdates(() => {
        this.setState({ number: this.state.number + 1 })
        console.log(this.state.number);
        this.setState({ number: this.state.number + 1 })
        console.log(this.state.number);
      });

      
在其他地方多次this.setState会不会批量更新 
不会的
只有在事件函数中才是批量的
人生只如初见
这次讲18么？ 
人生只如初见
现在新项目类组件都不用了吧 
尽量不要用
