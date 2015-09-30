<?php
$output = "[";
$handle = opendir('.');
while ($entry = readdir($handle)) {
	if (strpos($entry,"json") > 0 && $entry != "all_data.json") {
		$output = $output . "\n" . file_get_contents($entry) . ",";
	}
}
closedir($handle);

$output = substr($output,0,-1) . "\n";
$output .= "]";

$handle = fopen("all_data.json","w");
fwrite($handle,$output);
fclose($handle);

?>
