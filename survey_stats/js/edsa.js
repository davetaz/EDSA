// Define some variables to control our three charts. 
function isInt(n){
    return Number(n) === n && n % 1 === 0;
}

var map = dc.geoChoroplethChart('#map');
var involvementChart = dc.pieChart('#involvement-chart');
var sectorChart = dc.barChart('#sector-chart');

var skills = ['Big data', 'Open source tools and concepts', 'Data collection and analysis', 'Advanced computing and programming', 'Data interpretation and visualisation', 'Math and statistics', 'Machine learning and prediction', 'Business intelligence and domain expertise'];
skills.sort();
var training = ["Translated_from_English", "Coaching", "Assessed", "Internal_assignments", "Accredited", "Uses_nonopen_nonfree_software", "Webinars", "Tailored_to_sector", "Face_to_face_training", "eLearning"];
training.sort();

var charts = {};
for (i=0;i<skills.length;i++) {
    entry = skills[i];
    entry = entry.replace(/ /g,"_");
    charts[entry] = dc.barChart('#skills-' + entry + "-chart");
    charts["cap"+entry] = dc.pieChart('#capability-' + entry + "-chart")
}
for (i=0;i<training.length;i++) {
    entry = training[i];
    charts[entry] = dc.barChart('#training-' + entry + "-chart");
}
 
function getWords(all) {
    alltools = [];
    for (i=0;i<all.length;i++) {
        toolscsv = all[i]["tools"];
        items = toolscsv.split(',');
        for(j=0;j<items.length;j++){
            item = items[j];
            if(item != "") {
                if (!alltools[item]) {
                    alltools[item] = 0
                }
                alltools[item] += 1;
            }
        }
    }
    var sortable = [];
    for (tool in alltools) {
        sortable.push([tool,alltools[tool]])
    }
    sortable = sortable.sort(function(a, b){return a[1]-b[1]});
    max = 0;
    var words = [];
    for (i=sortable.length-1;i>0;i--) {
        item = sortable[i];
        tool = item[0];
        count = item[1];
        if (count > max) { max = count; }
        var obj = {};
        obj.text = tool;
        obj.size = Math.round(count/max * 40);
        words.push(obj);
    }
    return words;
}

function drawWordCloud(frequency_list) {
    document.getElementById("wordle").innerHTML="";
    var color = d3.scale.linear()
        .domain([0,1,2,3,4,5,6,10,15,20,100])
        .range(["#222","#333","#444","#555","#666","#777","#888","#999","#aaa","#bbb","#ccc","#ddd","#eee"]);
            
    d3.layout.cloud().size([800, 300])
        .words(frequency_list)
        .rotate(0)
        .padding(1)
        .text(function(d) { return d.text; })
        .fontSize(function(d) { return d.size; })
        .on("end", draw)
        .start();

    function draw(words) {
        d3.select("#wordle").append("svg")
                .attr("width", 530)
                .attr("height", 300)
                .attr("class", "wordcloud")
                .append("g")
                // without the transform, words words would get cutoff to the left and top, they would
                // appear outside of the SVG area
                .attr("transform", "translate(265,150)")
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", function(d) { return d.size + "px"; })
                .style("fill", function(d, i) { return color(i); })
                .attr("text-anchor", "middle")
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function(d) { return d.text; });
    }
}

