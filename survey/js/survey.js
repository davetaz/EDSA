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

