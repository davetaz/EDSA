<?php

error_reporting(E_ALL ^ E_NOTICE);

$summary = [];

$handle = opendir('.');
while (false !== ($entry = readdir($handle))) {
	if (strpos($entry,".json") > 0) {
		processFile($entry);
	}
}
closedir($handle);
processCapCap();
processcCapCap();
outputCSVs();
print_r($summary["cCapCap"]);

function processFile($entry) {
	global $summary;
	$contents = file_get_contents($entry);
	$array = json_decode($contents,true);
	$skills = $array["skills"];
	$training = $array["training"];
	$country = $array["country"];
	$capcap = $array["skills"]["capcap"];
	$sector = $array["Sector"];
	$involvement = $array["Involvement"];

	$summary["Sector"][$sector]++;
	$summary["Involvement"][$involvement]++;
	$summary["Country"][$country["name"]]++;

	processCapCapCountry($country,$capcap);
	processSkills($skills,"Skills");
	processSkills($training,"Training");
}

function processCapCapCountry($country,$capcap) {
	global $summary;
	if ($country["ISO2"] == "") {
		return;
	}
	$cCapCap = $summary["cCapCap"];
	$cCapCap[$country["ISO2"]]["count"]++;
	$cCapCap[$country["ISO2"]]["country"] = $country["name"];
	$count = $cCapCap[$country["ISO2"]]["count"];
	
	foreach ($capcap as $key => $value) {
		$type = substr($key,0,strpos($key,"_"));
		$key = substr($key,strpos($key,"_")+1,strlen($key));
		$key = str_replace("_"," ",$key);
		$cCapCap[$country["ISO2"]][$type][$key] += $value;
	}

	$summary["cCapCap"] = $cCapCap;
}

function processcCapCap() {
	global $summary;
	$cCapCap = $summary["cCapCap"];
	foreach ($cCapCap as $country => $values) {
		$count = $values["count"];
		$capability = $values["capability"];
		$capacity = $values["capacity"];
		if ($count > 1) {
			foreach ($capability as $name => $value) {
				$value = round($value / $count,2);
				$capability[$name] = $value;
			}
			foreach ($capacity as $name => $value) {
				$value = round($value / $count,2);
				$capacity[$name] = $value;
			}
			$cCapCap[$country]["capability"] = $capability;
			$cCapCap[$country]["capacity"] = $capacity;
		}
	}
	$summary["cCapCap"] = $cCapCap;
}

function processSkills($skills,$title) {
	global $summary;
	foreach ($skills as $type => $values) {
		if ($type != "capcap") {
			for ($i=0;$i<count($values);$i++) {
				$summary[$title][$values[$i]][$type]++;
			}
		} else {
			foreach ($values as $key => $value) {
				$summary["CapCap"][$key]["total"] += $value;
				$summary["CapCap"][$key]["count"]++;
			}	
		}
	}
}

function processCapCap() {
	global $summary;
	$capcap = $summary["CapCap"];
	foreach($capcap as $key => $values) {
		$type = substr($key,0,strpos($key,"_"));
		$key = substr($key,strpos($key,"_")+1,strlen($key));
		$key = str_replace("_"," ",$key);
		$output[$type][$key] = $values["total"] / $values["count"];
	}
	$summary["CapCap"] = $output;
}

function outputCSVs() {
	global $summary;
	outputSimple("Countries",$summary["Country"]);
	outputSimple("Sectors",$summary["Sector"]);
	outputSimple("Involvement",$summary["Involvement"]);
	$core = array("Machine learning","Domain expertise","Data skills","Advanced computing","Data visualisation","Scientific method","Open Culture","Math and statistics");
	outputComplex("Skills",$summary["Skills"],$core);
	outputCapCap("CapCap",$summary["CapCap"],$core);
	outputcCapCap("cCapCap",$summary["cCapCap"],$core);
	$core = array("Assessed","Translated from English","Accredited","Tailored to sector","Internal assignments","Coaching","Webinars","Uses nonopen nonfree software","Face to face training","eLearning");
	outputComplex("Training",$summary["Training"],$core);
}

function outputSimple($title,$array) {
	$output[] = array($title,"count");
	foreach ($array as $key => $count) {
		if ($key) {
			$key = str_replace("_"," ",$key);
			$output[] = array($key,$count);
		}
	}
	writeCSV($title,$output);
}

function outputCapCap($title,$array,$core) {
	$outkeys[] = "Type";
	$outkeys = array_merge($outkeys,$core);
	$output[] = $outkeys;
	foreach ($array as $type => $values) {
		$row = "";
		$row[] = $type;
		for($i=0;$i<count($core);$i++) {
			$row[] = $values[$core[$i]];
		}
		$output[] = $row;
	}
	writeCSV($title,$output);
}

function outputcCapCap($title,$array,$core) {
	$outkeys[] = "Country";
	$outkeys[] = "ISO2";
	$outkeys[] = "Type";
	$outkeys[] = "Rank_Scaled";
	
	$outkeys = array_merge($outkeys,$core);
	$output[] = $outkeys;
	
	foreach ($array as $iso2 => $values) {
		$row1 = "";
		$row2 = "";
	
		$row1[] = $values["country"];
		$row2[] = $values["country"];
		
		$row1[] = $iso2;
		$row2[] = $iso2;
		
		$row1[] = "Capability";
		$row2[] = "Capacity";
		
		$row1[] = 100;
		$row2[] = 100;

		$capability = $values["capability"];
		$capacity = $values["capacity"];

		for($i=0;$i<count($core);$i++) {
			$row1[] = $capability[$core[$i]];
			$row2[] = $capacity[$core[$i]];
		}
		$output[] = $row1;
		$output[] = $row2;
	}
	writeCSV($title,$output);
}

function outputComplex($title,$array,$core) {
	$keys["essential"] = 1;
	$keys["nice_to_have"] = 1;
	$keys["not_required"] = 1;

	$outkeys[] = $title;
	foreach ($keys as $key => $count) {
		$outkeys[] = $key;
	}
	$output[] = $outkeys;
	$output_core[] = $outkeys;
	foreach ($array as $skill => $values) {
		$skill = str_replace("_"," ",$skill);
		$row = [];
		$row[] = $skill;
		foreach($keys as $key => $count) {
			$row[] = $values[$key];
		}
		if (in_array($skill,$core)) {
			$output_core[] = $row;
		}
		$output[] = $row;
	}
//	print_r($output);
	writeCSV($title,$output);
	writeCSV($title . "_core",$output_core);
}

function writeCSV($title,$output) {
	$file = "../EDSA/data/online_survey_data/" . $title . ".csv";
	$handle = fopen($file,"w");
	foreach ($output as $fields) {
		fputcsv($handle,$fields);
	}
	fclose($handle);
}

//print_r($summary);

?>
