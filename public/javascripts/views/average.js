App.Views.Graph = Backbone.View.extend({
  el: '#graph',

  initialize: function() {
    _.bindAll(this, 'render', 'drawGraph', 'computeData');
    // this.computeData(); // for graph
    this.drawGraph( this.computeData() );
    // this.drawGraph();
    // this.render();
  },

  render: function() {
    this.drawGraph();
    // debugger;
    $(this.el).html('<p>hello world</p>');
    // $(this.el).html(JST.tasks_collection({ collection: this.collection }));
    // $('#app').html(this.el);

    // this.collection.each( this.render_task );
  },

  computeData: function() {
    var data = [];

    //count attributes for profile and append to data array
    this.collection.each( function (item) {
      var count = 0;

      for (var prop in item.attributes) {

        // ommit non-profile attributes
        if ( prop !== '_id' && prop !== 'id' && prop !== 'date' ){
          count++;
        }
      }

      data.push( count );
    });
    return data;
  },

  drawGraph: function( data ) {

    var chart = d3.select(this.el).append("svg")
    .attr("class", "chart")
    .attr("width", 420)
    .attr("height", 20 * data.length);

    var x = d3.scale.linear()
    .domain([0, d3.max(data)])
    .range([0, 420]);

    chart.selectAll("rect")
    .data(data)
    .enter().append("rect")
    .attr("y", function(d, i) { return i * 20; })
    .attr("width", x)
    .attr("height", 20);


    // debugger;
    // d3.selectAll("body")
         // .data([4, 8, 15, 16, 23, 42])
         // .style("font-size", function(d) { return d + "px"; });
    // d3.select("body").selectAll("p")
         // .data([4, 8, 15, 16, 23, 42])
       // .enter().append("p")
         // .text(function(d) { return "I'm number " + d + "!"; });

    // this.collection.each(function(item) {
      // debugger;
    // });
    // var data = d3.range(100).map(function(i) {
      // return {x: i / 99, y: Math.random()};
    // });

    // var w = 450,
    // h = 450,
    // p = 20,
    // x = d3.scale.linear().range([0, w]),
    // y = d3.scale.linear().range([h, 0]),
    // symbol = d3.scale.ordinal().range(d3.svg.symbolTypes),
    // color = d3.scale.category10();

    // var vis = d3.select("#graph")
    // .append("svg")
    // .attr("width", w + p * 2)
    // .attr("height", h + p * 2)
    // .append("g")
    // .attr("transform", "translate(" + p + "," + p + ")");

    // vis.append("circle") .attr("cx", 50) .attr("cy", 40) .attr("r", 10);

    // d3.select("body").transition().style("background-color", "black");

    // d3.selectAll("circle").transition().duration(750).delay(function(d, i) { return i * 10; }).attr("r", function(d) { return Math.sqrt(d); });

    // var xrule = vis.selectAll("g.x")
    // .data(x.ticks(10))
    // .enter().append("g")
    // .attr("class", "x");

    // xrule.append("line")
    // .attr("x1", x)
    // .attr("x2", x)
    // .attr("y1", 0)
    // .attr("y2", h);

    // xrule.append("text")
    // .attr("x", x)
    // .attr("y", h + 3)
    // .attr("dy", ".71em")
    // .attr("text-anchor", "middle")
    // .text(x.tickFormat(10));

    // var yrule = vis.selectAll("g.y")
    // .data(y.ticks(10))
    // .enter().append("g")
    // .attr("class", "y");

    // yrule.append("line")
    // .attr("x1", 0)
    // .attr("x2", w)
    // .attr("y1", y)
    // .attr("y2", y);

    // yrule.append("text")
    // .attr("x", -3)
    // .attr("y", y)
    // .attr("dy", ".35em")
    // .attr("text-anchor", "end")
    // .text(y.tickFormat(10));

    // vis.append("rect")
    // .attr("width", w)
    // .attr("height", h);

    // vis.selectAll("path.dot")
    // .data(data)
    // .enter().append("path")
    // .attr("class", "dot")
    // .attr("stroke", function(d, i) { return color(i); })
    // .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; })
    // .attr("d", d3.svg.symbol()
          // .type(function(d, i) { return symbol(i); }));
  }

});
