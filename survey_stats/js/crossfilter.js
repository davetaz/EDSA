// Define some variables to control our three charts. 
function isInt(n){
    return Number(n) === n && n % 1 === 0;
}

var map = dc.geoChoroplethChart('#map');
var involvementChart = dc.pieChart('#involvement-chart');
var sectorChart = dc.barChart('#sector-chart');

var skills = ["Advanced_computing", "Machine_learning", "Open_Culture", "Scientific_method", "Math_and_statistics", "Data_visualisation", "Domain_expertise", "Data_skills"];
skills.sort();
var training = ["Translated_from_English", "Coaching", "Assessed", "Internal_assignments", "Accredited", "Uses_nonopen_nonfree_software", "Webinars", "Tailored_to_sector", "Face_to_face_training", "eLearning"];
training.sort();

var charts = {};
for (i=0;i<skills.length;i++) {
    entry = skills[i];
    charts[entry] = dc.barChart('#skills-' + entry + "-chart");
    charts["cap"+entry] = dc.pieChart('#capability-' + entry + "-chart")
}
for (i=0;i<training.length;i++) {
    entry = training[i];
    charts[entry] = dc.barChart('#training-' + entry + "-chart");
}
 
d3.csv('../data/online_survey_data/crossfilter.csv', function (data) {
    var ndx = crossfilter(data);
    var all = ndx.groupAll();

    var involvement = ndx.dimension(function(d) {
        return d.Involvement;
    });
    
    var involvementGroup = involvement.group();
   
    involvementChart
        .width(180)
        .height(180)
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
        if (temp.indexOf("_") > 0) {
            temp = temp.substring(0,temp.indexOf("_"));
        }
        return temp;
    });
    
    var sectorGroup = sector.group();

    sectorChart 
        .width(768)
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
        var data = ndx.dimension(function(d) {
            return d["Skills_" + entry];
        });
        var dataGroup = data.group();
        charts[entry]
            .width(80)
            .height(180)
            .gap(0)
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .y(d3.scale.linear().range([0,180]).domain([0,22]))
            .margins({top: 0, right: 3, bottom: -1, left: -1})
            .group(dataGroup)
            .dimension(data)
            .colors(d3.scale.ordinal().domain(["essential","nice_to_have","not_required"]).range(['#3182bd', '#6baed6', '#9ecae1']))
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
        var data = ndx.dimension(function(d) {
            num = d["capability_" + entry];
            if (num == "0" || num == "1" || num == "2" || num == "3" || num == "4") {
                return d["capability_" + entry];
            }
            return;
        });
        var dataGroup = data.group();
        charts["cap" + entry]
            .width(120)
            .height(120)
            .slicesCap(5)
            .innerRadius(20)
            .colors(d3.scale.ordinal().domain(["0","1","2","3","4"]).range(['Lavender', 'CadetBlue', 'BlueViolet','DarkBlue','DarkRed']))
            .colorAccessor(function(d) { 
                return d.key;
            })
            .dimension(data)
            .group(dataGroup);
    }

    for (i=0;i<training.length;i++) {
        entry = training[i];
        var data = ndx.dimension(function(d) {
            return d["Training_" + entry];
        });
        var dataGroup = data.group();
        charts[entry]
            .width(64)
            .height(180)
            .gap(0)
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .y(d3.scale.linear().range([0,180]).domain([0,22]))
            .margins({top: 0, right: 3, bottom: -1, left: -1})
            .group(dataGroup)
            .dimension(data)
            .colors(d3.scale.ordinal().domain(["essential","nice_to_have","not_required"]).range(['#3182bd', '#6baed6', '#9ecae1']))
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


    var countries = ndx.dimension(function(d) {
        return d.Country;
    });
    var countryGroup = countries.group();

    d3.json("js/eu.geo.json", function (mapJson) {
        map     
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
        dc.renderAll();
    });


});


