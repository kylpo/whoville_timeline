App.Views.Graph = Backbone.View.extend({
  el: '#graph',

  initialize: function(id) {
    _.bindAll(this, 'render', 'drawGraph', 'computeData');

    this.userId = id;
    this.collection = new App.Collections.Profiles();

    //render is callback for when fetch returns results
    this.collection.bind("reset", this.render, this);
    this.collection.fetch();
  },

  render: function() {
    // draw graph with reversed data so Date will be descending
    this.drawGraph( this.computeData().reverse() );
  },

  computeData: function() {
    var dataCollection = [];
    var userId = this.userId.toString();

    // create hashmap of profiles per 'month.day'
    this.collection.each(function (item) {
      var fullDate = new Date(item.attributes.date);
      var date = fullDate.getMonth().toString() + "." + fullDate.getDate().toString();

      var lastRow = (dataCollection.length > 0) ?
        dataCollection[dataCollection.length - 1] :
        null;

      // since the collection is sequential, check the last row of
      // dataCollection for a matching date
      if (lastRow && lastRow.date === date) {
        lastRow.averageCount.push(item.attrCount());

        // check if item matches with userId, if so add this to data
        if (item.attributes.id === userId ) {
          lastRow.singleCount = item.attrCount();
          lastRow.singleProfile = item.attributes;
        }

        // break out of this.collection.each loop
        return;

      } else {

        // not found, so fill new dataRow and add it to collection
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
      }
    });

    // average the counts for each row entry
    // and add totalUsers attribute
    _.each(dataCollection, function(row) {
      var sum = _.reduce(row.averageCount, function(memo, num){ return memo + num; }, 0);
      row.userCount = row.averageCount.length;
      var total = sum / row.userCount;

      row.averageCount = Math.round( total * 100 ) / 100;
    });

    return dataCollection;
  },

  // many thanks to http://www.jasondavies.com/d3-pyramid/
  drawGraph: function(data) {

    /* edit these settings freely */
    var w = 600,

      // this will set bar height to 20, and total height to length * 20
      h = (data.length * 20),

      topMargin = 15,
      labelSpace = 40,
      innerMargin = w/2+labelSpace,
      outerMargin = 15,
      gap = 2,
      dataRange = d3.max(data.map(function(d) { return Math.max(d.singleCount, d.averageCount); })),
      leftLabel = "Your Profile Attribute Count",
      rightLabel = "Average Profile Attribute Count";

    /* edit with care */
    var chartWidth = w - innerMargin - outerMargin,
      barWidth = (h - topMargin) / data.length,
      yScale = d3.scale.linear().domain([0, data.length]).range([0, h - topMargin]),
      total = d3.scale.linear().domain([0, dataRange]).range([0, chartWidth - labelSpace]),
      commas = d3.format(',0f');

    /* main panel */
    var vis = d3.select('#graph').append('svg:svg')
      .attr('width', w)
      .attr('height', h);

    /* singleCount label */
    vis.append('svg:text')
      .attr('class', 'label')
      .text(leftLabel)
      .attr('x', w-innerMargin)
      .attr('y', topMargin-3)
      .attr('text-anchor', 'end');

    /* averageCount label */
    vis.append('svg:text')
      .attr('class', 'label')
      .text(rightLabel)
      .attr('x', innerMargin)
      .attr('y', topMargin-3);

    /* user's profile bars and data labels */
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
        .text(function(d) { return d.userCount; });

    // d3.select('#generate').on('click', function() {
      // for (var i=0; i<data.length; i++) {
        // data[i].barData1 = Math.random() * dataRange;
        // data[i].averageCount = Math.random() * dataRange;
      // }
      // refresh(data);
    // });

    var refresh = function(data) {
      var bars = d3.selectAll('g.bar')
        .data(data);
      bars.selectAll('rect.malebar')
        .transition()
          .attr('width', function(d) { return total(d.averageCount); });
      bars.selectAll('rect.femalebar')
        .transition()
          .attr('x', function(d) { return innerMargin - total(d.singleCount) - 2 * labelSpace; })
          .attr('width', function(d) { return total(d.singleCount); });

      bars.selectAll('text.malebar')
          .text(function(d) { return commas(d.averageCount); })
        .transition()
          .attr('x', function(d) { return innerMargin + total(d.averageCount); });
      bars.selectAll('text.femalebar')
          .text(function(d) { return commas(d.singleCount); })
        .transition()
          .attr('x', function(d) { return innerMargin - total(d.singleCount) - 2 * labelSpace; });
    };

    refresh(data);
  }
});
