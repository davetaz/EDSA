<?php
	
	$array = [];

	$handle = opendir('.');
	while (false !== ($entry = readdir($handle))) {
	        if ($entry != "." && $entry != ".." && strpos($entry,".csv") > 0) {
	            processFile($entry);
	        }
	}
	closedir($handle);

	function processFile($entry) {
		global $array;
		$prefix = explode(".",$entry)[0];
		$handle = fopen($entry,"r");
		$line = fgetcsv($handle);
		$codes = fgetcsv($handle);
		while ($line = fgetcsv($handle)) {
			$item = $line[0];
			for ($i=1;$i<count($codes);$i++) {
				$array[$codes[$i]][$prefix . "_" . $item] = $line[$i];
			}
		}
	}
	echo json_encode($array);	

?>
