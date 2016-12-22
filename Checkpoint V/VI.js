var _variable = 'Total AIDS-related deaths (year)';
var _year = '2000';
var _variable_cdp = 'Total AIDS-related deaths 2015';
var _year_cdp = '2015';
var maxValue = -100000, minValue = 100000;
var valueHash = {};
var valueHash_cdp = {};
var updatevalue;
var updateBars;
var updateBubbles;
var clickado = "false" ;
var dispatch = d3.dispatch('countryEnter');
var selectedCountry;
var newUpdate;
var newUpdateCDP;
var valueFormat;
var bar_click;
var colormap;
var _variable2 = 'Knowledge about HIV prevention in young people';
var _top = 'menos';

var myVar;


function changeTop(){
  if (_top == 'mais') {
      _top = 'menos';
    }
  else {
      _top = 'mais';
  }
  newUpdate();
}


function changeYearPlay(){

  var a = parseInt(_year);
  a= a + 1;
  if (a>2014){
    clearInterval(myVar);
  }
  else{

      changeYear('' + a);
      document.getElementById('myRange').value= a;
      document.getElementById('valBox').innerHTML = a;
    }
  }

  function mudaVar(){
    var x = document.getElementById("seleciona").value;
    if (x == 'Knowledge'){
      _variable2 = "Knowledge about HIV prevention in young people";
          document.getElementById('titulo').innerHTML = _variable2;
      btns.style.display = 'none';

    }
    if (x == 'Risk'){
      _variable2 = "Total multiple sexual partnership";
      btns.style.display = 'inline';
          document.getElementById('titulo').innerHTML = _variable2;
      }
    updateBubbles();

  }      

function changeVariable2(var1){
    _variable2 = var1 ;
    document.getElementById('titulo').innerHTML = _variable2;
    updateBubbles();
}



d3.csv("aidsdata_2.csv", function (data) {
    bottom_2.style.display = 'none';
    bottom_1.style.display = 'inline';
    btns.style.display = 'none';
    tratamento.style.display = 'inline';
          document.getElementById('top1Chart').innerHTML = _variable + " " +_year + " ";
          document.getElementById('bottom_1Chart').innerHTML = _variable + " " + "2000-2014";
    genmap(data);
    genBarScroll(data);
    genCDotPlot(data);
    createSearch(data);
    genBubble(data);
});

function changeYear(year){
  _year = +year;
  if (_variable == 'Treatment'){
  updatevalue();
  return;

  }
      document.getElementById('top1Chart').innerHTML = _variable + " " +_year + " ";
                document.getElementById('bottom_1Chart').innerHTML = _variable + " " + "2000-2014";
    tratamento.style.display = 'inline';
  if (year == 2015){
     tratamento.style.display = 'none';
    if (_variable == 'Total AIDS-related deaths (year)'){
    _variable = 'Total AIDS-related deaths 2015';
    }
    if (_variable == 'Total AIDS new cases'){
    _variable = 'Total AIDS new cases 2015';
    }
    if (_variable == 'Total AIDS incidence'){
    _variable = 'Total AIDS incidence 2015';
    }
    }
  if (_year != 2015){
    if (_variable == 'Total AIDS-related deaths 2015'){
    _variable = 'Total AIDS-related deaths (year)';
    }
    if (_variable == 'Total AIDS new cases 2015'){
    _variable = 'Total AIDS new cases';
    }
    if (_variable == 'Total AIDS incidence 2015'){
    _variable = 'Total AIDS incidence';
    }
  }
    
  
  updatevalue();
  newUpdate();
  newUpdateCDP();
  updateBubbles();
}

function changeVariable(variavel){
  _variable = variavel;
    document.getElementById('top1Chart').innerHTML = _variable + " " +_year + " ";
          document.getElementById('bottom_1Chart').innerHTML = _variable + " " + "2000-2014";

  if (variavel == 'Total AIDS new cases') {
    _variable_cdp = 'Total AIDS new cases 2015';
         top_1.style.display = 'inline';
    bottom_1.style.display = 'none';
    bottom_2.style.display = 'inline';

  }
  if (variavel == 'Total AIDS incidence') {
    _variable_cdp = 'Total AIDS incidence 2015';
     top_1.style.display = 'inline';
    bottom_2.style.display = 'none';
    bottom_1.style.display = 'inline';

  } if (variavel == 'Total AIDS-related deaths (year)') {
    _variable_cdp = 'Total AIDS-related deaths 2015';
     top_1.style.display = 'inline';
    bottom_2.style.display = 'none';
    bottom_1.style.display = 'inline';
  }

  if (variavel == 'Treatment') {
    top_1.style.display = 'none';
    bottom_2.style.display = 'none';
    bottom_1.style.display = 'none';
    updatevalue();
    return;
  }

  if (_year == 2015){
    if (_variable == 'Total AIDS-related deaths (year)'){
    _variable = 'Total AIDS-related deaths 2015';
    }
    if (_variable == 'Total AIDS new cases'){
    _variable = 'Total AIDS new cases 2015';
    }
    if (_variable == 'Total AIDS incidence'){
    _variable = 'Total AIDS incidence 2015';
    }
  }

  updatevalue();
  //updateBars();
  newUpdate();
  newUpdateCDP();
      //genmap(_variable,_year);
      //genBar(_variable,_year);
}

function createSearch(data){
    var options = '';
    var countries = {};
    data.forEach(function(d) {
      if (countries[d.location] != -1){
        countries[d.location] = -1;
        options = options + "<option value='" + d.location + "'>";
      }
    })  ;

  $("#input_2").on('input',function(e){
         dispatch.countryEnter(($(this).val()), e);
   });
  
document.getElementById('languages').innerHTML = options;
}




