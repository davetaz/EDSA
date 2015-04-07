var data = {};
data["not_required"] = new Array();
data["nice_to_have"] = new Array();
data["essential"] = new Array();

$( document ).ready(function() {
	addListeners();
	populateForms();
	updateForm();
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
	addToList('trainingEssentialID','Face to face training');
	addToList('trainingEssentialID','Webinars');
	addToList('trainingEssentialID','eLearning');
	addToList('trainingNiceID','Translated from English');
	addToList('trainingNiceID','Tailored to sector');
	addToList('trainingNiceID','Accredited');
	addToList('trainingNiceID','Uses non-open, non-free software');
	addToList('trainingNotID','Coaching');
	addToList('trainingNotID','Assessed');
	addToList('trainingNotID','Internal assignments');	
}

function addToList(id,item) {
	itemID = item.replace(/ /g,"_");
	$('#'+id).append('<div id="'+itemID+'">'+item+'</div>');
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

    $('div','#notID').each(function(){
      data["not_required"].push($(this).attr('id')); 
    });	
    $('div','#niceID').each(function(){
      data["nice_to_have"].push($(this).attr('id')); 
    });	
    $('div','#essentialID').each(function(){
      data["essential"].push($(this).attr('id')); 
    });
    data["involvement"] = $('#involvement').val();	
   
    console.log(data);
}

