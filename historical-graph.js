
var hist={};

hist.width=960-margin.left-margin.right;
hist.height=200-margin.top-margin.bottom;

hist.startOfToday=getStartOfDay(new Date())
hist.uriDateFormat=d3.time.format("%Y-%m-%d %H:%M:%S");
hist.startDate=d3.time.day.offset(hist.startOfToday,-15);
hist.endDate=d3.time.day.offset(hist.startOfToday,+1);

hist.encodedDates="&"+encodeStartAndEndDates(hist.startDate,hist.endDate);

hist.svg=d3.select("#historical-graph").append("svg")
  .attr("width",hist.width+margin.left+margin.right)
  .attr("height",hist.height+margin.top+margin.bottom)
  .append("g")
  .attr("transform","translate("+margin.left+","+margin.top+")");

hist.baseURL="https://api.thingspeak.com/channels/23684/feed.json?key=UZNQFPQFAG9A58ZG&",
  hist.historySumURL=hist.baseURL+"sum=daily"+hist.encodedDates,
  hist.historyAverageURL=hist.baseURL+"average=daily"+hist.encodedDates;

console.log(hist.historySumURL);

hist.x=d3.time.scale()
  .range([0,hist.width])
  .domain([hist.startDate,hist.endDate]);

hist.y=d3.scale.linear()
  .range([hist.height,0]);

hist.xaxis=d3.svg.axis()
  .scale(hist.x)
  .orient("bottom");

hist.yaxis=d3.svg.axis()
  .scale(hist.y)
  .orient("left");

d3.json(hist.historySumURL, function(error, jsondata) {
  var data=jsondata.feeds;

  hist.y.domain([0,d3.max(data,function(d) {return d.field3})]);

  hist.svg.append("g")
    .attr("class","x axis")
    .attr("transform","translate(0,"+hist.height+")")
    .call(hist.xaxis);

  hist.svg.append("g")
    .attr("class","y axis")
    .call(hist.yaxis);

    console.log(data);

  hist.svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class","bar")
    .attr("x",function(d) {
      console.log(d.created_at);
      return hist.x(parseDate(d.created_at)-50);
    })
    .attr("y",function(d) {
      return hist.y(d.field3);
    })
    .attr("width",50)
    .attr("height",function(d) {
      return hist.height-hist.y(d.field3);
    })
    .on("click",function(d) {
      var d=parseDate(d.created_at);
      console.log(d);
      refresh("foo",d,d3.time.day.offset(d,1));
      d3.select(hist.styled).style("fill","#FF3300");
      d3.select(this).style("fill","green");
      hist.styled=this;
    });

});