function genmap(data){

  var config = {"color0":"#FFEAC8","color1":"#EE9200",
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
  
  valueFormat = function (d) {
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
      if (d.Date == _year && d.variable == _variable){
             if (_variable ==  'Treatment' && d.Value == 1){
              valueHash[d.location] = +10;
             maxValue = 10; 
             minValue = 0;

        }
        else{
          valueHash[d.location] = +d.Value;
          if (+d.Value > maxValue){maxValue = +d.Value;}
          if (+d.Value < minValue){minValue = +d.Value;}
      }}
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
  
colormap = function(d){

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

    valueHash = {};
    maxValue = -100000, minValue = 100000;
    
    data.forEach(function(d) {
      d.Date = +d.Date;
      if (d.Date == _year && d.variable == _variable){
        if (d.variable ==  'Treatment' ){
          if( d.Value == 1 ){
            valueHash[d.location] = +10000;
             maxValue = 10000; 
             minValue = 0;
           }
        }
        else{
              valueHash[d.location] = +d.Value;
              if (+d.Value > maxValue){maxValue = +d.Value;}
              if (+d.Value < minValue){minValue = +d.Value; }
        }
      }
    })
      quantize.domain([minValue,maxValue])
      svg.selectAll("path[class=country]").attr("fill", colormap);
}

    country.enter().insert("path")
        .attr("class", "country")
        .attr("d", path)
        .attr("id", function(d,i) { return d.id; })
        .attr("title", function(d) { return d.properties.name; })
        .attr("fill", colormap)
        .attr("cx", function (d) { return projection(d)[1]; })

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
          dispatch.countryEnter(d.properties.name, d);
        });       
    
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

  
function genBarScroll(data) {
 
  valueHash = {};
  datasetTotal = [];
   
    data.forEach(function(d) {
      d.Date = +d.Date;
      d.Value = +d.Value;
      if (d.Date == _year && d.variable == _variable){
        valueHash[d.location] = +d.Value;

        if (+d.Value > maxValue){maxValue = +d.Value;}
        if (+d.Value < minValue){minValue = +d.Value;}
      }
      }
    )


    var i = 0;
    for (var location in valueHash){
         datasetTotal.push({key:i ,country:location, value:+valueHash[location]})
        i = i +1;
     }

  sortBar = function(){
    datasetTotal.sort(function(a, b) {
      if(_top == 'menos'){
          return a.value < b.value;
      }
      else {
        return a.value > b.value;
      }
    })
  }
 
  sortBar();

    newUpdate = function(){
 	maxValue = -100000, minValue = 100000;
      valueHash = {};
      datasetTotal = [];
     
      data.forEach(function(d) {
        d.Date = +d.Date;
        d.Value = +d.Value;
        if (d.Date == _year && d.variable == _variable){
          valueHash[d.location] = +d.Value;

          if (+d.Value > maxValue){maxValue = +d.Value;}
          if (+d.Value < minValue){minValue = +d.Value;}
        }
        }
      )

      var i = 0;
      for (var location in valueHash){
           datasetTotal.push({key:i ,country:location, value:+valueHash[location]})
          i = i +1;
       }

       sortBar();

      updateScales();
  }


    /////////////////////////////////////////////////////////////
    ///////////////// Set-up SVG and wrappers ///////////////////
    /////////////////////////////////////////////////////////////
 
    //Added only for the mouse wheel
    var zoomer = d3.behavior.zoom()
        .on("zoom", null);
 
    var main_margin = {top: 10, right: 10, bottom: 30, left: 100},
        main_width = 350 - main_margin.left - main_margin.right,
        main_height = 229 - main_margin.top - main_margin.bottom;
 
    var mini_margin = {top: 10, right: 10, bottom: 30, left: 10},
        mini_height = 234 - mini_margin.top - mini_margin.bottom;
    mini_width = 100 - mini_margin.left - mini_margin.right;
 
    svg = d3.select("#top_1").append("svg")
        .attr("class", "svgWrapper")
        .attr("width", main_width + main_margin.left + main_margin.right + mini_width + mini_margin.left + mini_margin.right)
        .attr("height", main_height + main_margin.top + main_margin.bottom)
        .call(zoomer)
        .on("wheel.zoom", scroll)
        //.on("mousewheel.zoom", scroll)
        //.on("DOMMouseScroll.zoom", scroll)
        //.on("MozMousePixelScroll.zoom", scroll)
        //Is this needed?
        .on("mousedown.zoom", null)
        .on("touchstart.zoom", null)
        .on("touchmove.zoom", null)
        .on("touchend.zoom", null);
 
    var mainGroup = svg.append("g")
            .attr("class","mainGroupWrapper")
            .attr("transform","translate(" + main_margin.left + "," + main_margin.top + ")")
            .append("g") //another one for the clip path - due to not wanting to clip the labels
            .attr("clip-path", "url(#clip)")
            .style("clip-path", "url(#clip)")
            .attr("class","mainGroup");
 
    var miniGroup = svg.append("g")
            .attr("class","miniGroup")
            .attr("transform","translate(" + (main_margin.left + main_width + main_margin.right + mini_margin.left) + "," + mini_margin.top + ")");
 
    var brushGroup = svg.append("g")
            .attr("class","brushGroup")
            .attr("transform","translate(" + (main_margin.left + main_width + main_margin.right + mini_margin.left) + "," + mini_margin.top + ")");
 
    /////////////////////////////////////////////////////////////
    ////////////////////// Initiate scales //////////////////////
    /////////////////////////////////////////////////////////////
 
    main_xScale = d3.scale.linear().range([0, main_width]);
    mini_xScale = d3.scale.linear().range([0, mini_width]);
 
    main_yScale = d3.scale.ordinal().rangeBands([0, main_height], 0.4, 0);
    mini_yScale = d3.scale.ordinal().rangeBands([0, mini_height], 0.4, 0);
 
    //Based on the idea from: http://stackoverflow.com/questions/21485339/d3-brushing-on-grouped-bar-chart
    main_yZoom = d3.scale.linear()
        .range([0, main_height])
        .domain([0, main_height]);
 
    //Create x axis object
    main_xAxis = d3.svg.axis()
      .scale(main_xScale)
      .orient("bottom")
      .ticks(4)
      //.tickSize(0)
      .outerTickSize(0);
 
    //Add group for the x axis
    d3.select(".mainGroupWrapper")
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + 0 + "," + (main_height + 5) + ")");
 
    //Create y axis object
    main_yAxis = d3.svg.axis()
      .scale(main_yScale)
      .orient("left")
      .tickSize(0)
      .outerTickSize(0);
 
    //Add group for the y axis
    mainGroup.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(-5,0)");
 
    /////////////////////////////////////////////////////////////
    /////////////////////// Update scales ///////////////////////
    /////////////////////////////////////////////////////////////
 
    //Update the scales
    main_xScale.domain([0, d3.max(datasetTotal, function(d) { return d.value; })]);
    mini_xScale.domain([0, d3.max(datasetTotal, function(d) { return d.value; })]);
    main_yScale.domain(datasetTotal.map(function(d) { return d.country; }));
    mini_yScale.domain(datasetTotal.map(function(d) { return d.country; }));
   
  function updateScales() {
    main_xScale.domain([0, d3.max(datasetTotal, function(d) { return d.value; })]);
    mini_xScale.domain([0, d3.max(datasetTotal, function(d) { return d.value; })]);
    main_yScale.domain(datasetTotal.map(function(d) { return d.country; }));
    mini_yScale.domain(datasetTotal.map(function(d) { return d.country; }));

    update();
    updateMiniBar();
    d3.select(".mainGroup").select(".y.axis").call(main_yAxis);
    d3.select(".mainGroupWrapper").select(".x.axis").call(main_xAxis);
  }

    //Create the visual part of the y axis
    d3.select(".mainGroup").select(".y.axis").call(main_yAxis);
    d3.select(".mainGroupWrapper").select(".x.axis").call(main_xAxis);
 
    /////////////////////////////////////////////////////////////
    ///////////////////// Label axis scales /////////////////////
    /////////////////////////////////////////////////////////////
 
    textScale = d3.scale.linear()
      .domain([15,50])
      .range([12,6])
      .clamp(true);
   
    /////////////////////////////////////////////////////////////
    ///////////////////////// Create brush //////////////////////
    /////////////////////////////////////////////////////////////
 
    //What should the first extent of the brush become - a bit arbitrary this
    var brushExtent = Math.max( 1, Math.min( 10, Math.round(datasetTotal.length*0.2) ) );

    brush = d3.svg.brush()
        .y(mini_yScale)
        .extent([mini_yScale(datasetTotal[0].country), mini_yScale(datasetTotal[brushExtent].country)])
        .on("brush", brushmove) 

        //.on("brushend", brushend);
 
    //Set up the visual part of the brush
    gBrush = d3.select(".brushGroup").append("g")
      .attr("class", "brush")
      .call(brush);
   
    gBrush.selectAll(".resize")
      .append("line")
      .attr("x2", mini_width);
 
    gBrush.selectAll(".resize")
      .append("path")
      .attr("d", d3.svg.symbol().type("triangle-up").size(10))
      .attr("transform", function(d,i) {
        return i ? "translate(" + (mini_width/2) + "," + 4 + ") rotate(180)" : "translate(" + (mini_width/2) + "," + -4 + ") rotate(0)";
      });
 
    gBrush.selectAll("rect")
      .attr("width", mini_width);
 
    //On a click recenter the brush window
    gBrush.select(".background")
      .on("mousedown.brush", brushcenter)
      .on("touchstart.brush", brushcenter);
 
    ///////////////////////////////////////////////////////////////////////////
    /////////////////// Create a rainbow gradient - for fun ///////////////////
    ///////////////////////////////////////////////////////////////////////////
 
    defs = svg.append("defs")
 
    //Create two separate gradients for the main and mini bar - just because it looks fun
   /* createGradient("gradient-rainbow-main", "60%");
    createGradient("gradient-rainbow-mini", "13%");
    */
    //Add the clip path for the main bar chart
    defs.append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("x", -main_margin.left)
      .attr("width", main_width + main_margin.left)
      .attr("height", main_height);
 
    /////////////////////////////////////////////////////////////
    /////////////// Set-up the mini bar chart ///////////////////
    /////////////////////////////////////////////////////////////
 
    //The mini brushable bar
    //DATA JOIN
    var mini_bar = d3.select(".miniGroup").selectAll(".bar")
      .data(datasetTotal, function(d) { return d.key; });
 
    //UDPATE
    mini_bar
      .attr("key", function(d) { return d.country;})
      .attr("width", function(d) { return mini_xScale(d.value); })
      .attr("y", function(d,i) { return mini_yScale(d.country); })
      .attr("height", mini_yScale.rangeBand());
 
    //ENTER
    mini_bar.enter().append("rect")
      .attr("key", function(d) { return d.country;})
      .attr("class", "bar")
      .attr("x", 0)
      .attr("width", function(d) { return mini_xScale(d.value); })
      .attr("y", function(d,i) { return mini_yScale(d.country); })
      .attr("height", mini_yScale.rangeBand())
      .style("fill", "orange");
 
    //EXIT
    mini_bar.exit()
      .remove();
 
  function updateMiniBar(){
    mini_bar = d3.select(".miniGroup").selectAll(".bar")
      .data(datasetTotal, function(d) { return d.key; });
 
    //UDPATE
    mini_bar
      .attr("key", function(d) { return d.country;})
      .transition()
      .duration(100)
      .attr("width", function(d) { return mini_xScale(d.value); })
      .transition()
      .duration(300)
      .attr("y", function(d,i) { return mini_yScale(d.country); })
      .transition()
      .duration(800)
      .attr("height", mini_yScale.rangeBand());
 
    //ENTER
    mini_bar.enter().append("rect")
      .attr("key", function(d) { return d.country;})
      .attr("class", "bar")
      .attr("x", 0)
      .attr("width", function(d) { return mini_xScale(d.value); })
      .attr("y", function(d,i) { return mini_yScale(d.country); })
      .attr("height", mini_yScale.rangeBand())

    //EXIT
    mini_bar.exit()
      .remove();
  }

    //Start the brush
    gBrush.call(brush.event);
 
  }//init
 
  //Function runs on a brush move - to update the big bar chart
  function update() {
 
    /////////////////////////////////////////////////////////////
    ////////// Update the bars of the main bar chart ////////////
    /////////////////////////////////////////////////////////////
 
    //DATA JOIN
    var bar = d3.select(".mainGroup").selectAll(".bar")
        .data(datasetTotal, function(d) { return d.key; });
 
    //UPDATE
    bar
      .attr("key", function(d) { return d.country;})
      .transition()
      .duration(100)
      .attr("x", 0)
      .transition()
      .duration(800)
      .attr("width", function(d) { return main_xScale(d.value); })
      //Need this???
      .transition()
      .duration(500)
      .attr("y", function(d,i) { return main_yScale(d.country); })
      .transition()
      .duration(800)
      .attr("height", main_yScale.rangeBand())
      
      
 
    //ENTER
    bar.enter().append("rect")
      .attr("key", function(d) { return d.country; })
      .attr("class", "bar")
      .style("fill", "orange")
      .style("stroke", "black")
      .attr("x", 0)
      .attr("width", function(d) { return main_xScale(d.value); })
      .attr("y", function(d,i) { return main_yScale(d.country); })
      .attr("height", main_yScale.rangeBand())


      //MOUSEMOVE
      .on("mousemove", function(d) {
            var html = "";
  
            html += "<div class=\"tooltip_kv\">";
            html += "<span class=\"tooltip_key\">";
            html += d.country;
            html += "</span>";
            html += "<span class=\"tooltip_value\">";
            html += valueFormat(d.value);
            html += "";
            html += "</span>";
            html += "</div>";
            
            $("#tooltip-container").html(html);
            $(this).attr("fill-opacity", "0.8");
            $("#tooltip-container").show();
            
            var coordinates = d3.mouse(this);
            
            var map_width = $('.mainGroupWrapper')[0].getBoundingClientRect().width;
            
            if (d3.event.pageX < map_width / 2) {
              d3.select("#tooltip-container")
                .style("top", (d3.event.layerY + 15) + "px")
                .style("left", (d3.event.layerX + 15) + "px");
            } else {
              var tooltip_width = $("#tooltip-container").width();
              d3.select("#tooltip-container")
                .style("top", (d3.event.layerY + 100) + "px")
                .style("left", (d3.event.layerX + 900) + "px");
            }
        })
        .on("mouseout", function() {
                $(this).attr("fill-opacity", "1.0");
                $("#tooltip-container").hide();
            })

        .on("click",  function(d) {
          dispatch.countryEnter(d.country, d);
        })
 
    //EXIT
    bar.exit()
      .remove();
 
  }//update
 
  /////////////////////////////////////////////////////////////
  ////////////////////// Brush functions //////////////////////
  /////////////////////////////////////////////////////////////
 
  //First function that runs on a brush move
  function brushmove() {
 
    var extent = brush.extent();
 
    //Which bars are still "selected"
    var selected = mini_yScale.domain()
      .filter(function(d) { return (extent[0] - mini_yScale.rangeBand() + 1e-2 <= mini_yScale(d)) && (mini_yScale(d) <= extent[1] - 1e-2); });
    //Update the colors of the mini chart - Make everything outside the brush grey
    d3.select(".miniGroup").selectAll(".bar")
      .style("fill", function(d, i) { return selected.indexOf(d.country) > -1 ? "orange" : "#e0e0e0"; });
 
    //Update the label size
    d3.selectAll(".y.axis text")
      .style("font-size", textScale(selected.length));
   
    /////////////////////////////////////////////////////////////
    ///////////////////// Update the axes ///////////////////////
    /////////////////////////////////////////////////////////////
 
    //Reset the part that is visible on the big chart
    var originalRange = main_yZoom.range();
    main_yZoom.domain( extent );
 
    //Update the domain of the x & y scale of the big bar chart
    main_yScale.domain(datasetTotal.map(function(d) { return d.country; }));
    main_yScale.rangeBands( [ main_yZoom(originalRange[0]), main_yZoom(originalRange[1]) ], 0.4, 0);
 
    //Update the y axis of the big chart
    d3.select(".mainGroup")
      .select(".y.axis")
      .transition().duration(500)
      .call(main_yAxis);
 
    //Find the new max of the bars to update the x scale
    var newMaxXScale = d3.max(datasetTotal, function(d) { return selected.indexOf(d.country) > -1 ? d.value : 0; });
    main_xScale.domain([0, newMaxXScale]);
 
    //Update the x axis of the big chart
    d3.select(".mainGroupWrapper")
      .select(".x.axis")
      .transition().duration(50)
      .call(main_xAxis);
 
    //Update the big bar chart
      update();
   
  }//brushmove
 
  /////////////////////////////////////////////////////////////
  ////////////////////// Click functions //////////////////////
  /////////////////////////////////////////////////////////////
 
  //Based on http://bl.ocks.org/mbostock/6498000
  //What to do when the user clicks on another location along the brushable bar chart
  function brushcenter() {
    var target = d3.event.target,
        extent = brush.extent(),
        size = extent[1] - extent[0],
        range = mini_yScale.range(),
        y0 = d3.min(range) + size / 2,
        y1 = d3.max(range) + mini_yScale.rangeBand() - size / 2,
        center = Math.max( y0, Math.min( y1, d3.mouse(target)[1] ) );
 
    d3.event.stopPropagation();
 
    gBrush
        .call(brush.extent([center - size / 2, center + size / 2]))
        .call(brush.event);
 
  }//brushcenter
 
  /////////////////////////////////////////////////////////////
  ///////////////////// Scroll functions //////////////////////
  /////////////////////////////////////////////////////////////
 
  function scroll() {
 
    //Mouse scroll on the mini chart
    var extent = brush.extent(),
      size = extent[1] - extent[0],
      range = mini_yScale.range(),
      y0 = d3.min(range),
      y1 = d3.max(range) + mini_yScale.rangeBand(),
      dy = d3.event.deltaY,
      topSection;
 
    if ( extent[0] - dy < y0 ) { topSection = y0; }
    else if ( extent[1] - dy > y1 ) { topSection = y1 - size; }
    else { topSection = extent[0] - dy; }
 
    //Make sure the page doesn't scroll as well
    d3.event.stopPropagation();
    d3.event.preventDefault();
 
    gBrush
        .call(brush.extent([ topSection, topSection + size ]))
        .call(brush.event);
 
  }//scroll


