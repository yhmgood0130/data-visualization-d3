const d3 = Object.assign({},
  require('d3-scale'),
  require('d3-axis'),
  require('d3-array'),
  require('d3-svg-legend'),
  require('d3-shape')
);

class PieChart {
  constructor({ data, width, height, containerId }) {
    this.data = data.data;
    this.width = width;
    this.height = height;
    this.containerId = containerId;

    this.axisLabelMargin = 10;
    this.margin = {
      top: 180,
      right: 100,
      bottom: 50,
      left: 300
    };
  }

  render(container) {
    const {
      data,
      width,
      height,
      margin
    } = this;

    // Selecting SVG using d3.select() 
    var svg = container.append("svg")
        .attr('class', 'svg-chart')
        .attr('width', width + 150)
        .attr('height', height);

    data.map((vehicle) => {
      if(!vehicle.VehicleType) {
        vehicle.VehicleType = 'N/A';
      }
      
      return vehicle;
    });
  
    let g = svg.append("g") 
           .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')'); 
      
    // Creating Pie generator 
    var pie = d3.pie()
              .sort(null)
              .value(d => d.total);

    // Creating arc 
    var arc = d3.arc() 
                .innerRadius(0) 
                .outerRadius(120);                 

    // Grouping different arcs 
    var arcs = g.selectAll("arc")  
                .data(pie(data)) 
                .enter() 
                .append("g"); 

    var Set3 = colors("8dd3c7ffffb3bebadafb807280b1d3fdb462b3de69fccde5d9d9d9bc80bdccebc5ffed6f");

    // Appending path  
    arcs.append("path")
        .attr("fill", (data, i)=>{
            return Set3[i]; 
        })
        .attr("d", arc);

    arcs.append("text")
        .attr("transform", function(d) {
          var _d = arc.centroid(d);
          _d[0] *= 2.2;	//multiply by a constant factor
          _d[1] *= 2.2;	//multiply by a constant factor
          return "translate(" + _d + ")";
        })
        .attr("dx", "-0.50em")
        .attr("dy", "0.50em")
        .style("text-anchor", "right")
        .text((d) => d.data.VehicleType );

    let sum = data.reduce((acc,num) => { return acc + (+num.total)}, 0);

    arcs.append("text")
    	.attr("transform", function(d) {
        var _d = arc.centroid(d);
        _d[0] *= 1.7;	//multiply by a constant factor
        _d[1] *= 1.7;	//multiply by a constant factor
        return "translate(" + _d + ")";
      })
      .attr("dy", ".50em")
      .style("text-anchor", "middle")
      .text(function(d) {        
        return parseFloat(d.data.total / sum).toFixed(2) * 100  + '%';
      });

    var legendHolder = svg.append('g')
      // translate the holder to the right side of the graph
      .attr('transform', "translate(" + (-width + 150) + "," + (-300) + ")")
      .attr('class','legendHolder')

    var legend = legendHolder.selectAll(".legend")
                    .data(data)
                    .enter().append("g")
                    .attr('transform', "translate(" + (margin.left + width) + ",400)")
                    .attr("width", 36);

    legend.selectAll("mydots")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", 100)
        .attr("cy", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .style("fill", (data, i)=>{ 
            return Set3[i]; 
        });

    legend.selectAll(".legend")
        .data(data)
        .enter()
        .append("text")
        .attr("x", 120)
        .attr("y", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d){"red"})
        .text(function(d){ return d.VehicleType})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");
    }
}

function colors(specifier) {
  var n = specifier.length / 6 | 0, colors = new Array(n), i = 0;
  while (i < n) colors[i] = "#" + specifier.slice(i * 6, ++i * 6);
  return colors;
}

module.exports = PieChart;
