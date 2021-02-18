# Table 流式布局

> A widget that uses the table layout algorithm for its children.


每一种移动端布局中都会有一种table布局，这种控件太常见了。至于其表现形式，完全可以借鉴其他移动端的，通俗点讲，就是表格。

## 布局行为

表格的每一行的高度，由其内容决定，每一列的宽度，则由columnWidths属性单独控制。

## 继承关系

```dart
Object > Diagnosticable > DiagnosticableTree > Widget > RenderObjectWidget > Table
```

## 示例代码

```dart
Table(
  columnWidths: const <int, TableColumnWidth>{
    0: FixedColumnWidth(50.0),
    1: FixedColumnWidth(100.0),
    2: FixedColumnWidth(50.0),
    3: FixedColumnWidth(100.0),
  },
  border: TableBorder.all(color: Colors.red, width: 1.0, style: BorderStyle.solid),
  children: const <TableRow>[
    TableRow(
      children: <Widget>[
        Text('A1'),
        Text('B1'),
        Text('C1'),
        Text('D1'),
      ],
    ),
    TableRow(
      children: <Widget>[
        Text('A2'),
        Text('B2'),
        Text('C2'),
        Text('D2'),
      ],
    ),
    TableRow(
      children: <Widget>[
        Text('A3'),
        Text('B3'),
        Text('C3'),
        Text('D3'),
      ],
    ),
  ],
)
```

一个三行四列的表格，第一三行宽度为50，第二四行宽度为100。

![Table样例](http://whysodiao.com/images/Table-Sample.png)

## 源码解析

构造函数如下：

```dart
Table({
  Key key,
  this.children = const <TableRow>[],
  this.columnWidths,
  this.defaultColumnWidth = const FlexColumnWidth(1.0),
  this.textDirection,
  this.border,
  this.defaultVerticalAlignment = TableCellVerticalAlignment.top,
  this.textBaseline,
})
```

### 属性解析

**columnWidths**：设置每一列的宽度。

**defaultColumnWidth**：默认的每一列宽度值，默认情况下均分。

**textDirection**：文字方向，一般无需考虑。

**border**：表格边框。

**defaultVerticalAlignment**：每一个cell的垂直方向的alignment。

总共包含5种：

* top：被放置在的顶部；
* middle：垂直居中；
* bottom：放置在底部；
* baseline：文本baseline对齐；
* fill：充满整个cell。

**textBaseline**：defaultVerticalAlignment为baseline的时候，会用到这个属性。

### 源码

我们直接来看其布局源码：

第一步，当行或者列为0的时候，将自身尺寸设为0x0。

```dart
if (rows * columns == 0) {
  size = constraints.constrain(const Size(0.0, 0.0));
  return;
}
```

第二步，根据textDirection值，设置方向，一般在阿拉伯语系中，一些文本都是从右往左现实的，平时使用时，不需要去考虑这个属性。

```dart
switch (textDirection) {
  case TextDirection.rtl:
    positions[columns - 1] = 0.0;
    for (int x = columns - 2; x >= 0; x -= 1)
      positions[x] = positions[x+1] + widths[x+1];
    _columnLefts = positions.reversed;
    tableWidth = positions.first + widths.first;
    break;
  case TextDirection.ltr:
    positions[0] = 0.0;
    for (int x = 1; x < columns; x += 1)
      positions[x] = positions[x-1] + widths[x-1];
    _columnLefts = positions;
    tableWidth = positions.last + widths.last;
    break;
}
```

第三步，设置每一个cell的尺寸。

```dart
  for (int x = 0; x < columns; x += 1) {
    final int xy = x + y * columns;
    final RenderBox child = _children[xy];
    if (child != null) {
      final TableCellParentData childParentData = child.parentData;
      childParentData.x = x;
      childParentData.y = y;
      switch (childParentData.verticalAlignment ?? defaultVerticalAlignment) {
        case TableCellVerticalAlignment.baseline:
          child.layout(new BoxConstraints.tightFor(width: widths[x]), parentUsesSize: true);
          final double childBaseline = child.getDistanceToBaseline(textBaseline, onlyReal: true);
          if (childBaseline != null) {
            beforeBaselineDistance = math.max(beforeBaselineDistance, childBaseline);
            afterBaselineDistance = math.max(afterBaselineDistance, child.size.height - childBaseline);
            baselines[x] = childBaseline;
            haveBaseline = true;
          } else {
            rowHeight = math.max(rowHeight, child.size.height);
            childParentData.offset = new Offset(positions[x], rowTop);
          }
          break;
        case TableCellVerticalAlignment.top:
        case TableCellVerticalAlignment.middle:
        case TableCellVerticalAlignment.bottom:
          child.layout(new BoxConstraints.tightFor(width: widths[x]), parentUsesSize: true);
          rowHeight = math.max(rowHeight, child.size.height);
          break;
        case TableCellVerticalAlignment.fill:
          break;
      }
    }
  }
```

第四步，如果有baseline则进行相关设置。

```dart
if (haveBaseline) {
  if (y == 0)
    _baselineDistance = beforeBaselineDistance;
    rowHeight = math.max(rowHeight, beforeBaselineDistance + afterBaselineDistance);
}
```

第五步，根据alignment，调整child的位置。

```dart
  for (int x = 0; x < columns; x += 1) {
    final int xy = x + y * columns;
    final RenderBox child = _children[xy];
    if (child != null) {
      final TableCellParentData childParentData = child.parentData;
      switch (childParentData.verticalAlignment ?? defaultVerticalAlignment) {
        case TableCellVerticalAlignment.baseline:
          if (baselines[x] != null)
            childParentData.offset = new Offset(positions[x], rowTop + beforeBaselineDistance - baselines[x]);
          break;
        case TableCellVerticalAlignment.top:
          childParentData.offset = new Offset(positions[x], rowTop);
          break;
        case TableCellVerticalAlignment.middle:
          childParentData.offset = new Offset(positions[x], rowTop + (rowHeight - child.size.height) / 2.0);
          break;
        case TableCellVerticalAlignment.bottom:
          childParentData.offset = new Offset(positions[x], rowTop + rowHeight - child.size.height);
          break;
        case TableCellVerticalAlignment.fill:
          child.layout(new BoxConstraints.tightFor(width: widths[x], height: rowHeight));
          childParentData.offset = new Offset(positions[x], rowTop);
          break;
      }
    }
  }
```

最后一步，则是根据每一行的宽度以及每一列的高度，设置Table的尺寸。

```dart
size = constraints.constrain(new Size(tableWidth, rowTop));
```

最后梳理一下整个的布局流程：

* 当行或者列为0的时候，将自身尺寸设为0x0；
* 根据textDirection进行相关设置；
* 设置cell的尺寸；
* 如果设置了baseline，则进行相关设置；
* 根据alignment设置cell垂直方向的位置；
* 设置Table的尺寸。

如果经常关注系列文章的读者，可能会发现，布局控件的布局流程基本上跟上述流程是相似的。

## 使用场景

在一些需要表格展示的场景中，可以使用Table控件。