function genCDotPlot(data) {

 
  valueHash_cdp = {};
  datasetTotal_cdp = [];
   
    data.forEach(function(d) {
      d.Date = +d.Date;
      d.Value = +d.Value;
      if (d.Date == _year_cdp && d.variable == _variable_cdp){
        valueHash_cdp[d.location] = +d.Value;

        if (+d.Value > maxValue){maxValue = +d.Value;}
        if (+d.Value < minValue){minValue = +d.Value;}
      }
      }
    )

    var i = 0;
    for (var location in valueHash_cdp){
         datasetTotal_cdp.push({key:i ,country:location, value:+valueHash_cdp[location]})
        i = i +1;
     }
  datasetTotal_cdp.sort(function(a, b) {
          return a.value < b.value;
    })
 
    newUpdateCDP = function(){

      valueHash_cdp = {};
      datasetTotal_cdp = [];
     
      data.forEach(function(d) {
        d.Date = +d.Date;
        d.Value = +d.Value;
        if (d.Date == _year_cdp && d.variable == _variable_cdp){
          valueHash_cdp[d.location] = +d.Value;
          if (+d.Value > maxValue){maxValue = +d.Value;}
          if (+d.Value < minValue){minValue = +d.Value;}
        }
        }
      )

      var i = 0;
      for (var location in valueHash_cdp){
           datasetTotal_cdp.push({key:i ,country:location, value:+valueHash_cdp[location]})
          i = i +1;
       }
      datasetTotal_cdp.sort(function(a, b) {
            return a.value < b.value;
      })

      updateScales_cdp();
  }


    /////////////////////////////////////////////////////////////
    ///////////////// Set-up SVG and wrappers ///////////////////
    /////////////////////////////////////////////////////////////
 
    //Added only for the mouse wheel
    var zoomer_cdp = d3.behavior.zoom()
        .on("zoom", null);
 
    var main_margin = {top: 10, right: 10, bottom: 30, left: 100},
        main_width = 335 - main_margin.left - main_margin.right,
        main_height = 250 - main_margin.top - main_margin.bottom;
 
    var mini_margin = {top: 10, right: 10, bottom: 30, left: 10},
        mini_height = 245 - mini_margin.top - mini_margin.bottom;
    mini_width = 100 - mini_margin.left - mini_margin.right;
 
    svg = d3.select("#bottom_1").append("svg")
        .attr("class", "svgWrapper_cdp")
        .attr("width", main_width + main_margin.left + main_margin.right + mini_width + mini_margin.left + mini_margin.right)
        .attr("height", main_height + main_margin.top + main_margin.bottom)
        .call(zoomer_cdp)
        .on("wheel.zoom", scroll_cdp)
        //.on("mousewheel.zoom", scroll)
        //.on("DOMMouseScroll.zoom", scroll)
        //.on("MozMousePixelScroll.zoom", scroll)
        //Is this needed?
        .on("mousedown.zoom", null)
        .on("touchstart.zoom", null)
        .on("touchmove.zoom", null)
        .on("touchend.zoom", null);
 
    var mainGroup_cdp = svg.append("g")
            .attr("class","mainGroupWrapper_cdp")
            .attr("transform","translate(" + main_margin.left + "," + main_margin.top + ")")
            .append("g") //another one for the clip path - due to not wanting to clip the labels
            .attr("clip-path", "url(#clip_cdp)")
            .style("clip-path", "url(#clip_cdp)")
            .attr("class","mainGroup_cdp");
 
    var miniGroup_cdp = svg.append("g")
            .attr("class","miniGroup_cdp")
            .attr("transform","translate(" + (main_margin.left + main_width + main_margin.right + mini_margin.left) + "," + mini_margin.top + ")");
 
    var brushGroup_cdp = svg.append("g")
            .attr("class","brushGroup_cdp")
            .attr("transform","translate(" + (main_margin.left + main_width + main_margin.right + mini_margin.left) + "," + mini_margin.top + ")");
 
    /////////////////////////////////////////////////////////////
    ////////////////////// Initiate scales //////////////////////
    /////////////////////////////////////////////////////////////
 
    main_xScale_cdp = d3.scale.linear().range([0, main_width]);
    mini_xScale_cdp = d3.scale.linear().range([0, mini_width]);
 
    main_yScale_cdp = d3.scale.ordinal().rangeBands([0, main_height], 0.4, 0);
    mini_yScale_cdp = d3.scale.ordinal().rangeBands([0, mini_height], 0.4, 0);
 
    //Based on the idea from: http://stackoverflow.com/questions/21485339/d3-brushing-on-grouped-bar-chart
    main_yZoom_cdp = d3.scale.linear()
        .range([0, main_height])
        .domain([0, main_height]);
 
    //Create x axis object
    main_xAxis_cdp = d3.svg.axis()
      .scale(main_xScale_cdp)
      .orient("bottom")
      .ticks(4)
      //.tickSize(0)
      .outerTickSize(0);
 
    //Add group for the x axis
    d3.select(".mainGroupWrapper_cdp")
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + 0 + "," + (main_height + 5) + ")");
 
    //Create y axis object
    main_yAxis_cdp = d3.svg.axis()
      .scale(main_yScale_cdp)
      .orient("left")
      .tickSize(0)
      .innerTickSize(-1000)
    .outerTickSize(0)
    .tickPadding(10);
 
    //Add group for the y axis
    mainGroup_cdp.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(-5,0)");
 
    /////////////////////////////////////////////////////////////
    /////////////////////// Update scales ///////////////////////
    /////////////////////////////////////////////////////////////
 
    //Update the scales
    main_xScale_cdp.domain([0, d3.max(datasetTotal_cdp, function(d) { return d.value; })]);
    mini_xScale_cdp.domain([0, d3.max(datasetTotal_cdp, function(d) { return d.value; })]);
    main_yScale_cdp.domain(datasetTotal_cdp.map(function(d) { return d.country; }));
    mini_yScale_cdp.domain(datasetTotal_cdp.map(function(d) { return d.country; }));
   
  function updateScales_cdp() {
    main_xScale_cdp.domain([0, d3.max(datasetTotal_cdp, function(d) { return d.value; })]);
    mini_xScale_cdp.domain([0, d3.max(datasetTotal_cdp, function(d) { return d.value; })]);
    main_yScale_cdp.domain(datasetTotal_cdp.map(function(d) { return d.country; }));
    mini_yScale_cdp.domain(datasetTotal_cdp.map(function(d) { return d.country; }));

    updateDots();
    updateMiniDots();
    d3.select(".mainGroup_cdp").select(".y.axis").call(main_yAxis_cdp);
    d3.select(".mainGroupWrapper_cdp").select(".x.axis").call(main_xAxis_cdp);
  }

    //Create the visual part of the y axis
    d3.select(".mainGroup_cdp").select(".y.axis").call(main_yAxis_cdp);
    d3.select(".mainGroupWrapper_cdp").select(".x.axis").call(main_xAxis_cdp);
 
    /////////////////////////////////////////////////////////////
    ///////////////////// Label axis scales /////////////////////
    /////////////////////////////////////////////////////////////
 
    textScale_cdp = d3.scale.linear()
      .domain([15,50])
      .range([12,6])
      .clamp(true);
   
    /////////////////////////////////////////////////////////////
    ///////////////////////// Create brush //////////////////////
    /////////////////////////////////////////////////////////////
 
    //What should the first extent of the brush become - a bit arbitrary this
    var brushExtent_cdp = Math.max( 1, Math.min( 10, Math.round(datasetTotal_cdp.length*0.2) ) );
 
    brush_cdp = d3.svg.brush()
        .y(mini_yScale_cdp)
        .extent([mini_yScale_cdp(datasetTotal_cdp[0].country), mini_yScale_cdp(datasetTotal_cdp[brushExtent_cdp].country)])
        .on("brush", brushmove_cdp)
        //.on("brushend", brushend);
 
    //Set up the visual part of the brush
    gBrush_cdp = d3.select(".brushGroup_cdp").append("g")
      .attr("class", "brush_cdp")
      .call(brush_cdp);
   
    gBrush_cdp.selectAll(".resize")
      .append("line")
      .attr("x2", mini_width);
 
    gBrush_cdp.selectAll(".resize")
      .append("path")
      .attr("d", d3.svg.symbol().type("triangle-up").size(10))
      .attr("transform", function(d,i) {
        return i ? "translate(" + (mini_width/2) + "," + 4 + ") rotate(180)" : "translate(" + (mini_width/2) + "," + -4 + ") rotate(0)";
      });
 
    gBrush_cdp.selectAll("rect")
      .attr("width", mini_width);
 
    //On a click recenter the brush window
    gBrush_cdp.select(".background")
      .on("mousedown.brush", brushcenter_cdp)
      .on("touchstart.brush", brushcenter_cdp);
 
    ///////////////////////////////////////////////////////////////////////////
    /////////////////// Create a rainbow gradient - for fun ///////////////////
    ///////////////////////////////////////////////////////////////////////////
 
    defs_cdp = svg.append("defs_cdp")
 
    //Create two separate gradients for the main and mini bar - just because it looks fun
   /* createGradient("gradient-rainbow-main", "60%");
    createGradient("gradient-rainbow-mini", "13%");
    */
    //Add the clip path for the main bar chart
    defs_cdp.append("clipPath")
      .attr("id", "clip_cdp")
      .append("rect")
      .attr("x", -main_margin.left)
      .attr("width", main_width + main_margin.left)
      .attr("height", main_height);
 
    /////////////////////////////////////////////////////////////
    /////////////// Set-up the mini bar chart ///////////////////
    /////////////////////////////////////////////////////////////
 
    //The mini brushable bar
    //DATA JOIN
    var mini_bar_cdp = d3.select(".miniGroup_cdp").selectAll(".dot")
      .data(datasetTotal_cdp, function(d) { return d.key; });
 
    //UDPATE
    mini_bar_cdp
      .attr("key", function(d) { return d.country;})
      .attr("cx", function(d) { return mini_xScale_cdp(d.value); })
      .attr("cy", function(d,i) { return mini_yScale_cdp(d.country); })
      .attr("class", "dot")
      .attr("r",2);
 
    //ENTER
    mini_bar_cdp.enter().append("circle")
     .attr("key", function(d) { return d.country;})
      .attr("class", "dot")
      .attr("r", 2)
      .attr("cx", function(d) { return mini_xScale_cdp(d.value); })
      .attr("cy", function(d,i) { return mini_yScale_cdp(d.country); })
     .style("fill", "orange");
 
    //EXIT
    mini_bar_cdp.exit()
      .remove();
 
  function updateMiniDots(){
    mini_bar_cdp = d3.select(".miniGroup_cdp").selectAll(".dot")
      .data(datasetTotal_cdp, function(d) { return d.key; });
 
    //UDPATE
    mini_bar_cdp
      .attr("key", function(d) { return d.country;})
      .attr("class", "dot")
      .transition()
      .duration(100)
      .attr("cx", function(d) { return mini_xScale_cdp(d.value); })
      .transition()
      .duration(300)
      .attr("cy", function(d,i) { return mini_yScale_cdp(d.country); })
      .transition()
      .duration(800)
      .attr("r", 2);
     // .attr("height", mini_yScale_cdp.rangeBand());
 
    //ENTER
    mini_bar_cdp.enter().append("circle")
      .attr("key", function(d) { return d.country;})
      .attr("class", "dot")
     // .attr("x", 0)
     .attr("r", 2)
      .attr("cx", function(d) { return mini_xScale_cdp(d.value); })
      .attr("cy", function(d,i) { return mini_yScale_cdp(d.country); })
     // .attr("height", mini_yScale_cdp.rangeBand())
      .style("fill", "orange")
      .style("stroke", "black");
 
    //EXIT
    mini_bar_cdp.exit()
      .remove();
  }

    //Start the brush
    gBrush_cdp.call(brush_cdp.event);
 
  }//init
 
  //Function runs on a brush move - to update the big bar chart
  function updateDots() {
 
    /////////////////////////////////////////////////////////////
    ////////// Update the bars of the main bar chart ////////////
    /////////////////////////////////////////////////////////////
 
    //DATA JOIN
    var bar_cdp = d3.select(".mainGroup_cdp").selectAll(".dot")
        .data(datasetTotal_cdp, function(d) { return d.key; });
 
    //UPDATE
    bar_cdp
      .attr("key", function(d) { return d.country;})
      .transition()
      .duration(100)
      .attr("x", 0)
      .transition()
      .duration(800)
      .attr("cx", function(d) { return main_xScale_cdp(d.value)-5; })
      //Need this???
      .transition()
      .duration(500)
      .attr("r", main_yScale_cdp.rangeBand()/1.5)
      .transition()
      .duration(800)
      .attr("class", "dot")
      .attr("cy", function(d,i) { return main_yScale_cdp(d.country)+main_yScale_cdp.rangeBand()/1.5; })
      .transition()
      .duration(800)
      .attr("height", main_yScale_cdp.rangeBand())
      
      
 
    //ENTER
    bar_cdp.enter().append("circle")
      .attr("key", function(d) { return d.country; })
      .attr("class", "dot")
      .style("fill", "orange")
      .style("stroke", "black")
      .attr("r", main_yScale_cdp.rangeBand()/1.5)
      .attr("cx", function(d) { return main_xScale_cdp(d.value)-5; })
      .attr("cy", function(d,i) { return main_yScale_cdp(d.country)+main_yScale_cdp.rangeBand()/1.5; })



      //MOUSEMOVE
      .on("mousemove", function(d) {
            var html = "";
  
            html += "<div class=\"tooltip_kv\">";
            html += "<span class=\"tooltip_key\">";
            html += d.country;
            html += "</span>";
            html += "<span class=\"tooltip_value\">";
            html += valueFormat(d.value);
            html += "";
            html += "</span>";
            html += "</div>";
            
            $("#tooltip-container").html(html);
            $(this).attr("fill-opacity", "0.8");
            $("#tooltip-container").show();
            
            var coordinates = d3.mouse(this);
            
            var map_width = $('.mainGroupWrapper_cdp')[0].getBoundingClientRect().width;
            
            if (d3.event.pageX < map_width / 2) {
              d3.select("#tooltip-container")
                .style("top", (d3.event.layerY + 15) + "px")
                .style("left", (d3.event.layerX + 15) + "px");
            } else {
              var tooltip_width = $("#tooltip-container").width();
              d3.select("#tooltip-container")
                .style("top", (d3.event.layerY + 100) + "px")
                .style("left", (d3.event.layerX + 900) + "px");
            }
        })
        .on("mouseout", function() {
                $(this).attr("fill-opacity", "1.0");
                $("#tooltip-container").hide();
            })

        .on("click",  function(d) {
          dispatch.countryEnter(d.country, d);
        })
 
    //EXIT
    bar_cdp.exit()
      .remove();
 
  }//update
 
  /////////////////////////////////////////////////////////////
  ////////////////////// Brush functions //////////////////////
  /////////////////////////////////////////////////////////////
 
  //First function that runs on a brush move
  function brushmove_cdp() {
 
    var extent_cdp = brush_cdp.extent();
 
    //Which bars are still "selected"
    var selected_cdp = mini_yScale_cdp.domain()
      .filter(function(d) { return (extent_cdp[0] - mini_yScale_cdp.rangeBand() + 1e-2 <= mini_yScale_cdp(d)) && (mini_yScale_cdp(d) <= extent_cdp[1] - 1e-2); });
    //Update the colors of the mini chart - Make everything outside the brush grey
    d3.select(".miniGroup_cdp").selectAll(".dot")
      .style("fill", function(d, i) { return selected_cdp.indexOf(d.location) > -1 ? "orange" : "#e0e0e0"; });
 
    //Update the label size
    d3.selectAll(".y.axis text")
      .style("font-size", textScale_cdp(selected_cdp.length));
   
    /////////////////////////////////////////////////////////////
    ///////////////////// Update the axes ///////////////////////
    /////////////////////////////////////////////////////////////
 
    //Reset the part that is visible on the big chart
    var originalRange_cdp = main_yZoom_cdp.range();
    main_yZoom_cdp.domain( extent_cdp );
 
    //Update the domain of the x & y scale of the big bar chart
    main_yScale_cdp.domain(datasetTotal_cdp.map(function(d) { return d.country; }));
    main_yScale_cdp.rangeBands( [ main_yZoom_cdp(originalRange_cdp[0]), main_yZoom_cdp(originalRange_cdp[1]) ], 0.4, 0);
 
    //Update the y axis of the big chart
    d3.select(".mainGroup_cdp")
      .select(".y.axis")
      .transition().duration(500)
      .call(main_yAxis_cdp);
 
    //Find the new max of the bars to update the x scale
    var newMaxXScale_cdp = d3.max(datasetTotal_cdp, function(d) { return selected_cdp.indexOf(d.country) > -1 ? d.value : 0; });
    main_xScale_cdp.domain([0, newMaxXScale_cdp]);
 
    //Update the x axis of the big chart
    d3.select(".mainGroupWrapper_cdp")
      .select(".x.axis")
      .transition().duration(50)
      .call(main_xAxis_cdp);
 
    //Update the big bar chart
    updateDots();
   
  }//brushmove
 
  /////////////////////////////////////////////////////////////
  ////////////////////// Click functions //////////////////////
  /////////////////////////////////////////////////////////////
 
  //Based on http://bl.ocks.org/mbostock/6498000
  //What to do when the user clicks on another location along the brushable bar chart
  function brushcenter_cdp() {
    var target_cdp = d3.event.target,
        extent_cdp = brush_cdp.extent(),
        size_cdp = extent_cdp[1] - extent_cdp[0],
        range_cdp = mini_yScale_cdp.range(),
        y0_cdp = d3.min(range_cdp) + size_cdp / 2,
        y1_cdp = d3.max(range_cdp) + mini_yScale_cdp.rangeBand() - size_cdp / 2,
        center_cdp = Math.max( y0_cdp, Math.min( y1_cdp, d3.mouse(target_cdp)[1] ) );
 
    d3.event.stopPropagation();
 
    gBrush_cdp
        .call(brush_cdp.extent([center_cdp - size_cdp / 2, center_cdp + size_cdp / 2]))
        .call(brush_cdp.event);
 
  }//brushcenter
 
  /////////////////////////////////////////////////////////////
  ///////////////////// Scroll functions //////////////////////
  /////////////////////////////////////////////////////////////
 
  function scroll_cdp() {
 
    //Mouse scroll on the mini chart
    var extent_cdp = brush_cdp.extent(),
      size_cdp = extent_cdp[1] - extent_cdp[0],
      range_cdp = mini_yScale_cdp.range(),
      y0_cdp = d3.min(range_cdp),
      y1_cdp = d3.max(range_cdp) + mini_yScale_cdp.rangeBand(),
      dy_cdp = d3.event.deltaY,
      topSection_cdp;
 
    if ( extent_cdp[0] - dy_cdp < y0_cdp ) { topSection_cdp = y0_cdp; }
    else if ( extent_cdp[1] - dy_cdp > y1_cdp ) { topSection_cdp = y1_cdp - size_cdp; }
    else { topSection_cdp = extent_cdp[0] - dy; }
 
    //Make sure the page doesn't scroll as well
    d3.event.stopPropagation();
    d3.event.preventDefault();
 
    gBrush_cdp
        .call(brush_cdp.extent([ topSection_cdp, topSection_cdp + size_cdp ]))
        .call(brush_cdp.event);
 
  }//scroll



 function genBubble(data){
        var valueHash = {};
        var datasetTotal = [];
        var valueKnow = {};
        var maxValue = -100000, minValue = 100000;

    var margin = {top: 20, right: 15, bottom: 60, left: 60}
      , width = 700 - margin.left - margin.right
      , height = 250 - margin.top - margin.bottom;


      data.forEach(function(d) {
        d.Date = +d.Date;
        d.Value = +d.Value;
        if (d.Date == _year && d.variable == _variable){
            valueHash[d.location] = +d.Value;
        }
        }
      )

      data.forEach(function(d) {
        d.Date = +d.Date;
        d.Value = +d.Value;
        if (d.Date == _year && d.variable == _variable2){
            valueKnow[d.location] = +d.Value;
          if (+d.Value > maxValue){maxValue = +d.Value;}
          if (+d.Value < minValue){minValue = +d.Value;}
        }
        }
      )

      var i = 0;
    for (var location in valueHash){
      if (valueKnow[location] != null){
         datasetTotal.push({key:i ,country:location, value:+valueHash[location], valueK:+valueKnow[location]})
        i = i +1;
      }
     }


  updateBubbles = function () {
    valueHash = {};
    datasetTotal = [];
    valueKnow = {};
    maxValue = -100000, minValue = 100000;

    data.forEach(function(d) {
        d.Date = +d.Date;
        d.Value = +d.Value;
        if (d.Date == _year && d.variable == _variable){
            valueHash[d.location] = +d.Value;
        }
        }
      )

    data.forEach(function(d) {
        d.Date = +d.Date;
        d.Value = +d.Value;
        if (d.Date == _year && d.variable == _variable2){
            valueKnow[d.location] = +d.Value;
   
          if (+d.Value > maxValue){maxValue = +d.Value;}
          if (+d.Value < minValue){minValue = +d.Value;}
        }
        }
      )

    var i = 0;
    for (var location in valueHash){
      if (valueKnow[location] != null){
         datasetTotal.push({key:i ,country:location, value:+valueHash[location], valueK:+valueKnow[location]})
        i = i +1;
      }
     }
    updateScalesBubbles();
  }

    var tooltip = d3.select("#bottom_2").append("div")
            .attr("class", "tooltip_sca")
            .style("opacity",100);
    
    var x = d3.scale.linear()
              .domain([0, d3.max(data, function(d) { return valueHash[d.location]; })])
              .range([ 0, width ]);
    
    var y = d3.scale.linear()
            .domain([0, d3.max(data, function(d) { return valueKnow[d.location]; })])
            .range([ height, 0 ]);
 
    var chart = d3.select('#bottom_2')
        .append('svg:svg')
        .attr('width', width + margin.right + margin.left)
        .attr('height', height + margin.top + margin.bottom)
        .attr('class', 'chart')

    var main = chart.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .attr('width', width)
        .attr('height', height)
        .attr('class', 'main')   
        
    // draw the x axis
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom');

    main.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .attr('class', 'main axis date')
        .call(xAxis);

    // text label for the x axis
  main.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("New Cases");

    // draw the y axis
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left');

    main.append('g')
      .attr('transform', 'translate(0,0)')
      .attr('class', 'main axis date')
      .call(yAxis);

  // text label for the y axis
  main.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "2em");      

    var g = main.append("g"); 
    
    g.selectAll("scatter-dots")
      .data(datasetTotal, function(d) { return d.country; })
      .enter().append("svg:circle")
         .attr("key", function(d) { return d.country;})
          .attr("cy", function (d,i) { return y(d.valueK); } )
          .attr("cx", function (d) { return x( d.value); } )
          .attr("r", function (d) { if (_variable2 == 'Knowledge about HIV prevention in young people') {return  d.valueK/7; } else { return 6;} } )
          .attr("fill", "orange")
          .attr("stroke", "black")      
            .on("mouseover", function(d) {
          var html = "";
  
            html += "<div class=\"tooltip_kv\">";
            html += "<span class=\"tooltip_key\">";
            html += d.country+":";
            html += "</span>";
            html += "</div>";
            html += "<div class=\"tooltip_kv\">";
            html += "<span class=\"tooltip_key\">";
            if (_variable2 == 'Knowledge about HIV prevention in young people') {
              html += "Knowledge:";
            }
            if (_variable2 == 'Total multiple sexual partnership') {
              html += "Multiple sexual partnership:";
            }
            if (_variable2 == 'Total people inject drugs') {
              html += "Inject drugs:";
            }
            if (_variable2 == 'Total sex workers AIDS prevalence') {
              html += "Sex workers";
            }
            //html += _variable2;
            //console.log(_variable2);
            html += "</span>";
            html += "<span class=\"tooltip_value\">";
            //console.log("QUERO VER ISTO")
            //console.log(d.country)
            html += valueFormat(d.valueK);
            html += "%";
            html += "</span>";
            html += "</div>";
            
            html += "<div class=\"tooltip_kv\">";
            html += "<span class=\"tooltip_key\">";
            html += "New cases:";
            html += "</span>";
            html += "<span class=\"tooltip_value\">";
            html += valueFormat(d.value);
            html += "";
            html += "</span>";
            html += "</div>";
            
            $("#tooltip-container").html(html);
            $(this).attr("fill-opacity", "0.8");
            $("#tooltip-container").show();
            
            var coordinates = d3.mouse(this);
            
            var map_width = $('.mainGroupWrapper_cdp')[0].getBoundingClientRect().width;
            
            if (d3.event.pageX < map_width / 2) {
              d3.select("#tooltip-container")
                .style("top", (d3.event.layerY) + "px")
                .style("left", (d3.event.layerX) + "px");
            } else {
              var tooltip_width = $("#tooltip-container").width();
              d3.select("#tooltip-container")
                .style("top", (d3.event.layerY + 100) + "px")
                .style("left", (d3.event.layerX + 900) + "px");
            }
      })
      .on("mouseout", function(d) {
          $(this).attr("fill-opacity", "1.0");
                $("#tooltip-container").hide();
      })
      .on("click", function(d) {

          dispatch.countryEnter(d.country, d);
        });

      


  function updateScalesBubbles(){
        
    x.domain([0, d3.max(data, function(d) { return valueHash[d.location]; })])
      .range([ 0, width ]);
    
    y.domain([0, d3.max(data, function(d) { return valueKnow[d.location]; })])
            .range([ height, 0 ]);
 
    xAxis.scale(x)
        .orient('bottom');

    yAxis.scale(y)
        .orient('left');

    main.select('g')
        .call(xAxis);

  g.selectAll("circle").remove();

     g.selectAll("scatter-dots")
      .data(datasetTotal, function(d) { return d.country; })
      .enter().append("svg:circle")
         .attr("key", function(d) { return d.country;})
          .attr("cy", function (d,i) { return y(d.valueK); } )
          .attr("cx", function (d) { return x( d.value); } )
          .attr("r", function (d) { if (_variable2 == 'Knowledge about HIV prevention in young people') {return  d.valueK/7; } else { return 6;} } )
          .attr("fill", "orange")
          .attr("stroke", "black")
            .on("mouseover", function(d) {
          var html = "";
  
            html += "<div class=\"tooltip_kv\">";
            html += "<span class=\"tooltip_key\">";
            html += d.country+":";
            html += "</span>";
            html += "</div>";
            html += "<div class=\"tooltip_kv\">";
            html += "<span class=\"tooltip_key\">";
            if (_variable2 == 'Knowledge about HIV prevention in young people') {
              html += "Knowledge:";
            }
            if (_variable2 == 'Total multiple sexual partnership') {
              html += "Multiple sexual partnership:";
            }
            if (_variable2 == 'Total people inject drugs') {
              html += "Inject drugs:";
            }
            if (_variable2 == 'Total sex workers AIDS prevalence') {
              html += "Sex workers";
            }
            //html += _variable2;
            //console.log(_variable2);
            html += "</span>";
            html += "<span class=\"tooltip_value\">";
            //console.log("QUERO VER ISTO")
            //console.log(d.country)
            html += valueFormat(d.valueK);
            html += "%";
            html += "</span>";
            html += "</div>";
            
            html += "<div class=\"tooltip_kv\">";
            html += "<span class=\"tooltip_key\">";
            html += "New cases:";
            html += "</span>";
            html += "<span class=\"tooltip_value\">";
            html += valueFormat(d.value);
            html += "";
            html += "</span>";
            html += "</div>";
            
            $("#tooltip-container").html(html);
            $(this).attr("fill-opacity", "0.8");
            $("#tooltip-container").show();
            
            var coordinates = d3.mouse(this);
            
            var map_width = $('.mainGroupWrapper_cdp')[0].getBoundingClientRect().width;
            
            if (d3.event.pageX < map_width / 2) {
              d3.select("#tooltip-container")
                .style("top", (d3.event.layerY) + "px")
                .style("left", (d3.event.layerX) + "px");
            } else {
              var tooltip_width = $("#tooltip-container").width();
              d3.select("#tooltip-container")
                .style("top", (d3.event.layerY + 100) + "px")
                .style("left", (d3.event.layerX + 900) + "px");
            }
      })
      .on("mouseout", function(d) {
       $(this).attr("fill-opacity", "1.0");
                $("#tooltip-container").hide();
      })
        .on("click", function(d) {
          dispatch.countryEnter(d.country, d);
        }); 

  }
}


