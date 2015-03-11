<?php

$data = file_get_contents("test.html");
processLinkedIn($data);

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
		if (strpos($line,"See More") > 0) {
			$flags["Locations"] = false;
			$flags["Companies"] = false;
		}
		if ($flags["Locations"] || $flags["Companies"]) {
			$line = trim(strip_tags($line));
			if ($line != "Locations" && $line != "Companies" && $line != "") {
				if (substr($line,0,1) == "(") {
					$number = substr($line,1,strlen($line)-1);
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
	echo $count;
	print_r($locations);
	print_r($companies);
}
?>
