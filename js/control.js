// The SVG container
var width  = 850,
    height = 400;

var color = d3.scale.category10();
var data = {};
var print = false;
var current = {};

$.ajaxSetup ({
    // Disable caching of AJAX responses
    cache: false
});

$(document).ready(function() {
	queue()
	    .defer(d3.json, "data/world-50m.json") 
            .defer(d3.csv, "data/eu-country-names.csv") 
	    .defer(d3.csv, "data/test-data.csv")
	    .await(drawMap);
});

$(document).keypress(function(e) {
	if (e.which == 112 && print) {
		print = false;
		$("body").css('background-color','#404040');
		$("body").css('color','#eee');
		$("#credit > a").css('color','#eee');
		$(".logoimg").attr("src","img/ODB_white.png");
		$("#githubimg").attr("src","img/github-128_white.png");
		$("#helpimg").attr("src","img/help_white.png");
		drawStatsObject(current);
	} else if (e.which == 112 && !print) {
		print = true;
		$("body").css('background-color','white');
		$("body").css('color','#111');
		$("#credit > a").css('color','#111');
		$(".logoimg").attr("src","img/ODB_black.png");
		$("#githubimg").attr("src","img/github-128_black.png");
		$("#helpimg").attr("src","img/help_black.png");
		drawStatsObject(current);
	}
});
var legendVals = {};

function drawKey(d) {
	$('#legend').html("");
	keys = Object.keys(d);
	if (legendVals["Capability"] === undefined) {
		for (i=0;i<keys.length;i++) {
			text = keys[i];
			legendVals[text] = true;
		}
	}
	for (item in legendVals) {
		if (legendVals[item]) {
			var output = '<input type="checkbox" checked="'+legendVals[item]+'" id="' + item + '" onClick="toggle(\''+item+'\');"/>' + item + '<br/>';
		} else {
			var output = '<input type="checkbox" id="' + item + '" onClick="toggle(\''+item+'\');"/>' + item + '<br/>';
		}
		$('#legend').append(output);
	}
}

function toggle(id) {
	if (legendVals[id]) {
		legendVals[id] = false;
	} else {
		legendVals[id] = true;
	}
	drawStatsObject(current);
}

function drawStatsObject(d) {
	current = d;
	drawKey(d);
	var iso2 = d["Capability"]["ISO2"];
	var top = [];
	var keys = Object.keys(d["Capability"]).reverse();
	if (legendVals["Capability"]) {
		top.push(getValues(d["Capability"],keys));
	}
	if (legendVals["Capacity"]) { 
		top.push(getValues(d["Capacity"],keys));
	}
	RadarChart.draw("#radar", top, iso2, 0, print);
}
function getValues(d,keys) {
	var data = [];
	var ignore = ["Country","Type","ISO2","Rank Scaled"];
	for (j=0;j<keys.length;j++){
		var obj = {};
		key = keys[j].replace(/_/g," ");
		if (ignore.indexOf(key) < 0) {
			obj.axis = key;
			obj.value = d[keys[j]] / 4;
			data.push(obj);
		}
	}
	return data;
}
function showSurvey(ISO2,name) {
        $("#surveyFrame").attr('src','survey/index.html?ISO2='+ISO2+'&name='+name);
        $("#surveyBox").fadeIn();
}
function hideSurvey() {
        $("#surveyBox").fadeOut();
}
function showMiniHelp(id) {
        $("#miniHelpFrame").attr('src','help.html?id='+id);
        $("#miniHelp").fadeIn();
}
function hideMiniHelp() {
        $("#miniHelp").fadeOut();
}

