var data = {};
data["not_required"] = new Array();
data["nice_to_have"] = new Array();
data["essential"] = new Array();

$( document ).ready(function() {
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
}

function mremove(id) {
	console.log(id);
	$("#"+id).fadeOut(function() { 
		$("#"+id).remove();
	});
	
}

function addElement(id) {
	id = id.replace("add","");
	Ply.dialog('prompt', {
		title: 'Add',
		form: { name: 'Name' }
	}).done(function (ui) {
		var el = document.createElement('div');
		var outid = ui.data.name;
		outid.replace(" ","_");
		el.innerHTML = ui.data.name + '<i class="js-remove" onClick="mremove(\''+outid+'\');">✖</i>';
		el.setAttribute("id",outid);
		console.log(id);
		console.log(el);
		document.getElementById(id).appendChild(el);
	});
}


function processSector(sector) {
	$('div','#sectorsel').each(function(){
		$(this).removeClass("selected");
	});
	$("#" + sector).addClass("selected");	
	data["Sector"] = sector;
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

