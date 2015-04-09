var data = {};
data["skills"] = new Array();
data["training"] = new Array();
data["country"] = new Array();

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
	data["country"]["ISO2"] = QueryString.ISO2;
	data["country"]["name"] = QueryString.name;
	populateForms();
	updateForm();
	addListeners();
});

function addListeners() {
	$('div','#sectorsel').each(function(){
		$(this).click(function() {
			processSector($(this).attr('id'));
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
	});
}


function processSector(sector) {
	$('div','#sectorsel').each(function(){
		$(this).removeClass("selected");
	});
	$("#" + sector).addClass("selected");	
	data["Sector"] = sector;
}


function updateForm() {
	processUpdate('essentialID');
	processUpdate('niceID');
	processUpdate('notID');
}
function populateForms() {
	$('#countryName').html(decodeURIComponent(data["country"]["name"]));
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

	addToForm('essentialID','Scientific method');
	addToForm('essentialID','Open Culture');
	addToForm('niceID','Data skills');
	addToForm('niceID','Advanced computing');
	addToForm('niceID','Data visualisation');
	addToForm('notID','Math and statistics');
	addToForm('notID','Machine learning');
	addToForm('notID','Domain expertise');
	
	addToForm('trainingEssentialID','Face to face training');
	addToForm('trainingEssentialID','Webinars');
	addToForm('trainingEssentialID','eLearning');
	addToForm('trainingNiceID','Translated from English');
	addToForm('trainingNiceID','Tailored to sector');
	addToForm('trainingNiceID','Accredited');
	addToForm('trainingNiceID','Uses non-open, non-free software');
	addToForm('trainingNotID','Coaching');
	addToForm('trainingNotID','Assessed');
	addToForm('trainingNotID','Internal assignments');	
}


function addToForm(id,item) {
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
	$('#'+id).append('<div id="'+itemID+'">'+item+' <a href="#" onClick="showMiniHelp(\''+item+'\');">?</a></div>');
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
        $('#capcap').fadeIn();
    });
	
}

function addToCapCap(inid,id,value,capacity,capability) {
	var html = '<table id="capcap_'+id+'" class="capcaptable" width="100%"><tr><td width="20%">'+value+'</td><td width="80%"><label class="caplabel">Capability</label><input id="capability_'+id+'" type="range" min="0" max="100" style="width: 80%;" value="'+capability+'"/><br/><label class="caplabel">Capacity</label><input id="capacity_'+id+'" type="range" min="0" max="100" style="width: 80%;" value="'+capacity+'"/></td></tr></table>';
	$('#capcap_'+inid).append(html);
}

function processForm(form) {
	data["skills"]["not_required"] = new Array();
	data["skills"]["nice_to_have"] = new Array();
	data["skills"]["essential"] = new Array();
	data["skills"]["capcap"] = new Array();
	data["training"]["not_required"] = new Array();
	data["training"]["nice_to_have"] = new Array();
	data["training"]["essential"] = new Array();

	$('div','#notID').each(function(){
		localid = $(this).attr('id');
		console.log(localid);
		data["skills"]["not_required"].push(localid);
		data["skills"]["capcap"][localid] = new Array();
		data["skills"]["capcap"][localid]["capacity"] = $('#capacity_' + localid).val();
		data["skills"]["capcap"][localid]["capability"] = $('#capability_' + localid).val();
	});	
	$('div','#niceID').each(function(){
		localid = $(this).attr('id');
		data["skills"]["nice_to_have"].push(localid);
		data["skills"]["capcap"][localid] = new Array();
		data["skills"]["capcap"][localid]["capacity"] = $('#capacity_' + localid).val();
		data["skills"]["capcap"][localid]["capability"] = $('#capability_' + localid).val();
	});	
	$('div','#essentialID').each(function(){
		localid = $(this).attr('id');
		data["skills"]["essential"].push(localid);
		data["skills"]["capcap"][localid] = new Array();
		data["skills"]["capcap"][localid]["capacity"] = $('#capacity_' + localid).val();
		data["skills"]["capcap"][localid]["capability"] = $('#capability_' + localid).val();
	});

	data["Involvement"] = $('#involvement').val();	

	$('div','#trainingNotID').each(function(){
		data["training"]["not_required"].push($(this).attr('id')); 
	});	
	$('div','#trainingNiceID').each(function(){
		data["training"]["nice_to_have"].push($(this).attr('id')); 
	});	
	$('div','#trainingEssentialID').each(function(){
		data["training"]["essential"].push($(this).attr('id')); 
	});

	console.log(data);
}

