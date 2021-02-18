# Wrap 流式布局

> A widget that displays its children in multiple horizontal or vertical runs.

看简介，其实Wrap实现的效果，Flow可以很轻松，而且可以更加灵活的实现出来。

## 布局行为

Flow可以很轻易的实现Wrap的效果，但是Wrap更多的是在使用了Flex中的一些概念，某种意义上说是跟Row、Column更加相似的。

单行的Wrap跟Row表现几乎一致，单列的Wrap则跟Row表现几乎一致。但Row与Column都是单行单列的，Wrap则突破了这个限制，mainAxis上空间不足时，则向crossAxis上去扩展显示。

从效率上讲，Flow肯定会比Wrap高，但是Wrap使用起来会方便一些。

## 继承关系

```dart
Object > Diagnosticable > DiagnosticableTree > Widget > RenderObjectWidget > MultiChildRenderObjectWidget > Wrap
```

从继承关系上看，Wrap与Flow都是继承自MultiChildRenderObjectWidget，Flow可以实现Wrap的效果，但是两者却是单独实现的，说明两者有很大的不同。

## 示例代码

```dart
Wrap(
  spacing: 8.0, // gap between adjacent chips
  runSpacing: 4.0, // gap between lines
  children: <Widget>[
    Chip(
      avatar: CircleAvatar(
          backgroundColor: Colors.blue.shade900, child: new Text('AH', style: TextStyle(fontSize: 10.0),)),
      label: Text('Hamilton'),
    ),
    Chip(
      avatar: CircleAvatar(
          backgroundColor: Colors.blue.shade900, child: new Text('ML', style: TextStyle(fontSize: 10.0),)),
      label: Text('Lafayette'),
    ),
    Chip(
      avatar: CircleAvatar(
          backgroundColor: Colors.blue.shade900, child: new Text('HM', style: TextStyle(fontSize: 10.0),)),
      label: Text('Mulligan'),
    ),
    Chip(
      avatar: CircleAvatar(
          backgroundColor: Colors.blue.shade900, child: new Text('JL', style: TextStyle(fontSize: 10.0),)),
      label: Text('Laurens'),
    ),
  ],
)
```

示例代码直接使用的官方文档上的，效果跟Flow的例子中相似。

