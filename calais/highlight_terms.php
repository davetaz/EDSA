<?php

	$file = $argv[1];

	$contents = file_get_contents($file);
	
	$words[] = "impact";
	$words[] = "benefit";
	$words[] = "effect";
	$words[] = "affect";
	$words[] = "improved";
	$words[] = "improve";
	$words[] = "save";
	$words[] = "saved";
	$words[] = "key";
	$words[] = "important";
	$words[] = "creates";
	$words[] = "core";
	$words[] = "central";
	$words[] = "innovate";
	$words[] = "innovatation";
	$words[] = "innovative";
	
	for($i=0;$i<count($words);$i++) {
		$contents = str_ireplace(" " . $words[$i] . " "," <b>" . $words[$i] . "</b> ",$contents);
		$contents = str_ireplace($words[$i] . " "," <b>" . $words[$i] . "</b> ",$contents);
		$contents = str_ireplace(" " . $words[$i]," <b>" . $words[$i] . "</b> ",$contents);
	}
	
	file_put_contents($file,$contents);
	
?>
