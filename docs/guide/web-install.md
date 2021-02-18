# Flutter Web环境搭建


## 1、克隆Flutter Web代码仓库
目前`Flutter Web`是作为一个单独分支预览，我们将其克隆到本地，建议存放目录跟`Flutter`同级

```
git clone https://github.com/flutter/flutter_web.git
```
## 2、安装Flutter Web构建工具
执行下面的命令安装`webdev`包，它提供了用于`Flutter Web`开发的构建工具集：
```
flutter pub global activate webdev
```

配置 flutter 的 PATH 环境变量
``` bash
## macOS Linux
export PATH="$PATH:`pwd`/flutter/.pub-cache/bin"
## Windows 控制面板->所有控制面板项->系统->高级系统配置->环境变量->系统变量(S)PATH添加
X:/flutter/.pub-cache/bin
```

## 3、验证Flutter Web开发环境的安装
 我们进入`flutter_web/examples/hello_world`目录，然后安装项目依赖包：
```
flutter pub get
pub get
```

现在就可以使用`webdev`启动开发服务器了：
```
webdev serve
```

最后使用浏览器打开 http://localhost:8080 访问到了。
