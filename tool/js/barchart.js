



function drawBarChart(data){
    // console.log(data)
      var margin = {top: 10, right: 80, bottom: 0, left: 80},
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

      var svg = d3.select("#barChart").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var x = d3.scaleLinear()
          .range([0,width]);

      var y = d3.scaleBand()
          .rangeRound([height,0])
          .padding(0.2);


    data.sort(function(a,b){
      return a.diff_data_city - b.diff_data_city;
    });

    x.domain(d3.extent(data, function(d){ return d.diff_data_city; }));
    y.domain(data.map(function(d) { return d.census_var; }));

    svg.selectAll(".lollipop")
        .data(data)
      .enter().append("line")
        .attr("class", function(d){
            return "lollipop " + barCategories[d.census_var]["class"]
        })
        .attr("x1", function(d){ return d.diff_data_city < 0 ? x(d.diff_data_city) : x(0); })
        .attr("x2", function(d){ return d.diff_data_city < 0 ? x(0) : x(d.diff_data_city)  })
        .attr("y1", function(d){ return y(d.census_var) + y.bandwidth()*.5; })
        .attr("y2", function(d){ return y(d.census_var) + y.bandwidth()*.5; })

    svg.selectAll(".barDot")
        .data(data)
      .enter().append("circle")
        .attr("class", function(d){
            return "barDot " + barCategories[d.census_var]["class"]
        })
        .attr("cx", function(d){ return x(d.diff_data_city); })
        .attr("cy", function(d){ return y(d.census_var) + y.bandwidth()*.5; })
        .attr("r", BAR_DOT_RADIUS)

    svg.selectAll(".census_var")
            .data(data)
        .enter().append("text")
            .attr("class", "bar_full_name")
            .attr("x", function(d){ return d.diff_data_city < 0 ? x(0) + 2.55 : x(0) - 2.55 })
            .attr("y", function(d){ return y(d.census_var); })
            .attr("dy", y.bandwidth() - 2.55)
            .attr("text-anchor", function(d){ return d.diff_data_city < 0 ? "start" : "end"; })
            .html(function(d){ return barCategories[d.census_var]["full_name"]; });

    svg.append("line")
            .attr("x1", x(0))
            .attr("x2", x(0))
            .attr("y1", 0 + margin.top)
            .attr("y2", height - margin.top)
            .attr("stroke", "#3a403d")
            .attr("stroke-width", "1px");


      function types(d){
                d.diff_data_city = +d.diff_data_city;
                return d;
      }

}