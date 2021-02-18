# Align 对齐

> A widget that aligns its child within itself and optionally sizes itself based on the child's size.

在其他端的开发，Align一般都是当做一个控件的属性，并没有拿出来当做一个单独的控件。Align本身实现的功能并不复杂，设置child的对齐方式，例如居中、居左居右等，并根据child尺寸调节自身尺寸。

## 布局行为

Align的布局行为分为两种情况：

* 当widthFactor和heightFactor为null的时候，当其有限制条件的时候，Align会根据限制条件尽量的扩展自己的尺寸，当没有限制条件的时候，会调整到child的尺寸；
* 当widthFactor或者heightFactor不为null的时候，Aligin会根据factor属性，扩展自己的尺寸，例如设置widthFactor为2.0的时候，那么，Align的宽度将会是child的两倍。

Align为什么会有这样的布局行为呢？原因很简单，设置对齐方式的话，如果外层元素尺寸不确定的话，内部的对齐就无法确定。因此，会有宽高因子、根据外层限制扩大到最大尺寸、外层不确定时调整到child尺寸这些行为。

##  继承关系

```dart
Object > Diagnosticable > DiagnosticableTree > Widget > RenderObjectWidget > SingleChildRenderObjectWidget > Align
```

可以看出，Align跟Padding一样，也是一个非常基础的组件，Container中的align属性，也是使用Align去实现的。

## 示例代码

```dart
new Align(
  alignment: Alignment.center,
  widthFactor: 2.0,
  heightFactor: 2.0,
  child: new Text("Align"),
)
```

例子依旧很简单，设置一个宽高为child两倍区域的Align，其child处在正中间。

## 源码解析

```dart
const Align({
    Key key,
    this.alignment: Alignment.center,
    this.widthFactor,
    this.heightFactor,
    Widget child
  })
```

Align的构造函数基本上就是宽高因子、对齐方式属性。日常使用中，宽高因子属性基本上用的不多。如果是复杂的布局，Container内部的align属性也可以实现相同的效果。

###  属性解析

***alignment***：对齐方式，一般会使用系统默认提供的9种方式，但是并不是说只有这9种，例如如下的定义。系统提供的9种方式只是预先定义好的。

```dart
/// The top left corner.
static const Alignment topLeft = const Alignment(-1.0, -1.0);
```

Alignment实际上是包含了两个属性的，其中第一个参数，-1.0是左边对齐，1.0是右边对齐，第二个参数，-1.0是顶部对齐，1.0是底部对齐。根据这个规则，我们也可以自定义我们需要的对齐方式，例如

```dart
/// 居右高于底部1/4处.
static const Alignment rightHalfBottom = alignment: const Alignment(1.0, 0.5),
```

***widthFactor***：宽度因子，如果设置的话，Align的宽度就是child的宽度乘以这个值，不能为负数。

***heightFactor***：高度因子，如果设置的话，Align的高度就是child的高度乘以这个值，不能为负数。

### 源码

```dart
@override
  RenderPositionedBox createRenderObject(BuildContext context) {
    return new RenderPositionedBox(
      alignment: alignment,
      widthFactor: widthFactor,
      heightFactor: heightFactor,
      textDirection: Directionality.of(context),
    );
  }
```

Align的实际构造调用的是`RenderPositionedBox`。

RenderPositionedBox的布局表现如下：

```dart
// 根据_widthFactor、_heightFactor以及限制因素来确定宽高
final bool shrinkWrapWidth = _widthFactor != null || constraints.maxWidth == double.infinity;
final bool shrinkWrapHeight = _heightFactor != null || constraints.maxHeight == double.infinity;

if (child != null) {
  //  如果child不为null，则根据规则设置Align的宽高，如果需要缩放，则根据_widthFactor是否为null来进行缩放，如果不需要，则尽量扩展。
  child.layout(constraints.loosen(), parentUsesSize: true);
  size = constraints.constrain(new Size(shrinkWrapWidth ? child.size.width * (_widthFactor ?? 1.0) : double.infinity,
                                        shrinkWrapHeight ? child.size.height * (_heightFactor ?? 1.0) : double.infinity));
  alignChild();
} else {
  // 如果child为null，如果需要缩放，则变为0，否则就尽量扩展
  size = constraints.constrain(new Size(shrinkWrapWidth ? 0.0 : double.infinity,
                                        shrinkWrapHeight ? 0.0 : double.infinity));
}
```

## 使用场景

一般在对齐场景下使用，例如需要右对齐或者底部对齐之类的。它能够实现的功能，Container都能实现。