var countrySelected;
dispatch.on('countryEnter', function(d){
  if(countrySelected){      
      d3.select("#top_1").selectAll("rect[key=\'"+countrySelected+"\']").transition().duration(1000).style("fill", "orange");
      d3.select("#bottom_1").selectAll("circle[key=\'"+countrySelected+"\']").transition().duration(1000).style("fill", "orange");
      d3.select("#canvas-svg").select("path[title=\'"+countrySelected+"\']").transition().duration(1000).attr("fill", colormap);
      d3.select('#bottom_2').selectAll("circle[key=\'"+countrySelected+"\']").transition().duration(1000).attr("fill", "orange");
      document.getElementById('input_2').value = countrySelected;
    }
  if(countrySelected != d){
    d3.select("#top_1").selectAll("rect[key=\'"+d+"\']").transition().duration(1000).style("fill", "#ff0000");
    d3.select("#bottom_1").selectAll("circle[key=\'"+d+"\']").transition().duration(1000).style("fill", "#ff0000");
    d3.select("#canvas-svg").select("path[title=\'"+d+"\']").transition().duration(1000).attr("fill", "#ff0000");
    d3.select("#bottom_2").selectAll("circle[key=\'"+d+"\']").transition().duration(1000).attr("fill", "#ff0000");
    countrySelected = d;
      document.getElementById('input_2').value = countrySelected;
  }
  else{
    countrySelected = null;
  }
});