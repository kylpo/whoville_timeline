var data = d3.range(100).map(function(i) {
  return {x: i / 99, y: Math.random()};
});

var w = 450,
    h = 450,
    p = 20,
    x = d3.scale.linear().range([0, w]),
    y = d3.scale.linear().range([h, 0]),
    symbol = d3.scale.ordinal().range(d3.svg.symbolTypes),
    color = d3.scale.category10();

var vis = d3.select("body")
  .append("svg")
    .attr("width", w + p * 2)
    .attr("height", h + p * 2)
  .append("g")
    .attr("transform", "translate(" + p + "," + p + ")");

var xrule = vis.selectAll("g.x")
    .data(x.ticks(10))
  .enter().append("g")
    .attr("class", "x");

xrule.append("line")
    .attr("x1", x)
    .attr("x2", x)
    .attr("y1", 0)
    .attr("y2", h);

xrule.append("text")
    .attr("x", x)
    .attr("y", h + 3)
    .attr("dy", ".71em")
    .attr("text-anchor", "middle")
    .text(x.tickFormat(10));

var yrule = vis.selectAll("g.y")
    .data(y.ticks(10))
  .enter().append("g")
    .attr("class", "y");

yrule.append("line")
    .attr("x1", 0)
    .attr("x2", w)
    .attr("y1", y)
    .attr("y2", y);

yrule.append("text")
    .attr("x", -3)
    .attr("y", y)
    .attr("dy", ".35em")
    .attr("text-anchor", "end")
    .text(y.tickFormat(10));

vis.append("rect")
    .attr("width", w)
    .attr("height", h);

vis.selectAll("path.dot")
    .data(data)
  .enter().append("path")
    .attr("class", "dot")
    .attr("stroke", function(d, i) { return color(i); })
    .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; })
    .attr("d", d3.svg.symbol()
    .type(function(d, i) { return symbol(i); }));
