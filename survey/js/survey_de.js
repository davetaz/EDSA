var data = {};
var lang = "index_de.html";
var api_url = "http://odi-edsa-data.herokuapp.com/";
var rightNow = new Date();
var res = rightNow.toISOString().slice(0,10).replace(/-/g,"");
data["date"] = res;
data["skills"] = {};
data["training"] = {};
data["country"] = {};
data["skills"]["not_required"] = {};
data["skills"]["nice_to_have"] = {};
data["skills"]["essential"] = {};
data["skills"]["capcap"] = {};
data["training"]["not_required"] = {};
data["training"]["nice_to_have"] = {};
data["training"]["essential"] = {};

var QueryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = pair[1];
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]], pair[1] ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(pair[1]);
    }
  } 
    return query_string;
} ();

$( document ).ready(function() {
	wakeServer();
        updateLanguageSwitcher();
	setTimeout(function() {$(".dropdown dt a").show();$('#country-select').show();},2000);
	setID();
	data["country"]["ISO2"] = QueryString.ISO2;
	data["country"]["name"] = QueryString.name;
	addMap();
	populateForms();
	updateForm();
	addListeners();
});

function wakeServer() {
	$.get("http://odi-edsa-data.herokuapp.com/wake.php",function(data) {
		console.log("server pinged");
	});
}

function addMap() {
	queue()
	    .defer(d3.json, "../data/world-50m.json") 
            .defer(d3.csv, "../data/eu-country-names.csv") 
	    .await(drawMap);
}

function addListeners() {
	$('#next').click(function() {
		processForm();
	});
	$('div','#sectorsel').each(function(){
		$(this).click(function() {
			processSector($(this).attr('id'));
		});
	});
	$('div','#involvement').each(function(){
		$(this).click(function() {
			processInvolvement($(this).attr('id'));
		});
	});
	$('#addnotID').click(function() {
		addElement($(this).attr('id'));
	});
	$('#addniceID').click(function() {
		addElement($(this).attr('id'));
	});
	$('#addessentialID').click(function() {
		addElement($(this).attr('id'));
	});
	$('#addtrainingNotID').click(function() {
		addElement($(this).attr('id'));
	});
	$('#addtrainingNiceID').click(function() {
		addElement($(this).attr('id'));
	});
	$('#addtrainingEssentialID').click(function() {
		addElement($(this).attr('id'));
	});
	$('#addsectorsel').click(function() {
		addElement($(this).attr('id'));
	});
}

function mremove(id) {
	console.log(id);
	$("#"+id).fadeOut(function() { 
		$("#"+id).remove();
	});
	$("#capcap_"+id).fadeOut(function() { 
		$("#capcap_"+id).remove();
	});
	
}

function addElement(id) {
	id = id.replace("add","");
	Ply.dialog('prompt', {
		title: 'Add',
		form: { name: 'Name' }
	}).done(function (ui) {
		var el = document.createElement('div');
		var outid = ui.data.name
		outid = outid.replace(" ","_");
		el.innerHTML = ui.data.name + '<i class="js-remove" onClick="mremove(\''+outid+'\');">✖</i>';
		el.setAttribute("id",outid);
		console.log(id);
		console.log(el);
		document.getElementById(id).appendChild(el);
		//addToCapCap("capcap_"+id,outid,ui.data.name,50,50);
		updateForm();
		addListeners();
	});
}


function processSector(sector) {
	$('div','#sectorsel').each(function(){
		$(this).removeClass("selected");
	});
	$("#" + sector).addClass("selected");	
	data["Sector"] = sector;
}
function processInvolvement(sector) {
	$('div','#involvement').each(function(){
		$(this).removeClass("selected");
	});
	$("#" + sector).addClass("selected");	
	data["Involvement"] = sector;
}


