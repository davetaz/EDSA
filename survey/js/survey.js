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
	data["country"]["ISO2"] = QueryString.ISO2;
	data["country"]["name"] = QueryString.name;
	addMap();
	populateForms();
	updateForm();
	addListeners();
});

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
	
	addToForm('involvement','No involvement');
	addToForm('involvement','I work with data scientists but am not one myself');
	addToForm('involvement','I manage data scientists');
	addToForm('involvement','My primary role is not data science by I practice occasionally');
	addToForm('involvement','I am a practicing data scientist but with gaps in certain areas (e.g. statistics)');
	addToForm('involvement','I am a practicing data scientist with excellent knowledge in all areas');

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
	toggleSetup();
        $('#capcap').fadeIn();
    });
	
}

function addToCapCap(inid,id,value,capacity,capability) {
	var html = '<table id="capcap_'+id+'" class="capcaptable" width="100%"><tr><td width="20%">'+value+'</td><td width="80%"><label class="caplabel">Capability</label>';
	html += '<div class="toggle-btn-grp joint-toggle">';
	for (i=0;i<5;i++) {
		html += '<label class="toggle-btn"><input type="radio" id="capability_'+id+'" name="capability_'+id+'" value="'+i+'" onClick="processCapIn(\'capability\',\''+id+'\','+i+');"/>'+i+'</label>';	
	}
	html += '</div>';
	html += '<br/>';
	html += '<label class="caplabel">Capacity</label>';
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

function processForm(form) {
	data["skills"]["not_required"] = new Array();
	data["skills"]["nice_to_have"] = new Array();
	data["skills"]["essential"] = new Array();
	data["training"]["not_required"] = new Array();
	data["training"]["nice_to_have"] = new Array();
	data["training"]["essential"] = new Array();

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
	console.log(data);

	var tmp = JSON.stringify(data);
	// tmp value: [{"id":21,"children":[{"id":196},{"id":195},{"id":49},{"id":194}]},{"id":29,"children":[{"id":184},{"id":152}]},...]
	console.log(tmp);
	$.ajax({
		type: 'POST',
		url: 'http://odinprac.theodi.org/EDSA/',
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
