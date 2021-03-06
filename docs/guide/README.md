# 介绍

> 本文主要介绍Flutter相关的东西，包括Fuchsia、Dart、Flutter特性、安装以及整体架构等内容。

Flutter作为谷歌最近推出的跨平台开发框架，一经推出便吸引了不少注意。关于Flutter，目前我们知道它是一个跨平台开发框架。但是它本身并不止于此，例如Fuchsia、Dart等，我们也都需要去了解。

### Fuchsia

说到Flutter，绝对绕不开Fuchsia，这个是谷歌开发的一款全新的操作系统，[GitHub地址](https://github.com/fuchsia-mirror)以及[Google source主页](https://fuchsia.googlesource.com/)。Fuchsia内核是Magenta Kernel，一个基于[LittleKernel](https://github.com/littlekernel/lk)的项目。该系统与Android相比，无论是存储器还是内存之类的硬件要求都大幅降低，外界推论是一款面向物联网的系统。笔者倒是没有查到谷歌开发这款操作系统的目的，如果有知晓的，也烦请告知。

就像很多博客主说的那样，如果只是取代Android，那无疑是一种很不好的做法。任何技术的推动，都得靠背后的商业驱动，尤其是这种涉及到手机厂商利益的技术。

### Flutter

Flutter是Fuchsia的开发框架，是一套移动UI框架，可以快速在iOS、Android以及Fuchsia上构建高质量的原生用户界面。 目前Flutter是完全免费、开源的，[GitHub地址](https://github.com/flutter/flutter)。其官方编程语言为Dart，也是一门全新的语言。所以说，上手成本比较高，对于移动端开发人员，语言以及框架都是全新的，整个技术栈的积累也都得从头开始。

可以看下其官方介绍的特性：

* 快速开发：Flutter的热重载可以快速地进行测试、构建UI、添加功能并更快地修复错误。
*  富有表现力，漂亮的用户界面：自带的Material Design和Cupertino（iOS风格）widget、丰富的motion API、平滑而自然的滑动效果。
*  响应式框架：使用Flutter的现代、响应式框架，和一系列基础widget，轻松构建您的用户界面。
*  访问本地功能和SDK：Flutter可以复用现有的Java、Swift或ObjC代码，访问iOS和Android上的原生系统功能和系统SDK。
*  统一的应用开发体验：Flutter拥有丰富的工具和库，可以帮助开发者轻松地同时在iOS和Android系统中实现想法和创意。
*  原生性能：Flutter包含了许多核心的widget，如滚动、导航、图标和字体等，这些都可以在iOS和Android上达到原生应用一样的性能。

其实从官方特性来看，唯一有点吸引力的就是统一的应用开发体验。一套代码运行在多个平台，做到真正的跨平台。像热加载，目前Android开发本身就支持了，响应式框架以及访问本地功能和SDK，对于Native来说，本身并没有多大的吸引。至于漂亮的用户界面，国内的商业项目，哪一个会去按照Material Design去设计。

跨平台本身，往往意味着性能受损，通用性解决不了的问题，又得回到Native去实现。所以这些因素也是跨平台从移动端诞生之初就开始提，到现在也没有被很好解决的一个原因。至于谷歌能够做到什么程度，或者说开发者该保持什么期许，我觉得都不好说，或许谷歌解决了一个多年的难题，或者又像被谷歌放弃掉的其他项目一样。抛开商业层面，对于技术人员，我们更多的是应该去关注它的思想，谷歌是如何去解决这些实际存在很久的问题的，至于技术本身的发展，这个是个人开发者无法去左右的，技术的更迭，保持一种学习的状态，然后努力锻炼身体，就能够保证不被淘汰掉。

### Dart

Dart是谷歌开发的计算机编程语言，于2011年10月份发布，可以被用于web、服务器、移动端和物联网等领域的开发。Flutter采用Dart，原因很多，抛开商业层面的Java版权问题，单纯从技术层面：

* Dart是AOT（Ahead Of Time）编译的，编译成快速、可预测的本地代码，使Flutter几乎都可以使用Dart编写；
* Dart也可以JIT（Just In Time）编译，开发周期快；
* Dart可以更轻松地创建以60fps运行的流畅动画和转场；
* Dart使Flutter不需要单独的声明式布局语言；
* Dart容易学习，具有静态和动态语言用户都熟悉的特性。

Dart最初设计是为了取代JavaScript成为web开发的首选语言，最后的结果可想而知，到Dart 2的发布，专注于改善构建客户端应用程序的体验，可以看出定位的转变。用过Java、Kotlin的人，可以很快的上手Dart。

一门语言的成败，抛开背后的商业推动，我想很重要的一点在于其生态，生态的好坏，主要包括开发者以及第三方库的数目，目前看，Dart的生态还是比较差。对于个人开发者，可以根据心情来选择，但是对于商业应用，有更复杂的考量标准。Dart背后有谷歌的推动，能发展到什么程度，还得看其商业运作能力了。

## 配置

此部分针对Mac平台，[Windows平台的安装配置](https://flutterchina.club/setup-windows/)，[Linux平台的安装配置](https://flutterchina.club/setup-linux/)。由于笔者主要做移动端开发，如果想使用Flutter进行iOS和Android全平台的开发，环境也建议是Mac平台，毕竟iOS只能在Mac下进行模拟调试。

### 安装Flutter

```
git clone -b beta https://github.com/flutter/flutter.git
export PUB_HOSTED_URL=https://pub.flutter-io.cn //国内用户需要设置
export FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn //国内用户需要设置
export PATH=`pwd`/flutter/bin:$PATH
```

### iOS设置

```
brew update
brew install --HEAD libimobiledevice
brew install ideviceinstaller ios-deploy cocoapods
pod setup
```

### Android设置

下载Android Studio，安装Flutter插件，会将Dart插件也一起安装。

### 体验Flutter

IDE建议选择Android Studio，安装了Flutter插件后，Flutter的开发跟Android
开发类似，附带三种模版工程、断点调试等。

在Android Studio里面新建一个Flutter Application的项目，选择模拟器或者直接连接真机运行，就可以看到一个简单的Flutter应用了，可以在Android和iOS不同平台下看看差异。

## Flutter架构

Flutter是一款移动应用程序SDK，一份代码可以同时生成iOS和Android两个高性能、高保真的应用程序。

![Flutter不同平台表现](http://whysodiao.com/images/Flutter-Platform-Show.png)

Flutter对于移动开发人员，最诱惑的能力是其完全的跨平台特性，不同于RN这种一处学到处写，它是一处写到出跑，但是他跟其他的跨平台有何区别呢？

### 跨平台解决方案

市面上的跨平台解决方案，可以大致归结为两类：

* 使用平台支持的web技术：这些解决方案基本上加载了应用程序中的移动浏览器，并在该浏览器中执行所有的逻辑，例如PhoneGap。
* 本地跨平台：程序员编写的代码自动转换为Native代码，这种方式的优点是近乎原生的性能，例如RN、Weex、Xamarin等。

这些方案是否真正的解决了跨平台问题呢？从目前的状况来看，很显然是没有的，因为它们都始终逃不开性能、包大小、流畅性、内存、平台特性等问题。

![2017年8月跨平台性能测试](http://whysodiao.com/images/cross-platform-performance.png)

RN单独拧出来说，是因为它们并不是追求的一次写到处跑，FB自己也知道不现实，所以把口号改成一次学到处写，去考虑平台的特性，去考虑这个被跨平台方案经常忽略的问题。但是RN也并没有被广泛的接纳，从阿里开始使用到放弃，里面的很多坑都绕不过去。写一次到处跑确实很诱人，从企业角度讲，可以节省大量的人力，但是却忽略了一个很基础的问题，不同平台是否希望如此，苹果是否会愿意自己的生态被打破，不同平台的特性是否应该被归为一致。

### Flutter的跨平台解决方案

上面简单说了传统跨平台解决方案，我们再回过头看看Flutter的解决方案，Flutter跨平台最核心的部分，是它的高性能渲染引擎（Flutter Engine）。Flutter不使用浏览器技术，也不使用Native的原生控件，它使用自己的渲染引擎来绘制widget。

说到widget，就要说一句Flutter的`一切皆为widget`理念。widget是Flutter应用程序用户界面的基本构建块。每个widget都是用户界面一部分的不可变声明。与其他将视图、控制器、布局和其他属性分离的框架不同，Flutter具有一致的统一对象模型：widget。在更新widget的时候，框架能够更加的高效。

对于Android平台，Flutter引擎的C/C++代码是由NDK编译，在iOS平台，则是由LLVM编译，两个平台的Dart代码都是AOT编译为本地代码，Flutter应用程序使用本机指令集运行。

Flutter正是是通过使用相同的渲染器、框架和一组widget，来同时构建iOS和Android应用，而无需维护两套独立的代码库。

![Flutter](http://whysodiao.com/images/flutter-platform.png)

Flutter将UI组件和渲染器从平台移动到应用程序中，这使得它们可以自定义和可扩展。Flutter唯一要求系统提供的是canvas，以便定制的UI组件可以出现在设备的屏幕上。

### Flutter框架

Flutter框架是一个分层的结构，每个层都建立在前一层之上。

![Flutter 框架](http://whysodiao.com/images/flutter-architecture.png)

框架没什么可介绍的（主要是详细介绍我也没找到啥资料，大写的尴尬），看着很简单，就分为两个部分，Framework和Engine部分，其中Framework提供了各种基础的组件库，Engine部分渲染各种widget，两者共同作用，使得运行性能高效稳定。

## Flutter调研

### 生态

在Flutter官方的[Pub](https://pub.dartlang.org/)平台上，纯Flutter Package大概有两千多个，基本上常见的库还是都有的，例如网络、图片、音视频播放等等。但是对于目前Android以及iOS的生态，还是远远的不足的，对于一些复杂的UI或者一些不是特别通用的功能，就得自己去实现。

### 包大小

根据官网的介绍，一个最小的Android版本的Flutter应用。release版本大小约6.7MB，其中核心引擎大约3.3MB，框架+应用程序代码大约是1.25MB，LICENSE文件（包含在app.flx中）是55k，必需的Java代码.dex为40k，并且约有2.1MB的ICU数据。考虑到目前网络环境，包大小的增加，还也在可以接受的范围。

### Crash

iOS运行官方的例子，会有时候crash掉，因此我们将一个[开源的Flutter应用](https://github.com/roughike/inKino)，添加了Bugly上报，在Android平台进行了众测。

![众测人次及启动次数](http://whysodiao.com/images/Crash问题.png)

参与人次大概150人左右，启动次数大概500次左右，没有出现一次Crash数据上报，由于app很简单，并不能说明很多问题，但是众测用户反馈了约12条信息，其中1条是类似于ANR，无法操作，其余的部分则是卡顿相关的反馈。

### 流畅性

将官方的例子发给测试同学，让在iOS以及Android平台的不同机子上运行了下。在iOS上基本上流畅运行，没有出现卡顿的现象，在Android部分设备上，出现了卡顿的现象。

![Android流畅性评测](http://whysodiao.com/images/Android流畅性评测.png)

![iOS流畅性评测](http://whysodiao.com/images/iOS流畅性评测.png)

由于没有复杂的例子，其实这个流畅性的测试，意义不是特别大，官方简单的控件展示demo程序，本身就很简单，但是在Android上还是出现了不少问题，只能说明整体还有非常大的优化空间。

### 编写复杂程度

试着照着一张设计稿进行了简单的纯布局代码工作，初次接触用起来还是比较复杂，尤其是那恐怖的嵌套层级，对代码维护来说绝对是个问题，而且由于Flutter的widget机制，很多组件只支持最基本的操作，例如一些扩展的属性，都得自己去实现，况且现在组件库还不是非常的丰富。代码量也比较多，整个代码大概有500行左右，还只是不涉及到一些交互以及数据绑定等。

![iOS和Android运行对比](http://whysodiao.com/images/flutter-app-show.png)

从运行效果看，还是比较的不错，两者还原的效果都挺不错的。

### 结论

如果是个人而言，我觉得可以放心大胆的去学习尝试，如果自己开发app的话，可以写一套代码，在多个平台运行发布。

如果是商业团队，这个就要自行取舍，目前而言，Flutter生态还是非常的不完善，相关的资料也非常少。目前处于beta 3阶段，多久能到release，能否到release，都是个未知数，而且，用Flutter，最大的风险，就是项目整体的不可把控，一旦出现一些坑，如果能填好，那还行，如果涉及到无法解决的问题，就只能放弃。因此看自己团队人力以及时间合理安排比较合适。目前看阿里的咸鱼团队在研究Flutter。

如果单纯从Flutter本身能够解决的问题的方面出发，使用Flutter确实能够产生一定的收益，节省开发成本，如果考虑到目前坑比较多的状况，加上踩坑的时间，可能就无法去评估了。

总体来说，Flutter确实是一个比较不错的东西，如果谷歌能够把它发展的比较完善，对于个人以及小团队来说，确实是个福音。

## 参考

1. [Flutter中文网](https://flutterchina.club/)
2. [Google 悄悄开发的全新操作系统 Fuchsia 被发现了！](http://osp.io/archives/2540)
3. [为什么Flutter会选择 Dart ？](http://www.infoq.com/cn/articles/why-flutter-uses-dart)
4. [Flutter教程(二) 了解Dart语言](https://juejin.im/post/5aebc5fb518825670c45c91b)
5. [为什么移动端跨平台开发不靠谱？](https://juejin.im/post/59f2346df265da430d573fd8)
6. [为什么说Flutter是革命性的？](http://www.infoq.com/cn/articles/why-is-flutter-revolutionary)



