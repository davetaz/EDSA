var assignedColors = {};
var skillColors =  [];

function getSkillColor(name) {
	if (assignedColors[name]) {
		return assignedColors[name];
	} 
	assignedColors[name] = skillColors.pop();
	return assignedColors[name];
}

function skillsChart(iso2,type) {
	$('#skillsTitle').html(type + " demand (LinkedIn)");
	var prefix = "data/harvester/search_results/linkedin/";
	type = type.replace(/ /g,"_").toLowerCase();
	iso2 = iso2.toLowerCase();
	var source = prefix + type + "/" + iso2 + ".csv";
	$('#skillsChart').html("");

	assignedColors = {};

	skillColors =  ["#730100","#530100","#930100","#a30100","#c30100","#830100","#630100","#b30100"];
	skillColors = skillColors.reverse();
		
	var margin = {top: 20, right: 20, bottom: 30, left: 50},
	    width = 960 - margin.left - margin.right,
	    height = 200 - margin.top - margin.bottom;

	var formatPercent = d3.format(".0%");

	var x = d3.time.scale()
		.range([0, width]);

	var y = d3.scale.linear()
		.range([height, 0]);

	var color = d3.scale.category20();

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	var area = d3.svg.area()
		.x(function(d) { return x(d.date); })
		.y0(function(d) { return y(parseInt(d.y0)); })
		.y1(function(d) { return y(parseInt(d.y0) + parseInt(d.y)); });

	var stack = d3.layout.stack()
		.values(function(d) { return d.values; });

	var svg = d3.select("#skillsChart").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.csv(source, function(error, data) {
		if(error) {
			$('#skillsChart').html('<div id="noSkillData">No Data Available</div>');
			return;
		}
		color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

		data.forEach(function(d) {
			var format = d3.time.format("%Y-%m-%d");
			d.date = format.parse(d.date);
		});

		var skills = stack(color.domain().map(function(name) {
			return {
				name: name,
				values: data.map(function(d) {
					return {date: d.date, y: parseInt(d[name])};
				})
			};
		}));

		x.domain(d3.extent(data, function(d) { return d.date; }));
		y.domain([0,d3.max(skills, function(c) {
			return d3.max(c.values, function(d) { return d.y0 + d.y});
		})]);

		var skill = svg.selectAll(".skill")
			.data(skills)
			.enter().append("g")
			.attr("class", "skill");
	
		skill.append("path")
			.attr("class", "area")
			.attr("d", function(d) { return area(d.values); })
			.style("fill", function(d) { return getSkillColor(d.name); });

		skill.append("text")
			.datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1] } ;})
			.attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.y0 + d.value.y / 2) + ")"; })
			.attr("x", -6)
			.attr("dy", ".35em")
			.style("fill","white")
			.text(function(d) { if (d.value.y > 100) return d.name; });
	
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.style("fill", function(j, i){if (print) {return "black";} else {return "white";}})
//			.style("fill","white")
			.call(xAxis);

		svg.append("g")
			.attr("class", "y axis")
			.style("fill", function(j, i){if (print) {return "black";} else {return "white";}})
//			.style("fill","white")
			.call(yAxis);
	});
}
