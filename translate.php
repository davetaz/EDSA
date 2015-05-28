<?php
error_reporting(E_ALL ^ E_NOTICE);

include "key.php";

init();

function init() {
	$countries = loadCountries();
	$languages = getLanguagesInOrder($countries);
	// GOT HERE, NEED TO REWRITE THE TRANSLATOR TO READ FILE FOR WHAT EXISTS (into array) 
	// AND ADD TO THE ARRAY WHAT DOESN'T. 
	// THEN ENSURE THE LANGUAGES ARE IN ORDER AND WRITE THE WHOLE LOT BACK TO THE FILE. 
	processFiles($languages);
}

function loadCountries() {
	$input_file = "data/eu-country-languages.csv";
	$handle = fopen($input_file,"r");
	$headings = fgetcsv($handle);
	$j=0;
	while ($data = fgetcsv($handle)) {
		for($i=0;$i<count($data);$i++) {
			$countries[$j][$headings[$i]] = $data[$i];
		}
		$j++;
	}
	return $countries;
}

function getLanguagesInOrder($countries) {
	for ($i=0;$i<count($countries);$i++) {
		$lang[] = $countries[$i]["Language"];
	}
	asort($lang);
	foreach($lang as $key => $val) {
		if (!in_array($val,$out)) {
			$out[] = $val;	
		} 
	}
	return $out;
}

function processFiles($languages) {
	$input_dir = "data/harvester/search_terms/";
	$files = scandir($input_dir);
	
	for ($i=2;$i<count($files);$i++) {
		$file = $input_dir . $files[$i];
		processFile($file,$languages);
	}
}

function processFile($file,$languages) {
	echo $file . "\n";
	$handle = fopen($file,"r");
	$headings = fgetcsv($handle);
	while ($data = fgetcsv($handle)) {
		for ($i=0;$i<count($data);$i++) {
            $language = $headings[$i];
            $term = $data[$i];
            $output[$language][] = $term;
		}
    }
    for($i=0;$i<count($languages);$i++) {
    	$lang = $languages[$i];
    	if (!$output[$lang]) {
    		echo "need to get " . $lang . " for " . $file . "\n";
    		$output = getLanguage($output,$lang);
    	}
    }
    ksort($output);
    writeOutput($output,$file);
}

function getLanguage($output,$lang) {
	$gb = $output["gb"];
	for ($i=0;$i<count($gb);$i++) {
//		$output[$lang][] = "test_" . $gb[$i];
		$output[$lang][] = Translate($gb[$i],$lang);
	}
	return $output;
}

function Translate($word,$to = 'fr')
{
	global $key;
	$word = urlencode($word);
	$url = "https://www.googleapis.com/language/translate/v2?key=".$key."&q=".$word."&source=en&target=" . $to;
	
	$name_en = file_get_contents($url);
	$trans = json_decode($name_en,true);
	$item = $trans["data"]["translations"][0]["translatedText"];
	return $item;
}

function writeOutput($output,$file) {
	foreach ($output as $key => $values) {
		$headings[] = $key;
		for ($i=0;$i<count($values);$i++) {
			$row[$i][] = $values[$i];
		}
	}
	$file = $file . ".outtest";
	$handle = fopen($file,"w");
	fputcsv($handle,$headings);
	for($i=0;$i<count($row);$i++) {
		fputcsv($handle,$row[$i]);
	}
	fclose($handle);
}

?>
