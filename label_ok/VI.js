var _variable = 'Total AIDS-related deaths (year)';
var _year = '2007';
var maxValue = -100000, minValue = 100000;
var valueHash = {};
var updatevalue;
var updateBars;
var clickado = "false" ;
var dispatch = d3.dispatch("CountryEnter");
var selectedCountry;

d3.csv("aidsdata_2.csv", function (data) {
    genmap(data);
    genBar(data);
});

function changeYear(year){
  _year = year;
  updatevalue();
  updateBars();
  //colormap(d);
  //genmap(_variable,_year);
  //genBar(_variable,_year);
}

function changeVariable(variavel){
  _variable = variavel;
  updatevalue();
  updateBars();
      //genmap(_variable,_year);
      //genBar(_variable,_year);
}




function genmap(data){

  var config = {"color0":"#99ccff","color1":"#0050A1",
              "width":700,"height":500}
  
  var width = config.width,
      height = config.height;
  
  var COLOR_COUNTS = 9;
  
  function Interpolate(start, end, steps, count) {
      var s = start,
          e = end,
          final = s + (((e - s) / steps) * count);
      return Math.floor(final);
  }
  
  function Color(_r, _g, _b) {
      var r, g, b;
      var setColors = function(_r, _g, _b) {
          r = _r;
          g = _g;
          b = _b;
      };
  
      setColors(_r, _g, _b);
      this.getColors = function() {
          var colors = {
              r: r,
              g: g,
              b: b
          };
          return colors;
      };
  }
  
  function hexToRgb(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
      } : null;
  }
  
  function valueFormat(d) {
    if (d > 1000000000) {
      return Math.round(d / 1000000000 * 10) / 10 + "B";
    } else if (d > 1000000) {
      return Math.round(d / 1000000 * 10) / 10 + "M";
    } else if (d > 1000) {
      return Math.round(d / 1000 * 10) / 10 + "K";
    } else {
      return d;
    }
  }
  
  var COLOR_FIRST = config.color0, COLOR_LAST = config.color1;
  
  var rgb = hexToRgb(COLOR_FIRST);
  
  var COLOR_START = new Color(rgb.r, rgb.g, rgb.b);
  
  rgb = hexToRgb(COLOR_LAST);
  var COLOR_END = new Color(rgb.r, rgb.g, rgb.b);
  
  var startColors = COLOR_START.getColors(),
      endColors = COLOR_END.getColors();
  
  var colors = [];
  
  for (var i = 0; i < COLOR_COUNTS; i++) {
    var r = Interpolate(startColors.r, endColors.r, COLOR_COUNTS, i);
    var g = Interpolate(startColors.g, endColors.g, COLOR_COUNTS, i);
    var b = Interpolate(startColors.b, endColors.b, COLOR_COUNTS, i);
    colors.push(new Color(r, g, b));
  }

  
  valueHash = {};
    
    data.forEach(function(d) {
      d.Date = +d.Date;
      d.Value = +d.Value;
      if (d.Date == _year && d.variable == _variable){
        valueHash[d.location] = +d.Value;
        if (+d.Value > maxValue){maxValue = +d.Value;}
        if (+d.Value < minValue){minValue = +d.Value;}
      }
    })  
  
  var projection = d3.geo.mercator()
      .scale((width + 1) / 2 / Math.PI)
      .translate([width / 2, height / 2])
      .precision(.1);
  
  var path = d3.geo.path()
      .projection(projection);
  
  var graticule = d3.geo.graticule();
   
  //d3.select("svg").remove();
  var svg = d3.select("#canvas-svg").append("svg")
      .attr("width", width)
      .attr("height", height);
  
  svg.append("path")
      .datum(graticule)
      .attr("class", "graticule")
      .attr("d", path);
  

  function log10(val) {
    return Math.log(val);
  }
  
  var quantize = d3.scale.quantize()
      .domain([0, 1.0])
      .range(d3.range(COLOR_COUNTS).map(function(i) { return i }));
  
  quantize.domain([minValue,maxValue]);
  //console.log(d3.min(data, function(d){ return d.Value}));
  console.log("quantize:"+quantize.domain());
  //console.log(d3.max(data, function(d){ return d.Value}));
  console.log(maxValue);

  d3.json("world-topo-min.json", function(error, world) {
    var countries = topojson.feature(world, world.objects.countries).features;
  
    svg.append("path")
       .datum(graticule)
       .attr("class", "choropleth")
       .attr("d", path);
  
    var g = svg.append("g");
  
    g.append("path")
     .datum({type: "LineString", coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]]})
     .attr("class", "equator")
     .attr("d", path);
  
    var country = g.selectAll(".country").data(countries);
  