d3.csv('https://odi-edsa-data.herokuapp.com/data.php', function (data) {
    var ndx = crossfilter(data);
    var all = ndx.groupAll();

    var tools = ndx.dimension(function(d) {
        return d.tools;
    });
    var toolsGroup = tools.group();
    function update_wordle() {
        words = getWords(tools.top(10000));
        drawWordCloud(words);
    }

    var involvement = ndx.dimension(function(d) {
        return d.Involvement;
    });
    
    var involvementGroup = involvement.group();

    involvementChart
        .on("filtered", update_wordle)
        .width(160)
        .height(160)
        .radius(80)
        .dimension(involvement)
        .group(involvementGroup)
        .ordinalColors(['blue', 'green','red','purple'])
        .label(function (d) {
            var label = d.key;
            return label;
        });
    
    var sector = ndx.dimension(function(d) {
        temp = d.Sector;
        if (temp.indexOf(" ") > 0) {
            temp = temp.substring(0,temp.indexOf(" "));
        }
        if (temp == "") {temp = "Unknown";}
        return temp;
    });
    
    var sectorGroup = sector.group();

    sectorChart 
        .on("filtered", update_wordle)
        .width(640)
        .height(380)
        .margins({top: 10, right: 10, bottom: 65, left: 24})
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .ordering(function(d) {
            return -d.value;
        })
        .brushOn(false)
        .xAxisLabel("Sectors")
        .yAxisLabel("No of people")
        .dimension(sector)
        .barPadding(0.1)
        .outerPadding(0.05)
        .group(sectorGroup);


    for (i=0;i<skills.length;i++) {
        entry = skills[i];
    	entry = entry.replace(/ /g,"_");
        var data = ndx.dimension(function(d) {
	    if (d["Skills_" + entry] == "") {
	    	return "" + d["Skills_" + entry];
	    }
            return d["Skills_" + entry];
        });
        var dataGroup = data.group();
        charts[entry]
            .on("filtered", update_wordle)
            .width(80)
            .height(180)
            .gap(0)
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .y(d3.scale.linear().range([0,180]).domain([0,22]))
            .margins({top: 0, right: 3, bottom: -1, left: -1})
            .group(dataGroup)
            .dimension(data)
            .colors(d3.scale.ordinal().domain(["","essential","desirable","not_required"]).range(['transparent','#3182bd', '#6baed6', '#9ecae1']))
            .colorAccessor(function(d) { 
                return d.key;
            })
            .label(function (d) {
                return d.key.replace(/_/g," ");
            })
            .title(function (d) {
                return d.value;
            })
            .elasticY(false)
            .yAxis().ticks(0);
    }

    for (i=0;i<skills.length;i++) {
        entry = skills[i];
	entry = entry.replace(/ /g,"_");
        var data = ndx.dimension(function(d) {
            num = d["capability_" + entry];
            if (num == "0" || num == "1" || num == "2" || num == "3" || num == "4") {
                return d["capability_" + entry];
            }
            return "no data";
        });
        var dataGroup = data.group();
        charts["cap" + entry]
            .on("filtered", update_wordle)
            .width(120)
            .height(120)
            .slicesCap(6)
            .innerRadius(20)
            .colors(d3.scale.ordinal().domain(["no data","0","1","2","3","4"]).range(['transparent','Lavender', 'CadetBlue', 'BlueViolet','DarkBlue','DarkRed']))
            .colorAccessor(function(d) { 
                return d.key;
            })
            .dimension(data)
            .group(dataGroup);
    }

    for (i=0;i<training.length;i++) {
        entry = training[i];
        var data = ndx.dimension(function(d) {
	    if (d["Training_" + entry] == "") {
	    	return "";
	    }
            return d["Training_" + entry];
        });
        var dataGroup = data.group();
        charts[entry]
            .on("filtered", update_wordle)
            .width(64)
            .height(180)
            .gap(0)
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .y(d3.scale.linear().range([0,180]).domain([0,22]))
            .margins({top: 0, right: 3, bottom: -1, left: -1})
            .group(dataGroup)
            .dimension(data)
            .colors(d3.scale.ordinal().domain(["","essential","desirable","not_required"]).range(['transparent','#3182bd', '#6baed6', '#9ecae1']))
            .colorAccessor(function(d) { 
                return d.key;
            })
            .label(function (d) {
                return d.key.replace(/_/g," ");
            })
            .title(function (d) {
                return d.value;
            })
            .elasticY(false)
            .yAxis().ticks(0);
	var rect = charts[entry].selectAll("rect");
		
	rect.attr("width", function(d) {console.log("hello" + d);});
    }

    var countries = ndx.dimension(function(d) {
        return d.Country;
    });
    var countryGroup = countries.group();

    d3.json("js/eu.geo.json", function (mapJson) {
        map
            .on("filtered", update_wordle)     
            .width(500)
            .height(365)
            .dimension(countries)
            .group(countryGroup)
            .projection(d3.geo.mercator()
                .translate([120,700])
                .scale(500)
            )
            .colors(d3.scale.quantize().range(["#0061B5", "#C4E4FF"]))
            .colorDomain([0, 200])
            .colorCalculator(function (d) { return d ? map.colors()(d) : '#ccc'; })
            .overlayGeoJson(mapJson.features, "name", function (d) {
                return d.properties.name;
            })
        words = getWords(tools.top(10000));
        drawWordCloud(words);
        dc.renderAll();
    });


});