function updateForm() {
	processUpdate('essentialID');
	processUpdate('niceID');
	processUpdate('notID');
}
function populateForms() {
	if (data["country"]["name"]) {
		$('#countryName').html("for " + decodeURIComponent(data["country"]["name"]));
		$('#countryName').fadeIn();
		$('#pickCountry').remove();
		$('#google_translate_element').hide();	
	}
	addToForm('sectorsel','Agriculture','Landwirtschaft');
	addToForm('sectorsel','Mining','Bergbau');	
	addToForm('sectorsel','Manufacturing','Produktion');
	addToForm('sectorsel','Energy','Energie');
	addToForm('sectorsel','Water and waste management','Wasser- und Abfallwirtschaft');
	addToForm('sectorsel','Construction','Bau- und Ingenieurswesen');
	addToForm('sectorsel','Wholesale and retail','Verbraucherdienste');
	addToForm('sectorsel','Transport','Verkehr');
	addToForm('sectorsel','Accommodation and food services','Hotel und Gastwirtschaft');
	addToForm('sectorsel','Media and Advertising','Medien und Werbung');
	addToForm('sectorsel','Data and Information Systems','Daten- und Informationssysteme');
	addToForm('sectorsel','Finance, Insurance and Real Estate','Finanzen, Versicherungen und Immobilien');
	addToForm('sectorsel','Professional services','Professionelle Dienste');
	addToForm('sectorsel','Scientific and market research','Wissenschaftliche und Marktforschung');
	addToForm('sectorsel','Business administration services','Unternehmensverwaltung');
	addToForm('sectorsel','Tourism','Tourismus');
	addToForm('sectorsel','Public administration and defence','Öffentliche Verwaltung, Verteidigung');
	addToForm('sectorsel','Government and public sector', 'Regierung und öffentlicher Sektor');
	addToForm('sectorsel','Education', 'Bildung');
	addToForm('sectorsel','Human health and social work', 'Gesundheits- und Sozialarbeit');
	addToForm('sectorsel','Arts, recreation and entertainment', 'Kunst , Erholung und Unterhaltung');
	addToForm('sectorsel','Consumer services', 'Verbraucherdienste');

        addToForm('orgtypesel','Micro (less than 10 employees)','Micro (<10 Mitarbeiter)');
        addToForm('orgtypesel','SME (10 to 250 employees)','SME (10 to 250 Mitarbeiter)');
        addToForm('orgtypesel','Large (250 or more employees)','Groß (250+ Mitarbeiter)');

	
//	addToForm('involvement','No involvement','Kein Bezug');
//	addToForm('involvement','I work with data scientists but am not one myself','Ich arbeite mit Data Scientists, bin selbst aber keiner');
	addToForm('involvement','I manage data scientists','Ich manage Data Scientists');
	addToForm('involvement','I am a practicing data scientist but with gaps in certain areas (e.g. statistics)','Ich bin praktizierender Data Scientist');
//	addToForm('involvement','My primary role is not data science by I practice occasionally','Ich arbeite gelegentlich als Data Scientist, es ist aber nicht meine Hauptaufgabe');
//	addToForm('involvement','I am a practicing data scientist but with gaps in certain areas (e.g. statistics)','Ich bin praktizierender Data Scientist, habe aber Lücken in bestimmten Bereichen (z.B. Statistik)');
//	addToForm('involvement','I am a practicing data scientist with excellent knowledge in all areas','Ich bin ein praktizierender Daten Wissenschaftler mit hervorragenden Kenntnissen in allen Bereichen');

	addToForm('pickID','Scientific method','Wissenschaftliche Methodik');
	addToForm('pickID','Open source tools and concepts','Open-Source- Werkzeuge und Konzepte');
	addToForm('pickID','Data collection and analysis','Datensammlung und -analyse');
	addToForm('pickID','Advanced computing and programming','Fortgeschrittene Programmierung');
	addToForm('pickID','Data interpretation and visualisation','Interpretation und Datenvisualisierung');
	addToForm('pickID','Math and statistics','Mathematik und Statistik');
	addToForm('pickID','Machine learning','Maschinelles Lernen');
	addToForm('pickID','Business intelligence and domain expertise','Business-Intelligence und Fachwissen');
	
	addToForm('trainingPickID','Face to face training','Face-to-face Training');
	addToForm('trainingPickID','Webinars','Webinare');
	addToForm('trainingPickID','eLearning','eLearning');
	addToForm('trainingPickID','Translated from English','Übersetzt aus dem Englischen');
	addToForm('trainingPickID','Tailored to sector','Auf den Sektor zugeschnitten');
	addToForm('trainingPickID','Accredited','Akkreditiert');
	addToForm('trainingPickID','Uses non-open, non-free software','Verwendung nicht-offener, nicht-freier Software');
	addToForm('trainingPickID','Coaching','Coaching');
	addToForm('trainingPickID','Assessed','Bewertet');
	addToForm('trainingPickID','Internal assignments','Interne Aufgaben');

        addToLinkList('toolsListeg','AWS','toolsList');
        addToLinkList('toolsListeg','Spark','toolsList');
        addToLinkList('toolsListeg','Hadoop / MapReduce','toolsList');
        addToLinkList('toolsListeg','MongoDB','toolsList');
        addToLinkList('toolsListeg','Open Refine','toolsList');
        addToLinkList('toolsListeg','QMiner','toolsList');
        addToLinkList('toolsListeg','Apache Flink','toolsList');
        addToLinkList('toolsListeg','Apache Storm','toolsList');
        addToLinkList('toolsListeg','ProM or Disco','toolsList');
        addToLinkList('toolsListeg','NoSQL / Cassandra','toolsList');
        addToLinkList('toolsListeg','R','toolsList');
        addToLinkList('toolsListeg','Python','toolsList');
        addToLinkList('toolsListeg','Javascript / JQuery','toolsList');
        addToLinkList('toolsListeg','D3 / nvD3','toolsList');
        addToLinkList('toolsListeg','Java','toolsList');
        addToLinkList('toolsListeg','z-scores','toolsList');
	
}

