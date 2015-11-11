var data = {};
var lang = "index.html";
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
	setTimeout(function() {$(".dropdown dt a").show();$('#country-select').show();},1000);
	setID();
	$('#Q6_Question_2').hide();
	data["country"]["ISO2"] = QueryString.ISO2;
	data["country"]["name"] = QueryString.name;
	addMap();
	populateForms();
	updateForm();
	addListeners();
	lang = getUrlVars()["lang"];
	if (lang) { translate(lang); }
});

function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}

function translate(code) {
	$.get("data/languages.json", function(data) {
		lang = data[code];
		$.each(lang, function(key,val) {
			if (val) {
				$('[id=' + key + ']').html(val);
				$('[name=' + key + ']').html(val);
			}
		});
	});
}

function wakeServer() {
	$.get("http://odi-edsa-data.herokuapp.com/wake.php",function(data) {
		//console.log("server pinged");
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
	$('div','#orgtypesel').each(function(){
		$(this).click(function() {
			processOrgtype($(this).attr('id'));
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
	$('#addorgtypesel').click(function() {
		addElement($(this).attr('id'));
	});
}

function mremove(id) {
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
function processOrgtype(sector) {
	$('div','#orgtypesel').each(function(){
		$(this).removeClass("selected");
	});
	$("#" + sector).addClass("selected");	
	data["OrgType"] = sector;
}
function processInvolvement(sector) {
	$('div','#involvement').each(function(){
		$(this).removeClass("selected");
	});
	$("#" + sector).addClass("selected");	
	data["Involvement"] = sector;
	if (data["Involvement"] == "I_am_a_data_scientist") {
		$('#Q6_Question_1').show();
		$('#Q6_Question_2').hide();
	} else {
		$('#Q6_Question_1').hide();
		$('#Q6_Question_2').show();
	}
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

    addToForm('sectorsel','Agriculture','Q4_Option_1');
    addToForm('sectorsel','Mining','Q4_Option_2');
    addToForm('sectorsel','Manufacturing','Q4_Option_3');
    addToForm('sectorsel','Energy','Q4_Option_4');
    addToForm('sectorsel','Water and waste management','Q4_Option_5');
    addToForm('sectorsel','Construction','Q4_Option_6');
    addToForm('sectorsel','Transport','Q4_Option_7');
    addToForm('sectorsel','Accommodation and food services','Q4_Option_8');
    addToForm('sectorsel','Media','Q4_Option_9');
    addToForm('sectorsel','Data and information systems','Q4_Option_10');
    addToForm('sectorsel','Finance and insurance services','Q4_Option_11');
    addToForm('sectorsel','Real Estate','Q4_Option_12');
    addToForm('sectorsel','Professional services','Q4_Option_13');
    addToForm('sectorsel','Scientific and market research','Q4_Option_14');
    addToForm('sectorsel','Business administration services','Q4_Option_15');
    addToForm('sectorsel','Tourism','Q4_Option_16');
    addToForm('sectorsel','Public administration and defence','Q4_Option_17');
    addToForm('sectorsel','Education','Q4_Option_18');
    addToForm('sectorsel','Human health and social work','Q4_Option_19');
    addToForm('sectorsel','Arts, recreation and entertainment','Q4_Option_20');
    addToForm('sectorsel','Consumer services','Q4_Option_21');
    addToForm('sectorsel','Wholesale and retail','Q4_Option_22');
	
	addToForm('orgtypesel','Individual','Q3_Option_1');
	addToForm('orgtypesel','Micro (less than 10 employees)','Q3_Option_2');	
	addToForm('orgtypesel','SME (10 to 250 employees)','Q3_Option_3');	
	addToForm('orgtypesel','Large (250 or more employees)','Q3_Option_4');

	addToForm('involvement','I am a data scientist','Q2_Option_1');
	addToForm('involvement','I manage data scientists','Q2_Option_2');
/*	
	addToForm('involvement','No involvement');
	addToForm('involvement','I work with data scientists but am not one myself');
	addToForm('involvement','I manage data scientists');
	addToForm('involvement','My primary role is not data science by I practice occasionally');
	addToForm('involvement','I am a practicing data scientist but with gaps in certain areas (e.g. statistics)');
	addToForm('involvement','I am a practicing data scientist with excellent knowledge in all areas');
*/

	addToForm('pickID','Big data','Q5_Option_1');
	addToForm('pickID','Open source tools and concepts','Q5_Option_8');
	addToForm('pickID','Data collection and analysis','Q5_Option_3');
	addToForm('pickID','Advanced computing and programming','Q5_Option_6');
	addToForm('pickID','Data interpretation and visualisation','Q5_Option_5');
	addToForm('pickID','Math and statistics','Q5_Option_4');
	addToForm('pickID','Machine learning and prediction','Q5_Option_2');
	addToForm('pickID','Business intelligence and domain expertise','Q5_Option_7');
	
	addToForm('trainingPickID','Face to face training','Q8_Option_1');
	addToForm('trainingPickID','Webinars','Q8_Option_2');
	addToForm('trainingPickID','eLearning','Q8_Option_3');
	addToForm('trainingPickID','Translated from English','Q8_Option_4');
	addToForm('trainingPickID','Tailored to sector','Q8_Option_5');
	addToForm('trainingPickID','Accredited','Q8_Option_6');
	addToForm('trainingPickID','Uses non-open, non-free software','Q8_Option_7');
	addToForm('trainingPickID','Coaching','Q8_Option_8');
	addToForm('trainingPickID','Assessed','Q8_Option_9');
	addToForm('trainingPickID','Internal assignments','Q8_Option_10');	

	addToLinkList('toolsListeg','AWS','toolsList','Q7_Option_1');
	addToLinkList('toolsListeg','Spark','toolsList','Q7_Option_2');
	addToLinkList('toolsListeg','Hadoop / MapReduce','toolsList','Q7_Option_3');
	addToLinkList('toolsListeg','MongoDB','toolsList','Q7_Option_4');
	addToLinkList('toolsListeg','Open Refine','toolsList','Q7_Option_5');
	addToLinkList('toolsListeg','QMiner','toolsList','Q7_Option_6');
	addToLinkList('toolsListeg','Apache Flink','toolsList','Q7_Option_7');
	addToLinkList('toolsListeg','Apache Storm','toolsList','Q7_Option_8');
	addToLinkList('toolsListeg','ProM or Disco','toolsList','Q7_Option_9');
	addToLinkList('toolsListeg','NoSQL / Cassandra','toolsList','Q7_Option_10');
	addToLinkList('toolsListeg','R','toolsList','Q7_Option_11');
	addToLinkList('toolsListeg','Python','toolsList','Q7_Option_12');
	addToLinkList('toolsListeg','Javascript / JQuery','toolsList','Q7_Option_13');
	addToLinkList('toolsListeg','D3 / nvD3','toolsList','Q7_Option_14');
	addToLinkList('toolsListeg','Java','toolsList','Q7_Option_15');
	addToLinkList('toolsListeg','z-scores','toolsList','Q7_Option_16');
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

function addToLinkList(id,item,target,name) {
	itemID = item.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"");
	itemID = itemID.replace(/\s{2,}/g," ");
	itemID = itemID.replace(/ /g,"_");
	$('#'+id).append('<tli id="' + itemID + '" name="'+name+'" onclick="addToList(\''+target+'\',\''+item+'\'); $(this).fadeOut();">' + item + '</tli>');
}

function addToForm(id,item,name) {
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
		$('#'+id).append('<div id="'+itemID+'" name="'+name+'">'+item+' <a class="helpIcon" href="#" onClick="showMiniHelp(\''+item+'\');">?</a></div>');	
	} else {
		$('#'+id).append('<div id="'+itemID+'" name="'+name+'">'+item+'</div>');	
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
	var html = '<tr id="capcap_'+id+'"><td width="20%">'+value+'</td><td width="80%">';
	html += '<div class="toggle-btn-grp joint-toggle">';
	for (i=0;i<5;i++) {
		j = i+1;
		html += '<label class="toggle-btn"><input type="radio" id="capability_'+id+'" name="capability_'+id+'" value="'+i+'" onClick="processCapIn(\'capability\',\''+id+'\','+i+');"/>'+j+'</label>';	
	}
	html += '</div>';
/*
	html += '<br/>';
	html += '<label class="caplabel">Capacity</label>';
	html += '<div class="toggle-btn-grp joint-toggle">';
	for (i=0;i<5;i++) {
		j = i+1;
		html += '<label class="toggle-btn"><input type="radio" id="capacity_'+id+'" name="capacity_'+id+'" value="'+i+'" onClick="processCapIn(\'capacity\',\''+id+'\','+i+');"/>'+j+'</label>';	
	}
	html += '</div>';
*/
	html += '</td></tr>';
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