function colormap(d){
 // console.log(d);

  if (valueHash[d.properties.name]) {
            var c = quantize((valueHash[d.properties.name]));
            var color = colors[c].getColors();
            return "rgb(" + color.r + "," + color.g +
                "," + color.b + ")";
          } else {
            return "#ccc";
          }
}

updatevalue = function(){
    console.log("entrei")
    valueHash = {};
    maxValue = -100000, minValue = 100000;
    
    data.forEach(function(d) {

      d.Date = +d.Date;
      d.Value = +d.Value;
      if (d.Date == _year && d.variable == _variable){
        valueHash[d.location] = +d.Value;
        //console.log(d.Value)
        if (+d.Value > maxValue){maxValue = +d.Value; console.log("maxValue:"+maxValue)}
        if (+d.Value < minValue){minValue = +d.Value; console.log("minValue:"+minValue)}
      }})
      console.log("updatevalue");
      console.log(_year);
      console.log(minValue);
      console.log(maxValue);
      quantize.domain([minValue,maxValue])
      console.log("quantize_2:"+quantize.domain())
      svg.selectAll("path[class=country]").attr("fill", colormap);
}

    country.enter().insert("path")
        .attr("class", "country")
        .attr("d", path)
        .attr("id", function(d,i) { return d.id; })
        .attr("title", function(d) { return d.properties.name; })
        .attr("fill", colormap)

        .on("mousemove", function(d) {
            var html = "";
  
            html += "<div class=\"tooltip_kv\">";
            html += "<span class=\"tooltip_key\">";
            html += d.properties.name;
            html += "</span>";
            html += "<span class=\"tooltip_value\">";
            html += (valueHash[d.properties.name] ? valueFormat(valueHash[d.properties.name]) : "");
            html += "";
            html += "</span>";
            html += "</div>";
            
            $("#tooltip-container").html(html);
            $(this).attr("fill-opacity", "0.8");
            $("#tooltip-container").show();
            
            var coordinates = d3.mouse(this);
            
            var map_width = $('.choropleth')[0].getBoundingClientRect().width;
            
            if (d3.event.pageX < map_width / 2) {
              d3.select("#tooltip-container")
                .style("top", (d3.event.layerY + 15) + "px")
                .style("left", (d3.event.layerX + 15) + "px");
            } else {
              var tooltip_width = $("#tooltip-container").width();
              d3.select("#tooltip-container")
                .style("top", (d3.event.layerY + 15) + "px")
                .style("left", d3.event.layerX + "px");
            }
        })
        .on("mouseout", function() {
                $(this).attr("fill-opacity", "1.0");
                $("#tooltip-container").hide();
            })

        .on("click", function(d) {
          if(clickado == "true"){
            clickado = "false";
            svg.select("path[id=\'" + d.id+ "\']")
            .transition()
            .duration(100)
            .attr("fill", colormap);
          }
          else{
            clickado = "true";
            svg.select("path[id=\'" + d.id+ "\']")
          .transition()
          .duration(100)
          .attr("fill", "#ff0000");
          }
        })
/*
        dispatch.call("CountryEnter",d,d);});

        dispatch.on("CountryEnter.map", function(country){
          if (selectedCountry != null){
            selectedCountry.attr("fill", colormap);
          }
          selectedCountry = d3.select("path[title=\'" + d.properties.name+ "\'");
          selectedCountry.attr("fill", "#ff0000");
        })
*/
         
    
    g.append("path")
        .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
        .attr("class", "boundary")
        .attr("d", path);
    
    svg.attr("height", config.height * 2.2 / 3);
  });
  
  d3.select(self.frameElement).style("height", (height * 2.3 / 3) + "px");

}

function showVal(newVal){
  document.getElementById("valBox").innerHTML=newVal;
}

