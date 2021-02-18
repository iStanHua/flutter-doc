# Flow 流式布局

> A widget that implements the flow layout algorithm.

Flow按照解释的那样，是一个实现流式布局算法的控件。流式布局在大前端是很常见的布局方式，但是一般使用Flow很少，因为其过于复杂，很多场景下都会去使用Wrap。

## 布局行为

Flow官方介绍是一个对child尺寸以及位置调整非常高效的控件，主要是得益于其FlowDelegate。另外Flow在用转换矩阵（transformation matrices）对child进行位置调整的时候进行了优化。

Flow以及其child的一些约束都会受到FlowDelegate的控制，例如重写FlowDelegate中的geiSize，可以设置Flow的尺寸，重写其getConstraintsForChild方法，可以设置每个child的布局约束条件。

Flow之所以高效，是因为其在定位过后，如果使用FlowDelegate中的paintChildren改变child的尺寸或者位置，只是重绘，并没有实际调整其位置。

## 继承关系

```dart
Object > Diagnosticable > DiagnosticableTree > Widget > RenderObjectWidget > MultiChildRenderObjectWidget > Flow
```

## 示例代码

```dart
const width = 80.0;
const height = 60.0;

Flow(
  delegate: TestFlowDelegate(margin: EdgeInsets.fromLTRB(10.0, 10.0, 10.0, 10.0)),
  children: <Widget>[
    new Container(width: width, height: height, color: Colors.yellow,),
    new Container(width: width, height: height, color: Colors.green,),
    new Container(width: width, height: height, color: Colors.red,),
    new Container(width: width, height: height, color: Colors.black,),
    new Container(width: width, height: height, color: Colors.blue,),
    new Container(width: width, height: height, color: Colors.lightGreenAccent,),
  ],
)

class TestFlowDelegate extends FlowDelegate {
  EdgeInsets margin = EdgeInsets.zero;

  TestFlowDelegate({this.margin});
  @override
  void paintChildren(FlowPaintingContext context) {
    var x = margin.left;
    var y = margin.top;
    for (int i = 0; i < context.childCount; i++) {
      var w = context.getChildSize(i).width + x + margin.right;
      if (w < context.size.width) {
        context.paintChild(i,
            transform: new Matrix4.translationValues(
                x, y, 0.0));
        x = w + margin.left;
      } else {
        x = margin.left;
        y += context.getChildSize(i).height + margin.top + margin.bottom;
        context.paintChild(i,
            transform: new Matrix4.translationValues(
                x, y, 0.0));
        x += context.getChildSize(i).width + margin.left + margin.right;
      }
    }
  }

  @override
  bool shouldRepaint(FlowDelegate oldDelegate) {
    return oldDelegate != this;
  }
}
```

样例其实并不复杂，FlowDelegate需要自己实现child的绘制，其实大多数时候就是位置的摆放。上面例子中，对每个child按照给定的margin值，进行排列，如果超出一行，则在下一行进行布局。

![Flow样例](http://whysodiao.com/images/Flow-Sample.png )

另外，对这个例子多做一个说明，对于上述child宽度的变化，这个例子是没问题的，如果每个child的高度不同，则需要对代码进行调整，具体的调整是换行的时候，需要根据上一行的最大高度来确定下一行的起始y坐标。

## 源码解析

构造函数如下：

```dart
Flow({
  Key key,
  @required this.delegate,
  List<Widget> children = const <Widget>[],
})
```

### 属性解析

**delegate**：影响Flow具体布局的FlowDelegate。

其中FlowDelegate包含如下几个方法：

* getConstraintsForChild: 设置每个child的布局约束条件，会覆盖已有的；
* getSize：设置Flow的尺寸；
* paintChildren：child的绘制控制代码，可以调整尺寸位置，写起来比较的繁琐；
* shouldRepaint：是否需要重绘；
* shouldRelayout：是否需要重新布局。

其中，我们平时使用的时候，一般会使用到paintChildren以及shouldRepaint两个方法。

### 源码

我们先来看一下Flow的布局代码

```dart
Size _getSize(BoxConstraints constraints) {
  assert(constraints.debugAssertIsValid());
  return constraints.constrain(_delegate.getSize(constraints));
}

@override
void performLayout() {
  size = _getSize(constraints);
  int i = 0;
  _randomAccessChildren.clear();
  RenderBox child = firstChild;
  while (child != null) {
    _randomAccessChildren.add(child);
    final BoxConstraints innerConstraints = _delegate.getConstraintsForChild(i, constraints);
    child.layout(innerConstraints, parentUsesSize: true);
    final FlowParentData childParentData = child.parentData;
    childParentData.offset = Offset.zero;
    child = childParentData.nextSibling;
    i += 1;
  }
}
```

可以看到Flow尺寸的取值，直接来自于delegate的getSize方法。对于每一个child，则是将delegate中的getConstraintsForChild设置的约束条件，设置在child上。

Flow布局上的表现，受Delegate中getSize以及getConstraintsForChild两个方法的影响。第一个方法设置其尺寸，第二个方法设置其children的布局约束条件。

接下来我们来看一下其绘制方法。

```dart
void _paintWithDelegate(PaintingContext context, Offset offset) {
  _lastPaintOrder.clear();
  _paintingContext = context;
  _paintingOffset = offset;
  for (RenderBox child in _randomAccessChildren) {
    final FlowParentData childParentData = child.parentData;
    childParentData._transform = null;
  }
  try {
    _delegate.paintChildren(this);
  } finally {
    _paintingContext = null;
    _paintingOffset = null;
  }
}
```

它的绘制方法非常的简单，先将上次设置的参数都初始化，然后调用delegate中的paintChildren进行绘制。在paintChildren中会调用paintChild方法去绘制每个child，我们接下来看下其代码。

```dart
@override
  void paintChild(int i, { Matrix4 transform, double opacity = 1.0 }) {
    transform ??= new Matrix4.identity();
    final RenderBox child = _randomAccessChildren[i];
    final FlowParentData childParentData = child.parentData;
    _lastPaintOrder.add(i);
    childParentData._transform = transform;

    if (opacity == 0.0)
      return;

    void painter(PaintingContext context, Offset offset) {
      context.paintChild(child, offset);
    }

    if (opacity == 1.0) {
      _paintingContext.pushTransform(needsCompositing, _paintingOffset, transform, painter);
    } else {
      _paintingContext.pushOpacity(_paintingOffset, _getAlphaFromOpacity(opacity), (PaintingContext context, Offset offset) {
        context.pushTransform(needsCompositing, offset, transform, painter);
      });
    }
  }
```

paitChild函数首先会将transform值设在child上，然后根据opacity值，决定其绘制的表现。

* 当opacity为0时，只是设置了transform值，这样做是为了让其响应区域跟随调整，虽然不显示出来；
* 当opacity为1的时候，只是进行Transform操作；
* 当opacity大于0小于1时，先调整其透明度，再进行Transform操作。

至于其为什么高效，主要是因为它的布局函数不牵涉到child的布局，而在绘制的时候，则根据delegate中的策略，进行有效的绘制。

## 使用场景

Flow在一些定制化的流式布局中，有可用场景，但是一般写起来比较复杂，但胜在灵活性以及其高效。
