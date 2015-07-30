var defs = {};
var skills = {};
defs["Domain expertise"] = "Having authoritative knowledge of a specific area or topic.";
skills["Domain expertise"] = [];
skills["Domain expertise"].push("Enterprise processes");
skills["Domain expertise"].push("Business intelligence");
skills["Domain expertise"].push("Data anonymisation");
skills["Domain expertise"].push("Semantics and schemas");
skills["Domain expertise"].push("Data Licensing");

defs["Data skills"] = "The ability to collect, store, manage, process, and clean data.";
skills["Data skills"] = [];
skills["Data skills"].push("Databases");
skills["Data skills"].push("Data management (storage, preservation, security)");
skills["Data skills"].push("Data mining");
skills["Data skills"].push("Data formats and linked data");
skills["Data skills"].push("Stream processing");
skills["Data skills"].push("Large scale data processing");

defs["Advanced computing"] = "Selecting and using the right tools and techniques, including programming and computer systems, to work with and analyse data.";
skills["Advanced computing"] = [];
skills["Advanced computing"].push("Scripting (e.g. Crontab, bash, applescript)");
skills["Advanced computing"].push("Programming (e.g. Python, R, HTML, Javascript)");
skills["Advanced computing"].push("Computational systems");
skills["Advanced computing"].push("Cloud scale computing");

defs["Visualisation"] = "The presentation of data in a visual format to help people understand it’s significance.";
skills["Visualisation"] = [];
skills["Visualisation"].push("Visualisation");
skills["Visualisation"].push("Infographics");
skills["Visualisation"].push("Interaction");
skills["Visualisation"].push("Data mapping");
skills["Visualisation"].push("Data stories");
skills["Visualisation"].push("Data journalism");
skills["Visualisation"].push("d3js, Tableau");

defs["Scientific method"] = "Rigorous methods of research in which problems are identified, relevant data gathered, hypotheses are formulated from the data, and hypotheses are empirically tested.";
skills["Scientific method"] = [];
skills["Scientific method"].push("Research methodologies");
skills["Scientific method"].push("Significance and reproducibility");
skills["Scientific method"].push("Scientific publication");
skills["Scientific method"].push("Process and data sharing techniques");

defs["Open culture"] = "A culture or way of working which promotes the spread of knowledge by allowing anyone to (at an early stage) access, use, adapt and share data, information and knowledge, without restriction.";
skills["Open culture"] = [];
skills["Open culture"].push("Online collaboration platforms");
skills["Open culture"].push("Open licensing");
skills["Open culture"].push("Communications");


defs["Math and statistics"] = "The theory and methods used in collecting, analysing, interpreting, presenting and organising data in order to generate knowledge and insight.";
skills["Math and statistics"] = [];
skills["Math and statistics"].push("Linear Algebra and calculus");
skills["Math and statistics"].push("Statistics and probability");
skills["Math and statistics"].push("RStudio");
skills["Math and statistics"].push("Data analytics");

defs["Machine learning"] = "The construction and study of algorithms that enable computer systems to learn from data.";
skills["Machine learning"] = [];
skills["Machine learning"].push("Social network analysis");
skills["Machine learning"].push("Inference and reasoning");
skills["Machine learning"].push("Process mining");
skills["Machine learning"].push("Artificial intelligence");
    
defs["hacking skills"] = "Hacking Skills: Data is a commodity traded electronically, therefore, in order to be in this market you need to speak hacker. Far from 'black hat' activities, data hackers must be able to manipulate text files at the command-line, thinking algorithmically, and be interested in learning new tools.";
defs["math stats"] = "Math & Statistics Knowledge: Once you have acquired and cleaned the data, the next step is to actually extract insight from it. You need to apply appropriate math and statistics methods, which requires at least a baseline familiarity with these tools.";
defs["substantive expertise"] = "Substantive Expertise: Science is about discovery and building knowledge, which requires some motivating questions about the world and hypotheses that can be brought to data and tested with statistical methods. Questions first, then data.";
defs["machine learning"] = "Machine Learning: Data plus math is machine learning, which is fantastic if that is what you if that is what you are interested in, but not if you are doing data science.";
defs["traditional research"] = "Traditional Research: Substantive expertise plus math and statistics knowledge is where most traditional researcher falls. Doctoral level researchers spend most of their time acquiring expertise in these areas, but very little time learning about technology.",
defs["danger zone"] = "Danger Zone!: This is where I place people who, 'know enough to be dangerous,' and is the most problematic area of the diagram. It is from this part of the diagram that the phrase 'lies, damned lies, and statistics' emanates, because either through ignorance or malice this overlap of skills gives people the ability to create what appears to be a legitimate analysis without any understanding of how they got there or what they have created.";

function showHelp() {
        $("#helpBox").fadeIn();
}
function hideHelp() {
        $("#helpBox").fadeOut();
}

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
	$('#skillsIncludeList').html="";
	if (id != "") {
		id = decodeURIComponent(id);
		id = id.replace(/_/g,' ');
		console.log(id);
		console.log(defs[id]);
//		processWikiText(id);
		$('#helpTitle').html(id);
		$('#helpContent').html(defs[id]);
		$(skills[id]).each(function(skill) {
			$('#skillsIncludeList').append("<li>" + skills[id][skill] + "</li>");
			$('#skillsTitle').fadeIn();

		});
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