function addTool() {
        if ($('#tool').val() != "") {
                addToList('toolsList',$('#tool').val());
                $('#tool').val("");
        }
}

function addToList(id,item) {
        itemID = item.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"");
        itemID = itemID.replace(/\s{2,}/g," ");
        itemID = itemID.replace(/ /g,"_");
        insert = '<tli id="' + itemID + '" name="'+item+'">' + item + ' (<remove onClick="$(this).parent().remove();">remove</remove>)</tli>';
        $('#'+id).append(insert);
}

function addToLinkList(id,item,target) {
        itemID = item.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"");
        itemID = itemID.replace(/\s{2,}/g," ");
        itemID = itemID.replace(/ /g,"_");
        $('#'+id).append('<tli id="' + itemID + '" onclick="addToList(\''+target+'\',\''+item+'\'); $(this).fadeOut();">' + item + '</tli>');
}

function addToForm(id,item,text) {
	help = false;
	if (id == "essentialID" || id == "niceID" || id == "notID") {
		help = true;
	}
	prefix = "";
	if (id == 'sectorsel') {
		prefix = "";
	}
	itemID = item.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"");
	itemID = itemID.replace(/\s{2,}/g," ");
	itemID = itemID.replace(/ /g,"_");
	if (prefix != "") {
		itemID = prefix + "_" + itemID;
	}
	if (help) {
		$('#'+id).append('<div id="'+itemID+'">'+text+' <a class="helpIcon" href="#" onClick="showMiniHelp(\''+text+'\');">?</a></div>');	
	} else {
		$('#'+id).append('<div id="'+itemID+'">'+text+'</div>');	
	}
}

function processUpdate(inid) {
    $('#capcap').fadeOut(function() {
        $('div','#'+inid).each(function(){
       	  id = $(this).attr('id');
	  el = $('#' + id);
	  value = el.html();
	  capacity = $('#capacity_' + id).val();
	  capability = $('#capability_' + id).val();
	  $('#capcap_'+id).remove();
	  addToCapCap(inid,id,value,capacity,capability);
        });
	toggleSetup();
        $('#capcap').fadeIn();
    });
	
}

