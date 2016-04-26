<?php
	include('api_key.php');
	require('opencalais.php');
	$file = $argv[1];

	$handle = fopen($argv[1],"r");
	while ($line = fgets($handle)) {
		$oc = new OpenCalais($api_key);
		$entities[] = $oc->getEntities($line);
		sleep(2);
	}
	fclose($handle);
	
	for ($i=0;$i<count($entities);$i++) {
		$current = $entities[$i];
		foreach($current as $type => $values) {
			for ($j=0;$j<count($values);$j++) {
				$value = $values[$j];
				$output[$type][$value][] = $i;
			}
		}
	}
	echo "<style>
h3 {
        width: 100%;
        padding: 10px;
        background-color: lightblue;
}
</style>";	
	echo "<h2>Total records: " . count($entities) . "</h2>";
	foreach($output as $type => $topics) {
		echo "<h3>" . $type . "</h3>";
		foreach($topics as $topic => $values) {
			if (count($values) > 2) {
				echo '<h4><a onClick="showHide(' . $topic . ');">' . $topic . ' [' . count($values) . ']</a></h4>';
				echo '<ul id="'.$topic.'_lines" style="display: block">';
				for ($i=0;$i<count($values);$i++) {	
					echo '<li id="' . $values[$i] . '">' . $values[$i] . ': ' . getLine($values[$i]) . '</li>';
				}
				echo '</ul>';
			}
		}
	}

function getLine($line) {
	global $file;
	$lines = file($file);
	return $lines[$line];
}

?>
