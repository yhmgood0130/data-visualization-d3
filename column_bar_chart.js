const d3 = Object.assign({},
  require('d3-scale'),
  require('d3-axis'),
  require('d3-array'),
  require('d3-svg-legend')
);

class ColumnBarChart {
  constructor({ data, width, height, xAxisLabel, yAxisLabel, containerId }) {
    this.data = data.data;
    this.width = width;
    this.height = height;
    this.xAxisLabel = xAxisLabel;
    this.yAxisLabel = yAxisLabel;
    this.containerId = containerId;

    this.axisLabelMargin = 10;
    this.margin = {
      top: 10,
      right: 10,
      bottom: 34,
      left: 34
    };
  }

  render(container) {
    const {
      data,
      width,
      height,
      xAxisLabel,
      yAxisLabel,
      axisLabelMargin,
      margin
    } = this;

    const xScale = d3.scaleBand()
      .domain(this.data.map(({ pyStatusWork }) => pyStatusWork))
      .rangeRound([0, width - axisLabelMargin - margin.left - margin.right])
      .padding(0.25);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, ({ total }) => +total) + 10])
      .range([height - axisLabelMargin - margin.top - margin.bottom, 0]);

    const xAxis = d3.axisBottom()
      .scale(xScale)
      .tickSizeInner(0)
      .tickSizeOuter(0);

    const yAxis = d3.axisLeft()
      .ticks(20)
      .tickSizeInner(0)
      .tickSizeOuter(0)
      .scale(yScale);

    // Gridline
    var gridlines = d3.axisLeft()
      .ticks(20)
      .tickFormat("")
      .tickSize(-width+45)
      .scale(yScale);

    const g = container.append('svg')
        .attr('class', 'svg-chart')
        .attr('width', width + 150)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    g.append('rect')
      .attr('class', 'background')
      .attr('x', axisLabelMargin)
      .attr('width', width - axisLabelMargin - margin.left - margin.right)
      .attr('height', height - margin.top - margin.bottom - axisLabelMargin);

    g.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(' + axisLabelMargin + ',' +
        (height - axisLabelMargin - margin.top - margin.bottom) + ')')
      .call(xAxis)
      .append('text')
      .attr('class', 'axis-label')
      .attr('x', (width - margin.left - margin.right - axisLabelMargin) / 2)
      .attr('y', margin.left)
      .style('text-anchor', 'middle')
      .style('font-weight', 'bold')
      .text(xAxisLabel);

    g.append("g")
      .attr("class", "grid")
      .call(gridlines);

    g.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(' + axisLabelMargin + ', 0)')
      .call(yAxis)
      .append('text')
      .attr('class', 'axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left)
      .attr('x', -(height - margin.top - margin.bottom - axisLabelMargin) / 2)
      .style('text-anchor', 'middle')
      .style('font-weight', 'bold')
      .text(yAxisLabel);

    g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', function(d) {
        return xScale(d.pyStatusWork) + axisLabelMargin + 25;
      })
      .attr('y', function(d) {
        return yScale(+d.total);
      })
      .attr('width', xScale.bandwidth() - 50)
      .attr('height', function(d) {
        return height - margin.top - margin.bottom - yScale(+d.total) - axisLabelMargin;
      });

    g.select(['.axis', '.x'])
      .selectAll('.tick')
      .selectAll("text")
      .attr('y', margin.top)
      .attr('x', -margin.right)
      .text((function (d) {
          if(d.length > 8)
              return d.substring(0,8)+'...';
          else
              return d;                       
      }))
      .attr("transform", "rotate(-30)");

      var legendHolder = g.append('g')
        // translate the holder to the right side of the graph
        .attr('transform', "translate(" + (-width) + "," + (-margin.top) + ")")
        .attr('class','legendHolder')

      var legend = legendHolder.selectAll(".legend")
                      .data(["Count Case ID"])
                      .enter().append("g")
                      .attr("class", "legend")
                      .attr('transform', "translate(" + (margin.left + width - 50) + ",300)")
                      .attr("width", 36)

      legend.append("rect")
          .attr("x", function(d,i){return (width +(150*i))})
          .attr("width", 18)
          .attr("height", 18)
          //.style("text-anchor", "end") //"startOffset"="100%
          //.style("startOffset","100%") //"startOffset"="100%
          .style("fill", "#4682B4");

      legend.append("text")
          //.attr("x", width - 24)
          .attr("x", function(d,i){return (width +(150*i)+20)})
          .attr("y", 9)
          .attr("dy", ".35em")
          //.style("text-anchor", "end")
          .text(function(d) { return d; });
  }
}

module.exports = ColumnBarChart;
