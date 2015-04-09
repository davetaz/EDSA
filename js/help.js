var defs = {};
defs["Domain expertise"] = "Subtantive expertise in the domain";
defs["Data skills"] = "The ability to be able to manipulate data in many formats";
defs["Advanced computing"] = "The ability to code a custom solution";
defs["Visualisation"] = "The ability to visually present data in an appealing and releant way";
defs["Scientific method"] = "The application of propper scientific methods to produce a reliable and reproducible result";
defs["Open culture"] = "The belief that working in the open and sharing instantly is best to produce a reliable result";
defs["Math and statistics"] = "Deep theorectical and statistical knowledge to model data";


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
	id = QueryString.id;
	if (id != "") {
		id = decodeURIComponent(id);
		id = id.replace(/_/g,' ');
		processWikiText(id);
		$('#helpTitle').html(id);
	}
});

function p(t){
    t = t.trim();
    return (t.length>0?'<p>'+t.replace(/[\r\n]+/g,'</p><p>')+'</p>':null);
}

function processWikiText(id) {
	$.getJSON("https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=" + id + "&callback=?", function( data ) {
		result = data.query.pages;
		count = 0;
		$.each(result, function(key,val) {
			if (count < 1) {
				if (typeof val.extract == 'undefined') {
					console.log(defs);
					$('#helpContent').html(defs[id]);
				}
				$('#helpContent').html(p(val.extract));
			}
			count++;
		});
	})
}