function addToCapCap(inid,id,value,capacity,capability) {
	var html = '<table id="capcap_'+id+'" class="capcaptable" width="100%"><tr><td width="20%">'+value+'</td><td width="80%"><label class="caplabel">Fähigkeit</label>';
	html += '<div class="toggle-btn-grp joint-toggle">';
	for (i=0;i<5;i++) {
		html += '<label class="toggle-btn"><input type="radio" id="capability_'+id+'" name="capability_'+id+'" value="'+i+'" onClick="processCapIn(\'capability\',\''+id+'\','+i+');"/>'+i+'</label>';	
	}
	html += '</div>';
	html += '<br/>';
	html += '<label class="caplabel">Kapazität</label>';
	html += '<div class="toggle-btn-grp joint-toggle">';
	for (i=0;i<5;i++) {
		html += '<label class="toggle-btn"><input type="radio" id="capacity_'+id+'" name="capacity_'+id+'" value="'+i+'" onClick="processCapIn(\'capacity\',\''+id+'\','+i+');"/>'+i+'</label>';	
	}
	html += '</div>';
	html += '</td></tr></table>';
	$('#capcap_'+inid).append(html);
}

function processCapIn(type,id,value) {	
	data["skills"]["capcap"][type + "_" + id] = value;
}

function cacheData() {
	data["skills"]["not_required"] = new Array();
	data["skills"]["nice_to_have"] = new Array();
	data["skills"]["essential"] = new Array();
	data["training"]["not_required"] = new Array();
	data["training"]["nice_to_have"] = new Array();
	data["training"]["essential"] = new Array();
	data["tools"] = new Array();
	
	$('div','#notID').each(function(){
		localid = $(this).attr('id');
		data["skills"]["not_required"].push(localid);
	});	
	$('div','#niceID').each(function(){
		localid = $(this).attr('id');
		data["skills"]["nice_to_have"].push(localid);
	});	
	$('div','#essentialID').each(function(){
		localid = $(this).attr('id');
		data["skills"]["essential"].push(localid);
	});

	$('#toolsList tli').each(function(i) { 
		data["tools"].push($(this).attr('name')); 
	});

	$('div','#trainingNotID').each(function(){
		data["training"]["not_required"].push($(this).attr('id')); 
	});	
	$('div','#trainingNiceID').each(function(){
		data["training"]["nice_to_have"].push($(this).attr('id')); 
	});	
	$('div','#trainingEssentialID').each(function(){
		data["training"]["essential"].push($(this).attr('id')); 
	});
	data["comments"] = $('#comments').val();
	data["contact"] = {};
	data["contact"]["name"] = $('#fullname').val();
	data["contact"]["email"] = $('#email').val();
	data["contact"]["research"] = $('#contact_research').prop("checked");
	data["contact"]["results"] = $('#contact_results').prop("checked");

	return data;
}

function setID() {
        $.get( api_url + "create_id.php", function( ret ) {
                data["_id"] = ret;
        })
        .fail( function() {
                setTimeout(function() {setID();},10000);
        });
}

function processForm(form) {
	if (data["_id"] == "") {
		return;
	}
	$('[id=submit]').attr("disabled",true);
	$('[id=submit]').html("Processing");
	data = cacheData();	

	var tmp = JSON.stringify(data);
	// tmp value: [{"id":21,"children":[{"id":196},{"id":195},{"id":49},{"id":194}]},{"id":29,"children":[{"id":184},{"id":152}]},...]
	$.ajax({
		type: 'POST',
		url: 'http://odi-edsa-data.herokuapp.com/store.php',
		data: {'data': tmp},
		success: function(msg) {
			$('[id=doneSection]').html('Your data has been submitted successfully');
			console.log("success posted");
		},
		fail: function(msg) {
			$('[id=doneSection]').html('There was an error, please <a href="mailto:training@theodi.org?&subject=EDSA%20Result&body='+encodeURIComponent(tmp)+'">click here</a> to email your result to us.');
		}
	});
}

function showMiniHelp(id) {
        $("#miniHelpFrame").attr('src','../help.html?id='+id);
        $("#miniHelp").fadeIn();
}
function hideMiniHelp() {
        $("#miniHelp").fadeOut();
}
function toggleSetup() {
    $(".toggle-btn:not('.noscript') input[type=radio]").addClass("visuallyhidden");
    $(".toggle-btn:not('.noscript') input[type=radio]").change(function() {
    if( $(this).attr("name") ) {
        $(this).parent().addClass("success").siblings().removeClass("success")
    } else {
        $(this).parent().toggleClass("success");
    }
});
}
