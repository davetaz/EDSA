<?php

#$data = getLinkedIn("Machine learning","gb");
#processLinkedIn($data);
error_reporting(E_ALL ^ E_NOTICE);
init();


function init() {
	$input_dir = "data/harvester/search_terms/";
	$output_dir = "data/harvester/search_results/linkedin/";
	$files = scandir($input_dir);
	for ($i=2;$i<count($files);$i++) {
		$file = $input_dir . $files[$i];
		$output_prefix = $output_dir . substr($files[$i],0,-4);
		processFile($file,$output_prefix);
	}
}

function processFile($file,$output_prefix) {
	echo $file . "\n";
	//echo $output_prefix . "\n";
	$handle = fopen($file,"r");
	$headings = fgetcsv($handle);
	//writeOutput($output_prefix,$languages);
	//exit();
	while ($data = fgetcsv($handle)) {
		for ($i=0;$i<count($data);$i++) {
			$language = $headings[$i];
			$term = $data[$i];
			echo "Fetching data for " . $term . " (" . $language . ")\n";
			$output_data = getLinkedIn($term,$language);
			$languages[$language][$term] = $output_data;
			$delay = rand(6,15);
			echo "Sleeping " . $delay . "\n";
			sleep($delay);
		}
	}
	writeOutput($output_prefix,$languages);
	//exit();
}

function writeOutput($output_prefix,$data) {
	//$s = serialize($data);
	//$handle = fopen("output.data","w");
	//fwrite($handle,$s);
	//fclose($handle);
	//$s = file_get_contents("output.data");
	//$data = unserialize($s);
	foreach ($data as $language => $values) {
		writeLanguageCounts($output_prefix,$language,$values);
		foreach ($values as $term => $stuff) {
			writeAdditionalData($output_prefix,$language,$term,"companies",$stuff["companies"]);
			writeAdditionalData($output_prefix,$language,$term,"locations",$stuff["locations"]);
		}
	}
}

function writeAdditionalData($output_prefix,$language,$term,$type,$data) {
	if ($data == "") {
		return;
	}
	$output_dir = $output_prefix . "/" . $type . "/" . $language;
	@mkdir($output_dir,0755,true);
	$file = $output_dir . "/" . $term . ".csv";
	$input_titles[] = "Date";	
	foreach ($data as $item => $stuff) {
		$input_titles[] = $item;
	}
	if (file_exists($file)) {
		$handle = fopen($file,"r");
		$titles = fgetcsv($handle);
		$linenum = 0;
		while ($line = fgetcsv($handle)) {
			for ($i=0;$i<count($titles);$i++) {
				$output[$linenum][$titles[$i]] = $line[$i];
			}
			$linenum++;
		}
		fclose($handle);
		$titles = array_merge($input_titles,$titles);
		$titles = array_unique($titles);
		foreach($titles as $num => $value) {
			$outtitles[] = $value;
		}
		$titles = $outtitles;
	} else {
		$titles = $input_titles;
		$linenum = 0;
	}
	$date = date("Y-m-d");
	$output[$linenum]["Date"] = $date;
	for($i=1;$i<count($titles);$i++) {
		$count = $data[$titles[$i]];
		$count = str_replace(",","",$count);
		$output[$linenum][$titles[$i]] = $count;
	}
	$handle = fopen($file,"w");
	fputcsv($handle,$titles);
	for($i=0;$i<count($output);$i++){
		$toput = "";
		$data = $output[$i];
		for($j=0;$j<count($titles);$j++) {
			$toput[] = $data[$titles[$j]];
		}
		fputcsv($handle,$toput);
	}
	fclose($handle);
}

function writeLanguageCounts($output_prefix,$language,$data) {
	$file = $output_prefix . "/" . $language . ".csv";
	$input_titles[] = "Date";	
	foreach ($data as $item => $stuff) {
		$input_titles[] = $item;
	}
	if (file_exists($file)) {
		$handle = fopen($file,"r");
		$titles = fgetcsv($handle);
		$linenum = 0;
		while ($line = fgetcsv($handle)) {
			for ($i=0;$i<count($titles);$i++) {
				$output[$linenum][$titles[$i]] = $line[$i];
			}
			$linenum++;
		}
		fclose($handle);
		$titles = array_merge($input_titles,$titles);
		$titles = array_unique($titles);
		foreach($titles as $num => $value) {
			$outtitles[] = $value;
		}
		$titles = $outtitles;
	} else {
		$titles = $input_titles;
		$linenum = 0;
	}
	$date = date("Y-m-d");
	$output[$linenum]["Date"] = $date;
	for($i=1;$i<count($titles);$i++) {
		$count = $data[$titles[$i]]["count"];
		$count = str_replace(",","",$count);
		$output[$linenum][$titles[$i]] = $count;
	}
	$handle = fopen($file,"w");
	fputcsv($handle,$titles);
	for($i=0;$i<count($output);$i++){
		$toput = "";
		$data = $output[$i];
		for($j=0;$j<count($titles);$j++) {
			$toput[] = $data[$titles[$j]];
		}
		fputcsv($handle,$toput);
	}
	fclose($handle);
}

function getData($url) {
	$ch = curl_init();
	$timeout = 5;
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch,CURLOPT_USERAGENT,'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13');
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
	$data = curl_exec($ch);
	curl_close($ch);
	return $data;
}

function getLinkedIn($term,$country_code) {
	if (strpos($term," ") > 0) {
		$term = '"' . $term . '"';
	}
	$url = "https://www.linkedin.com/job/".urlencode($term)."-jobs/?country=".$country_code."&trk=jserp_search_button_execute";
	$data = getData($url);
	return (processLinkedIn($data));
}

function processLinkedIn($data) {
	$count = 0;
	$flags["Locations"] = false;
	$flags["Companies"] = false;
	$lines = explode("\n",$data);
	for($i=0;$i<count($lines);$i++) {
		$line = $lines[$i];
		if (strpos($line,"results") > 0 && strpos($line,"strong") > 0) {
			$line = strip_tags($line);
			$parts = explode(" ",trim($line));
			$count = $parts[0];
		}
		if (trim(strip_tags($line)) == "Companies") {
			$flags["Companies"] = true;
		}
		if (trim(strip_tags($line)) == "Locations") {
			$flags["Locations"] = true;
		}
		if (strpos($line,"/ul>") > 0) {
			$flags["Locations"] = false;
			$flags["Companies"] = false;
		}
		if ($flags["Locations"] || $flags["Companies"]) {
			$line = trim(strip_tags($line));
			if ($line != "Locations" && $line != "Companies" && $line != "") {
				if (substr($line,0,1) == "(") {
					$number = substr($line,1,strlen($line)-2);
				} else {
					$location = $line;
				}
				if ($flags["Locations"]) {
					$locations[$location] = $number;
				}
				if ($flags["Companies"]) {
					$companies[$location] = $number;
				}
			}
		}
	}
	$output["count"] = $count;
	$output["locations"] = $locations;
	$output["companies"] = $companies;
	return $output;
}
?>
