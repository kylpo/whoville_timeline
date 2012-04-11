App.Views.Single = Backbone.View.extend({
  el: '#graph',

  initialize: function(id) {
    _.bindAll(this, 'render', 'drawGraph', 'computeData', 'constructAverageProfile');

    this.userId = id;
    this.collection = new App.Collections.Profiles();

    //render is callback for when fetch returns results
    this.collection.bind("reset", this.render, this);
    this.collection.fetch();
  },

  render: function() {
    var data = this.constructAverageProfile();
    // debugger;
    // this.drawGraph( this.computeData() );

    // $(this.el).html('<p>hello world</p>');
    // $(this.el).html(JST.tasks_collection({ collection: this.collection }));
    // $('#app').html(this.el);

    // this.collection.each( this.render_task );
  },

  constructAverageProfile: function() {
    var dataCollection = [];
    var userId = this.userId.toString();

    // create hashmap of profiles per 'month.day'
    this.collection.each(function (item) {

      var fullDate = new Date(item.attributes.date);
      var date = fullDate.getMonth().toString() + "." + fullDate.getDate().toString();

      var foundInCollection = false;

      // loop over all rows in collection for matching date
      // using reverse b/c it is likely at the end b/c it is sequential
      _.each(dataCollection.reverse(), function(row) {
        if (row.date === date) {
          row.averageCount.push(item.attrCount());
          foundInCollection = true;

          // check if item matches with userId, if so add this to data
          if (item.attributes.id === userId ) {
            row.singleCount = item.attrCount();
            row.singleProfile = item.attributes;
          }
        }
        // break out of this .each loop
        return;
      });

      // break out of this .each loop
      if (foundInCollection) { return; }

      // if not found, fill new dataRow and add it to collection
      var dataRow = {
        singleCount: 0,
        singleProfile: {},
        date: date,
        averageCount: [item.attrCount()]
      };

      // check if item matches with userId, if so add this to data
      if (item.attributes.id === userId ) {
        dataRow.singleCount = item.attrCount();
        dataRow.singleProfile = item.attributes;
      }

      dataCollection.push(dataRow);
    });

    // average the counts for each row entry
    // and add totalUsers attribute
    _.each(dataCollection, function(row) {
      var sum = _.reduce(row.averageCount, function(memo, num){ return memo + num; }, 0);
      row.userCount = row.averageCount.length;
      var total = sum / row.userCount;

      row.averageCount = Math.round( total * 100 ) / 100;
    });

    debugger;
    return dataCollection;
  },

  computeData: function() {
    var data = [];

    //count attributes for profile and append to data array
    this.collection.each( function (item) {

      // var count = 0;

      // for (var prop in item.attributes) {

        // // ommit non-profile attributes
        // if ( prop !== '_id' && prop !== 'id' && prop !== 'date' ){
          // count++;
        // }
      // }

      data.push( item.attrCount() );
    });
    return data;
  },

  drawGraph: function(data) {
    /* edit/input your data */
    var data = [
      {"sharedLabel": "Category 1", "barData1": 41, "barData2": 42},
      {"sharedLabel": "Category 2", "barData1": 37, "barData2": 36},
      {"sharedLabel": "Category 3", "barData1": 48, "barData2": 47},
      {"sharedLabel": "Category 4", "barData1": 21, "barData2": 24},
      {"sharedLabel": "Category 5", "barData1": 14, "barData2": 19},
      {"sharedLabel": "Category 6", "barData1": 16, "barData2": 11},
      {"sharedLabel": "Category 7", "barData1": 29, "barData2": 25},
      {"sharedLabel": "Category 8", "barData1": 46, "barData2": 45},
      {"sharedLabel": "Category 9", "barData1": 43, "barData2": 44},
      {"sharedLabel": "Category 10", "barData1": 65, "barData2": 59},
      {"sharedLabel": "Category 11", "barData1": 16, "barData2": 68},
      {"sharedLabel": "Category 12", "barData1": 75, "barData2": 23},
      {"sharedLabel": "Category 13", "barData1": 55, "barData2": 52},
      {"sharedLabel": "Category 14", "barData1": 78, "barData2": 63},
      {"sharedLabel": "Category 15", "barData1": 28, "barData2": 99},
      {"sharedLabel": "Category 16", "barData1": 17, "barData2": 49},
      {"sharedLabel": "Category 17", "barData1": 0, "barData2": 8},
      {"sharedLabel": "Category 7", "barData1": 29, "barData2": 25},
      {"sharedLabel": "Category 8", "barData1": 46, "barData2": 45},
      {"sharedLabel": "Category 9", "barData1": 43, "barData2": 44},
      {"sharedLabel": "Category 10", "barData1": 65, "barData2": 59},
      {"sharedLabel": "Category 11", "barData1": 16, "barData2": 68},
      {"sharedLabel": "Category 12", "barData1": 75, "barData2": 23},
      {"sharedLabel": "Category 13", "barData1": 55, "barData2": 52},
      {"sharedLabel": "Category 14", "barData1": 78, "barData2": 63},
      {"sharedLabel": "Category 15", "barData1": 28, "barData2": 99},
      {"sharedLabel": "Category 16", "barData1": 17, "barData2": 49},
      {"sharedLabel": "Category 17", "barData1": 0, "barData2": 8},
      {"sharedLabel": "Category 18", "barData1": 3, "barData2": 17},
      {"sharedLabel": "Category 19", "barData1": 22, "barData2": 32},
      {"sharedLabel": "Category 18", "barData1": 3, "barData2": 17},
      {"sharedLabel": "Category 19", "barData1": 22, "barData2": 32},
      {"sharedLabel": "Category 20", "barData1": 69, "barData2": 36},
      {"sharedLabel": "Category 21", "barData1": 0, "barData2": 17},
      {"sharedLabel": "Category 22", "barData1": 3, "barData2": 13}
    ];

    /* edit these settings freely */
    var w = 600,
      h = 400,
      topMargin = 15,
      labelSpace = 40,
      innerMargin = w/2+labelSpace,
      outerMargin = 15,
      gap = 2,
      dataRange = d3.max(data.map(function(d) { return Math.max(d.barData1, d.barData2); })),
      leftLabel = "Your Profile Attribute Count",
      rightLabel = "Average Profile Attribute Count";

    /* edit with care */
    var chartWidth = w - innerMargin - outerMargin,
      barWidth = h / data.length,
      yScale = d3.scale.linear().domain([0, data.length]).range([0, h-topMargin]),
      total = d3.scale.linear().domain([0, dataRange]).range([0, chartWidth - labelSpace]),
      commas = d3.format(',.0f');

    /* main panel */
    var vis = d3.select('#graph').append('svg:svg')
      .attr('width', w)
      .attr('height', h);

    /* barData1 label */
    vis.append('svg:text')
      .attr('class', 'label')
      .text(leftLabel)
      .attr('x', w-innerMargin)
      .attr('y', topMargin-3)
      .attr('text-anchor', 'end');

    /* barData2 label */
    vis.append('svg:text')
      .attr('class', 'label')
      .text(rightLabel)
      .attr('x', innerMargin)
      .attr('y', topMargin-3);

    /* female bars and data labels */
    var bar = vis.selectAll('g.bar')
        .data(data)
      .enter().append('svg:g')
        .attr('class', 'bar')
        .attr('transform', function(d, i) {
          return 'translate(0,' + (yScale(i) + topMargin) + ')';
        });

    var wholebar = bar.append('svg:rect')
        .attr('width', w)
        .attr('height', barWidth-gap)
        .attr('fill', 'none')
        .attr('pointer-events', 'all');

    var highlight = function(c) {
      return function(d, i) {
        bar.filter(function(d, j) {
          return i === j;
        }).attr("class", c);
      };
    };

    bar
      .on('mouseover', highlight('highlight bar'))
      .on('mouseout', highlight('bar'));

    bar.append('svg:rect')
        .attr('class', 'femalebar')
        .attr('height', barWidth-gap);

    bar.append('svg:text')
        .attr('class', 'femalebar')
        .attr('dx', -3)
        .attr('dy', '1em')
        .attr('text-anchor', 'end');

    bar.append('svg:rect')
        .attr('class', 'malebar')
        .attr('height', barWidth-gap)
        .attr('x', innerMargin);

    bar.append('svg:text')
        .attr('class', 'malebar')
        .attr('dx', 3)
        .attr('dy', '1em');

    /* sharedLabels */
    bar.append('svg:text')
        .attr('class', 'shared')
        .attr('x', w/2)
        .attr('dy', '1em')
        .attr('text-anchor', 'middle')
        .text(function(d) { return d.sharedLabel });

    // d3.select('#generate').on('click', function() {
      // for (var i=0; i<data.length; i++) {
        // data[i].barData1 = Math.random() * dataRange;
        // data[i].barData2 = Math.random() * dataRange;
      // }
      // refresh(data);
    // });

    var refresh = function(data) {
      var bars = d3.selectAll('g.bar')
        .data(data);
      bars.selectAll('rect.malebar')
        .transition()
          .attr('width', function(d) { return total(d.barData1) });
      bars.selectAll('rect.femalebar')
        .transition()
          .attr('x', function(d) { return innerMargin - total(d.barData2) - 2 * labelSpace })
          .attr('width', function(d) { return total(d.barData2) });

      bars.selectAll('text.malebar')
          .text(function(d) { return commas(d.barData1) })
        .transition()
          .attr('x', function(d) { return innerMargin + total(d.barData1) });
      bars.selectAll('text.femalebar')
          .text(function(d) { return commas(d.barData2) })
        .transition()
          .attr('x', function(d) { return innerMargin - total(d.barData2) - 2 * labelSpace });
    }

    refresh(data);



    // var chart = d3.select(this.el).append("svg")
    // .attr("class", "chart")
    // .attr("width", 420)
    // .attr("height", 20 * data.length);

    // var x = d3.scale.linear()
    // .domain([0, d3.max(data)])
    // .range([0, 420]);

    // chart.selectAll("rect")
    // .data(data)
    // .enter().append("rect")
    // .attr("y", function(d, i) { return i * 20; })
    // .attr("width", x)
    // .attr("height", 20);

    // chart.selectAll("text")
    // .data(data)
    // .enter().append("text")
    // .attr("x", x)
    // .attr("y", function(d, i) { return i * 20; })
    // // .attr("y", function(d) { return y(d) + y.rangeBand() / 2; })
    // .attr("dx", -3) // padding-right
    // .attr("dy", "1em") // vertical-align: middle
    // .attr("text-anchor", "end") // text-align: right
    // .text(String);

    // // change color on click
    // chart.selectAll("rect").on("click", function(){
      // d3.select(this)
      // .style("fill","lightcoral")
      // .style("stroke","red");
      // debugger;
    // });

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
