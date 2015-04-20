// The SVG container
var width  = 560,
    height = 400;

var projection = d3.geo.azimuthalEqualArea()
//var projection = d3.geo.mercator()
                .translate([150, 850])
                .scale(750);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(d3.behavior.zoom()
    .on("zoom", redraw))
    .append("g");

function drawMap(error, world, names , print) {
    var countries = topojson.object(world, world.objects.countries).geometries,
        neighbors = topojson.neighbors(world, countries),
        i = -1,
	out_countries = [];
        n = countries.length;

    countries.forEach(function(d) {
        d.data = {};
        var tryit = names.filter(function(n) { return d.id == n.id; })[0];
	if (typeof tryit !== "undefined"){
	   d.name = tryit.name;
	   d.ISO2 = tryit.ISO2;
	   out_countries.push(d);
        }
    });

    var country = svg.selectAll(".country").data(out_countries);

    country
     .enter()
      .insert("path")
      .attr("class", "country")
      .attr("title", function(d,i) { return d.Country; })
      .attr("d", path)
      .style("stroke", "#730100");

    //Show/hide tooltip
    country
      .on("mousemove", function(d,i) {
      })
      .on("click", function(d,i) {
        document.getElementById("mapCName").innerHTML = d.name;
      	data["country"]["ISO2"] = d.ISO2;
        data["country"]["name"] = d.name;
	d3.select(".selected").classed("selected",false);
	d3.select(this).classed("selected",true);
      })
      .on("mouseout",  function(d,i) {
//        tooltip.classed("hidden", true)
      });
}

function redraw() {
    svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

function getColor(d,i){
	return "#FFFFFF";
}
