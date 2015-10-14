var data = {};
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
	$('#capcap-team').hide();
	data["country"]["ISO2"] = QueryString.ISO2;
	data["country"]["name"] = QueryString.name;
	addMap();
	populateForms();
	updateForm();
	addListeners();
	wakeServer();
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
	console.log(data["Involvement"]);
	if (data["Involvement"] == "I_am_a_data_scientist") {
		$('#capcap-team').hide();
	} else {
		$('#capcap-team').show();
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
	addToForm('sectorsel','Media and Advertising');
	addToForm('sectorsel','Data and Information Systems');
	addToForm('sectorsel','Construction and engineering');
	addToForm('sectorsel','Telecomms');
	addToForm('sectorsel','Aerospace and defence');
	addToForm('sectorsel','Professional services');
	addToForm('sectorsel','Finance, Insurance and Real Estate');
	addToForm('sectorsel','Consultancy');
	addToForm('sectorsel','Energy');
	addToForm('sectorsel','Agriculture');
	addToForm('sectorsel','Transport');
	addToForm('sectorsel','Government and public sector');
	addToForm('sectorsel','Health');
	addToForm('sectorsel','Consumer services');
	addToForm('sectorsel','Automative industry');
	addToForm('sectorsel','Manufacturing');
	addToForm('sectorsel','Mining');	
	
	addToForm('orgtypesel','Micro (<10 employees)');	
	addToForm('orgtypesel','SME (10 to 250 employees)');	
	addToForm('orgtypesel','Large (250+ employees)');

	addToForm('involvement','I am a data scientist');
	addToForm('involvement','I manage data scientists');
/*	
	addToForm('involvement','No involvement');
	addToForm('involvement','I work with data scientists but am not one myself');
	addToForm('involvement','I manage data scientists');
	addToForm('involvement','My primary role is not data science by I practice occasionally');
	addToForm('involvement','I am a practicing data scientist but with gaps in certain areas (e.g. statistics)');
	addToForm('involvement','I am a practicing data scientist with excellent knowledge in all areas');
*/

	addToForm('pickID','Big data');
	addToForm('pickID','Open source tools and concepts');
	addToForm('pickID','Data collection and analysis');
	addToForm('pickID','Advanced computing and programming');
	addToForm('pickID','Data interpretation and visualisation');
	addToForm('pickID','Math and statistics');
	addToForm('pickID','Machine learning and prediction');
	addToForm('pickID','Business intelligence and domain expertise');
	
	addToForm('trainingPickID','Face to face training');
	addToForm('trainingPickID','Webinars');
	addToForm('trainingPickID','eLearning');
	addToForm('trainingPickID','Translated from English');
	addToForm('trainingPickID','Tailored to sector');
	addToForm('trainingPickID','Accredited');
	addToForm('trainingPickID','Uses non-open, non-free software');
	addToForm('trainingPickID','Coaching');
	addToForm('trainingPickID','Assessed');
	addToForm('trainingPickID','Internal assignments');	

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

function addToForm(id,item) {
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
		$('#'+id).append('<div id="'+itemID+'">'+item+' <a class="helpIcon" href="#" onClick="showMiniHelp(\''+item+'\');">?</a></div>');	
	} else {
		$('#'+id).append('<div id="'+itemID+'">'+item+'</div>');	
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
	data = {};
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
	data["skills"]["not_required"] = new Array();
	data["skills"]["nice_to_have"] = new Array();
	data["skills"]["essential"] = new Array();
	data["training"]["not_required"] = new Array();
	data["training"]["nice_to_have"] = new Array();
	data["training"]["essential"] = new Array();
	data["tools"] = new Array();
	
	$('div','#notID').each(function(){
		localid = $(this).attr('id');
		console.log(localid);
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

function processForm(form) {
	$('[id=submit]').attr("disabled",true);
	$('[id=submit]').html("Processing");
	data = cacheData();	
	console.log(data);

	var tmp = JSON.stringify(data);
	// tmp value: [{"id":21,"children":[{"id":196},{"id":195},{"id":49},{"id":194}]},{"id":29,"children":[{"id":184},{"id":152}]},...]
	console.log(tmp);
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