![Wrap样例](http://whysodiao.com/images/Wrap-Sample.png)

## 源码解析

构造函数如下：

```dart
Wrap({
  Key key,
  this.direction = Axis.horizontal,
  this.alignment = WrapAlignment.start,
  this.spacing = 0.0,
  this.runAlignment = WrapAlignment.start,
  this.runSpacing = 0.0,
  this.crossAxisAlignment = WrapCrossAlignment.start,
  this.textDirection,
  this.verticalDirection = VerticalDirection.down,
  List<Widget> children = const <Widget>[],
})
```

### 属性解析

**direction**：主轴（mainAxis）的方向，默认为水平。

**alignment**：主轴方向上的对齐方式，默认为start。

**spacing**：主轴方向上的间距。

**runAlignment**：run的对齐方式。run可以理解为新的行或者列，如果是水平方向布局的话，run可以理解为新的一行。

**runSpacing**：run的间距。

**crossAxisAlignment**：交叉轴（crossAxis）方向上的对齐方式。

**textDirection**：文本方向。

**verticalDirection**：定义了children摆放顺序，默认是down，见Flex相关属性介绍。

### 源码

我们来看下其布局代码。

第一步，如果第一个child为null，则将其设置为最小尺寸。

```dart
RenderBox child = firstChild;
if (child == null) {
  size = constraints.smallest;
  return;
}
```

第二步，根据direction、textDirection以及verticalDirection属性，计算出相关的mainAxis、crossAxis是否需要调整方向，以及主轴方向上的限制。

```dart
double mainAxisLimit = 0.0;
bool flipMainAxis = false;
bool flipCrossAxis = false;
switch (direction) {
  case Axis.horizontal:
    childConstraints = new BoxConstraints(maxWidth: constraints.maxWidth);
    mainAxisLimit = constraints.maxWidth;
    if (textDirection == TextDirection.rtl)
      flipMainAxis = true;
    if (verticalDirection == VerticalDirection.up)
      flipCrossAxis = true;
    break;
  case Axis.vertical:
    childConstraints = new BoxConstraints(maxHeight: constraints.maxHeight);
    mainAxisLimit = constraints.maxHeight;
    if (verticalDirection == VerticalDirection.up)
      flipMainAxis = true;
    if (textDirection == TextDirection.rtl)
      flipCrossAxis = true;
    break;
}
```

第三步，计算出主轴以及交叉轴的区域大小。

```dart
while (child != null) {
  child.layout(childConstraints, parentUsesSize: true);
  final double childMainAxisExtent = _getMainAxisExtent(child);
  final double childCrossAxisExtent = _getCrossAxisExtent(child);
  if (childCount > 0 && runMainAxisExtent + spacing + childMainAxisExtent > mainAxisLimit) {
    mainAxisExtent = math.max(mainAxisExtent, runMainAxisExtent);
    crossAxisExtent += runCrossAxisExtent;
    if (runMetrics.isNotEmpty)
      crossAxisExtent += runSpacing;
    runMetrics.add(new _RunMetrics(runMainAxisExtent, runCrossAxisExtent, childCount));
    runMainAxisExtent = 0.0;
    runCrossAxisExtent = 0.0;
    childCount = 0;
  }
  runMainAxisExtent += childMainAxisExtent;
  if (childCount > 0)
    runMainAxisExtent += spacing;
  runCrossAxisExtent = math.max(runCrossAxisExtent, childCrossAxisExtent);
  childCount += 1;
  final WrapParentData childParentData = child.parentData;
  childParentData._runIndex = runMetrics.length;
  child = childParentData.nextSibling;
}
```

第四步，根据direction设置Wrap的尺寸。

```dart
switch (direction) {
  case Axis.horizontal:
    size = constraints.constrain(new Size(mainAxisExtent, crossAxisExtent));
    containerMainAxisExtent = size.width;
    containerCrossAxisExtent = size.height;
    break;
  case Axis.vertical:
    size = constraints.constrain(new Size(crossAxisExtent, mainAxisExtent));
    containerMainAxisExtent = size.height;
    containerCrossAxisExtent = size.width;
    break;
}
```

第五步，根据runAlignment计算出每一个run之间的距离，几种属性的差异，之前文章介绍过，在此就不做详细阐述。

```dart
final double crossAxisFreeSpace = math.max(0.0, containerCrossAxisExtent - crossAxisExtent);
double runLeadingSpace = 0.0;
double runBetweenSpace = 0.0;
switch (runAlignment) {
  case WrapAlignment.start:
    break;
  case WrapAlignment.end:
    runLeadingSpace = crossAxisFreeSpace;
    break;
  case WrapAlignment.center:
    runLeadingSpace = crossAxisFreeSpace / 2.0;
    break;
  case WrapAlignment.spaceBetween:
    runBetweenSpace = runCount > 1 ? crossAxisFreeSpace / (runCount - 1) : 0.0;
    break;
  case WrapAlignment.spaceAround:
    runBetweenSpace = crossAxisFreeSpace / runCount;
    runLeadingSpace = runBetweenSpace / 2.0;
    break;
  case WrapAlignment.spaceEvenly:
    runBetweenSpace = crossAxisFreeSpace / (runCount + 1);
    runLeadingSpace = runBetweenSpace;
    break;
}
```

第六步，根据alignment计算出每一个run中child的主轴方向上的间距。

```dart
  switch (alignment) {
    case WrapAlignment.start:
      break;
    case WrapAlignment.end:
      childLeadingSpace = mainAxisFreeSpace;
      break;
    case WrapAlignment.center:
      childLeadingSpace = mainAxisFreeSpace / 2.0;
      break;
    case WrapAlignment.spaceBetween:
      childBetweenSpace = childCount > 1 ? mainAxisFreeSpace / (childCount - 1) : 0.0;
      break;
    case WrapAlignment.spaceAround:
      childBetweenSpace = mainAxisFreeSpace / childCount;
      childLeadingSpace = childBetweenSpace / 2.0;
      break;
    case WrapAlignment.spaceEvenly:
      childBetweenSpace = mainAxisFreeSpace / (childCount + 1);
      childLeadingSpace = childBetweenSpace;
      break;
  }
```

最后一步，调整child的位置。

```dart
  while (child != null) {
    final WrapParentData childParentData = child.parentData;
    if (childParentData._runIndex != i)
      break;
    final double childMainAxisExtent = _getMainAxisExtent(child);
    final double childCrossAxisExtent = _getCrossAxisExtent(child);
    final double childCrossAxisOffset = _getChildCrossAxisOffset(flipCrossAxis, runCrossAxisExtent, childCrossAxisExtent);
    if (flipMainAxis)
      childMainPosition -= childMainAxisExtent;
    childParentData.offset = _getOffset(childMainPosition, crossAxisOffset + childCrossAxisOffset);
    if (flipMainAxis)
      childMainPosition -= childBetweenSpace;
    else
      childMainPosition += childMainAxisExtent + childBetweenSpace;
    child = childParentData.nextSibling;
  }

  if (flipCrossAxis)
    crossAxisOffset -= runBetweenSpace;
  else
    crossAxisOffset += runCrossAxisExtent + runBetweenSpace;
```

我们大致梳理一下布局的流程。

* 如果第一个child为null，则将Wrap设置为最小尺寸，布局结束；
* 根据direction、textDirection以及verticalDirection属性，计算出mainAxis、crossAxis是否需要调整方向；
* 计算出主轴以及交叉轴的区域大小；
* 根据direction设置Wrap的尺寸；
* 根据runAlignment计算出每一个run之间的距离；
* 根据alignment计算出每一个run中child的主轴方向上的间距
* 调整每一个child的位置。

## 使用场景

对于一些需要按宽度或者高度，让child自动换行布局的场景，可以使用，但是Wrap可以满足的场景，Flow一定可以实现，只不过会复杂很多，但是相对的会灵活以及高效很多。