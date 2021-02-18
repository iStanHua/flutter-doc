# Padding 填充

> A widget that insets its child by the given padding.

## 简介

Padding在Flutter中用的也挺多的，作为一个基础的控件，功能非常单一，给子节点设置padding属性。写过其他端的都了解这个属性，就是设置内边距属性，内边距的空白区域，也是widget的一部分。

Flutter中并没有单独的Margin控件，在Container中有margin属性，看源码关于margin的实现。

```dart
if (margin != null)
  current = new Padding(padding: margin, child: current);
```

不难看出，Flutter中淡化了margin以及padding的区别，margin实质上也是由Padding实现的。

## 布局行为

Padding的布局分为两种情况：

* 当child为空的时候，会产生一个宽为left+right，高为top+bottom的区域；
* 当child不为空的时候，Padding会将布局约束传递给child，根据设置的padding属性，缩小child的布局尺寸。然后Padding将自己调整到child设置了padding属性的尺寸，在child周围创建空白区域。

## 继承关系

```dart
Object > Diagnosticable > DiagnosticableTree > Widget > RenderObjectWidget > SingleChildRenderObjectWidget > Padding
```

从继承关系可以看出，Padding控件是一个基础控件，不像Container这种组合控件。Container中的margin以及padding属性都是利用Padding控件去实现的。

### 关于SingleChildRenderObjectWidget

SingleChildRenderObjectWidget是RenderObjectWidgets的一个子类，用于限制只能有一个子节点。它只提供child的存储，而不提供实际的更新逻辑。

### 关于RenderObjectWidgets

RenderObjectWidgets为RenderObjectElement提供配置，而RenderObjectElement包含着（wrap）RenderObject，RenderObject则是在应用中提供实际的绘制（rendering）的元素。

## 示例代码

实例代码直接上官方的例子，非常的简单：

```dart
new Padding(
  padding: new EdgeInsets.all(8.0),
  child: const Card(child: const Text('Hello World!')),
)
```
例子中对Card设置了一个宽度为8的内边距。

## 源码解析

构造函数如下：

```dart
const Padding({
    Key key,
    @required this.padding,
    Widget child,
  })
```
包含一个padding属性，相当的简单。

###  属性解析

**padding**：padding的类型为`EdgeInsetsGeometry`，EdgeInsetsGeometry是EdgeInsets以及EdgeInsetsDirectional的基类。在实际使用中不涉及到国际化，例如适配阿拉伯地区等，一般都是使用EdgeInsets。EdgeInsetsDirectional光看命名就知道跟方向相关，因此它的四个边距不限定上下左右，而是根据方向来定的。

###  源码

```dart
@override
  RenderPadding createRenderObject(BuildContext context) {
    return new RenderPadding(
      padding: padding,
      textDirection: Directionality.of(context),
   );
}
```

Padding的创建函数，实际上是由`RenderPadding`来进行的。

关于RenderPadding的实际布局表现，当child为null的时候：

```dart
if (child == null) {
  size = constraints.constrain(new Size(
    _resolvedPadding.left + _resolvedPadding.right,
    _resolvedPadding.top + _resolvedPadding.bottom
  ));
  return;
}
```

返回一个宽为_resolvedPadding.left+_resolvedPadding.right，高为_resolvedPadding.top+_resolvedPadding.bottom的区域。

当child不为null的时候，经历了三个过程，即调整child尺寸、调整child位置以及调整Padding尺寸，最终达到实际的布局效果。

```dart
// 调整child尺寸
final BoxConstraints innerConstraints = constraints.deflate(_resolvedPadding);
child.layout(innerConstraints, parentUsesSize: true);

// 调整child位置
final BoxParentData childParentData = child.parentData;
childParentData.offset = new Offset(_resolvedPadding.left, _resolvedPadding.top);

// 调整Padding尺寸
size = constraints.constrain(new Size(
  _resolvedPadding.left + child.size.width + _resolvedPadding.right,
  _resolvedPadding.top + child.size.height + _resolvedPadding.bottom
));
```

到此处，上面介绍的padding布局行为就解释的通了。

## 使用场景

Padding本身还是挺简单的，基本上需要间距的地方，它都能够使用。如果在单一的间距场景，使用Padding比Container的成本要小一些，毕竟Container里面包含了多个widget。Padding能够实现的，Container都能够实现，只不过，Container更加的复杂。