function genBar(data){

      //d3.select("svg").remove();
      var datasetTotal = [];

        data.forEach(function(d) {
          d.Date = +d.Date;
          d.Value = +d.Value;
          if (d.Date == _year && d.variable == _variable){
            valueHash[d.location] = +d.Value;
          }
        });

      for (var location in valueHash)
          datasetTotal.push({label:location, value:+valueHash[location]})

      datasetTotal.sort(function(a, b) {
          return a.value < b.value
      });

      var i = 0;
      var nrpaises = 10;
      var datasetSort = [];

      for (i=0; i<= nrpaises; i++){
          datasetSort[i]=datasetTotal[nrpaises-i];
          //console.log(datasetSort[i]);
      }

    updateBars = function(){
      console.log(_variable)
        console.log("entrei")
        valueHash = {};
        datasetSort = {};
        datasetTotal=[];
        data.forEach(function(d) {
          d.Date = +d.Date;
          d.Value = +d.Value;
          if (d.Date == _year && d.variable == _variable){
            valueHash[d.location] = +d.Value;
          }
        });
       for (var location in valueHash)
         datasetTotal.push({label:location, value:+valueHash[location]})

        datasetTotal.sort(function(a, b) {
          return a.value < b.value
      })
        console.log(datasetSort)
        var i = 0;
        var nrpaises = 10;
        var datasetSort = [];

        for (i=0; i<= nrpaises; i++){
            datasetSort[i]=datasetTotal[nrpaises-i];
            //console.log(datasetSort[i]);
        }
        console.log(datasetSort);
        change(datasetSort);
      }

          var margin = {top: (parseInt(d3.select('#top_1').style('height'), 10)/20), right: (parseInt(d3.select('#top_1').style('width'), 10)/20), bottom: (parseInt(d3.select('#top_1').style('height'), 10)/20), left: (parseInt(d3.select('#top_1').style('width'), 10)/5)},
                  width = parseInt(d3.select('#top_1').style('width'), 10) - margin.left - margin.right,
                  height = parseInt(d3.select('#top_1').style('height'), 10) - margin.top - margin.bottom;

          var div = d3.select("#top_1").append("div").attr("class", "toolTip");

          var formatPercent = d3.format("");

          var y = d3.scale.ordinal()
                  .rangeRoundBands([height, 0], .2, 0.5);

          var x = d3.scale.linear()
                  .range([0, width]);

          var xAxis = d3.svg.axis()
                  .scale(x)
                  .tickSize(-height)
                  .orient("bottom");

          var yAxis = d3.svg.axis()
                  .scale(y)
                  .orient("left");
          //.tickFormat(formatPercent);

          var svg = d3.select("#top_1").append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          svg.append("g")
                  .attr("class", "x axis")
                  .attr("transform", "translate(0," + height + ")")
                  .call(xAxis);

          d3.select("input[value=\"total\"]").property("checked", true);
          change(datasetSort);

          function change(dataset) {

              y.domain(dataset.map(function(d) { return d.label; }));
              x.domain([0, d3.max(dataset, function(d) { return d.value; })]);

              svg.append("g")
                      .attr("class", "x axis")
                      .attr("transform", "translate(0," + height + ")")
                      .call(xAxis);

              svg.select(".y.axis").remove();
              svg.select(".x.axis").remove();

              svg.append("g")
                      .attr("class", "y axis")
                      .call(yAxis)
                      .append("text")
                      .attr("transform", "rotate(0)")
                      .attr("x", 55)
                      .attr("dx", ".1em")
                      .style("text-anchor", "end")
                      .attr("y", -6)
                      .attr("dy", ".1em")
                      .text(_variable);


              var bar = svg.selectAll(".bar")
                      .data(dataset, function(d) { return d.label; });
              // new data:
              bar.enter().append("rect")
                      .attr("class", "bar")
                      .attr("x", function(d) { return x(d.value); })
                      .attr("y", function(d) { return y(d.label); })
                      .attr("width", function(d) { return width-x(d.value); })
                      .attr("height", y.rangeBand())
                      
              bar
                      .on("mousemove", function(d){
                          div.style("left", d3.event.pageX-750+"px");
                          //console.log("isto aqui");
                          //console.log(d3.event.pageX);
                          div.style("top", d3.event.pageY-100+"px");
                          //console.log(d3.event.pageY);
                          div.style("display", "inline-block");
                          div.html((d.label)+"<br>"+(d.value));
                      });
              bar
                      .on("mouseout", function(d){
                          div.style("display", "none");
                      });

              bar
                      .on("click",  function(d) {
                        console.log("devo pintar vemelho")
                          if(clickado == "true"){
                            clickado = "false";
                            bar.style("fill", "steelblue");
                          }
                          else{
                            clickado = "true";
                            bar.style("fill", "#ff0000");
                          }
                        })

              // removed data:
              bar.exit().remove();

              // updated data:
              bar.transition()
                      .duration(1000)
                      .attr("x", function(d) { return 0; })
                      .attr("y", function(d) { return y(d.label); })
                      .attr("width", function(d) { return x(d.value); })
                      .attr("height", y.rangeBand());
          };

}
