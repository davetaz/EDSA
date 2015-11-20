var defs = {};
var skills = {};
defs["Business intelligence and domain expertise"] = "Having authoritative knowledge of a specific area or topic.";
skills["Business intelligence and domain expertise"] = [];
skills["Business intelligence and domain expertise"].push("Enterprise processes");
skills["Business intelligence and domain expertise"].push("Business intelligence");
skills["Business intelligence and domain expertise"].push("Data anonymisation");
skills["Business intelligence and domain expertise"].push("Semantics and schemas");
skills["Business intelligence and domain expertise"].push("Data Licensing");

defs["Data collection and analysis"] = "The ability to collect, store, manage, process, and clean data.";
skills["Data collection and analysis"] = [];
skills["Data collection and analysis"].push("Databases");
skills["Data collection and analysis"].push("Data management (storage, preservation, security)");
skills["Data collection and analysis"].push("Data mining");
skills["Data collection and analysis"].push("Data formats and linked data");
skills["Data collection and analysis"].push("Stream processing");
skills["Data collection and analysis"].push("Large scale data processing");

defs["Advanced computing and programming"] = "Selecting and using the right tools and techniques, including programming and computer systems, to work with and analyse data.";
skills["Advanced computing and programming"] = [];
skills["Advanced computing and programming"].push("Scripting (e.g. Crontab, bash, applescript)");
skills["Advanced computing and programming"].push("Programming (e.g. Python, R, HTML, Javascript)");
skills["Advanced computing and programming"].push("Computational systems");
skills["Advanced computing and programming"].push("Cloud scale computing");

defs["Data interpretation and visualisation"] = "The presentation of data in a visual format to help people understand it’s significance.";
skills["Data interpretation and visualisation"] = [];
skills["Data interpretation and visualisation"].push("Data interpretation and visualisation");
skills["Data interpretation and visualisation"].push("Infographics");
skills["Data interpretation and visualisation"].push("Interaction");
skills["Data interpretation and visualisation"].push("Data mapping");
skills["Data interpretation and visualisation"].push("Data stories");
skills["Data interpretation and visualisation"].push("Data journalism");
skills["Data interpretation and visualisation"].push("d3js, Tableau");

defs["Scientific method"] = "Rigorous methods of research in which problems are identified, relevant data gathered, hypotheses are formulated from the data, and hypotheses are empirically tested.";
skills["Scientific method"] = [];
skills["Scientific method"].push("Research methodologies");
skills["Scientific method"].push("Significance and reproducibility");
skills["Scientific method"].push("Scientific publication");
skills["Scientific method"].push("Process and data sharing techniques");

defs["Big data"] = "The ability to deal with large volumes of constantly changing data, sometimes in near real time.";
skills["Big data"] = [];
skills["Big data"].push("Cloud and cluster computing");
skills["Big data"].push("Streaming data");
skills["Big data"].push("Map-reduce services");
skills["Big data"].push("noSQL");

defs["Open source tools and concepts"] = "A culture or way of working which promotes the spread of knowledge by allowing anyone to (at an early stage) access, use, adapt and share data, information and knowledge, without restriction.";
skills["Open source tools and concepts"] = [];
skills["Open source tools and concepts"].push("Online collaboration platforms");
skills["Open source tools and concepts"].push("Open licensing");
skills["Open source tools and concepts"].push("Communications");


defs["Math and statistics"] = "The theory and methods used in collecting, analysing, interpreting, presenting and organising data in order to generate knowledge and insight.";
skills["Math and statistics"] = [];
skills["Math and statistics"].push("Linear Algebra and calculus");
skills["Math and statistics"].push("Statistics and probability");
skills["Math and statistics"].push("RStudio");
skills["Math and statistics"].push("Data analytics");

defs["Machine learning and prediction"] = "The construction and study of algorithms that enable computer systems to learn from data.";
skills["Machine learning and prediction"] = [];
skills["Machine learning and prediction"].push("Social network analysis");
skills["Machine learning and prediction"].push("Inference and reasoning");
skills["Machine learning and prediction"].push("Process mining");
skills["Machine learning and prediction"].push("Artificial intelligence");
    
defs["hacking skills"] = "Hacking Skills: Data is a commodity traded electronically, therefore, in order to be in this market you need to speak hacker. Far from 'black hat' activities, data hackers must be able to manipulate text files at the command-line, thinking algorithmically, and be interested in learning new tools.";
defs["math stats"] = "Math & Statistics Knowledge: Once you have acquired and cleaned the data, the next step is to actually extract insight from it. You need to apply appropriate math and statistics methods, which requires at least a baseline familiarity with these tools.";
defs["substantive expertise"] = "Substantive Expertise: Science is about discovery and building knowledge, which requires some motivating questions about the world and hypotheses that can be brought to data and tested with statistical methods. Questions first, then data.";
defs["machine learning"] = "Machine Learning: The construction and study of algorithms that enable computer systems to learn from data.";
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
