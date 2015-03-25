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

function drawMap(error, world, names, data, print) {
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
	for (k=0;k<10;k++) {
		var tryit2 = data.filter(function(n) { return d.ISO2 == n.ISO2;})[k];
		if (typeof tryit2 !== "undefined") {
			d.data[tryit2["Type"]] = tryit2;
		}
	}
    });

    var country = svg.selectAll(".country").data(out_countries);

    country
     .enter()
      .insert("path")
      .attr("class", "country")
      .attr("title", function(d,i) { return d.Country; })
      .attr("d", path)
      .style("fill", function(d, i) { return getColor(d); });

    //Show/hide tooltip
    country
      .on("mousemove", function(d,i) {
      })
      .on("click", function(d,i) {
        document.getElementById("country").innerHTML = d.name;
        drawStatsObject(d.data);
	skillsChart(d.ISO2,"general");
        zoomTo(d);
      })
      .on("mouseout",  function(d,i) {
//        tooltip.classed("hidden", true)
      });
}

function redraw() {
    svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

function getColor(d,i){
//	console.log("IN HERE");
	var overlayHueMin = 0.52,
	overlayHueMax = 0.53,
	overlaySatMin = 0.8,
	overlaySatMax = 1,
	overlayValMin = 0.22,
	overlayValMax = 0.23;

	if (d.data["Capability"] === undefined) {
		return d3.rgb(255,255,255);
	} else {
		console.log(d);
		var p = d.data["Capability"]["Rank_Scaled"] / 40;
		var h = overlayHueMin + p * (overlayHueMax - overlayHueMin);
		var s = overlaySatMin + p * (overlaySatMax - overlaySatMin);
		var v = overlayValMin + p * (overlayValMax - overlayValMin);
		return d3.hsl(h,s,v);
	}
}

function zoomTo(d) {
	
	var x, y, k;

	if (d && centered !== d) {
		var centroid = path.centroid(d);
		x = centroid[0];
		y = centroid[1];
		if (path.area(d) > 2000) {
			k = 2;
		} else if (path.area(d) > 1000) {
			k = 4;
		} else if (path.area(d) > 750) {
			k = 8;
		} else if (path.area(d) > 500) {
			k = 8;
		} else if (path.area(d) > 250) {
			k = 10;
		} else if (path.area(d) < 250) {
			k = 12;
		}
		centered = d;
	} else {
		x = width / 2;
		y = height / 2;
		k = 1;
		centered = null;
	}

	svg.selectAll("path")
		.classed("active", centered && function(d) { return d === centered; });

	svg.transition()
		.duration(750)
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
		.style("stroke-width", 1.5 / k + "px");
}
