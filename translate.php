<?php

include "key.php";
 

$input_dir = "data/harvester/search_terms/";
$files = scandir($input_dir);
$output_lang = $argv[1];
echo $output_lang;
echo "\n\n";

for ($i=2;$i<count($files);$i++) {
	$file = $input_dir . $files[$i];
	$output_prefix = $output_dir . substr($files[$i],0,-4);
	processFile($file,$output_prefix);
}

function processFile($file) {
	global $output_lang;
	echo $file . "\n";
	$new_file = $file . "_" . $output_lang;
        //echo $output_prefix . "\n";
        $handle = fopen($file,"r");
	$whandle = fopen($new_file,"w");
        $headings = fgetcsv($handle);
	$headings[] = $output_lang;
	fputcsv($whandle,$headings);
        //writeOutput($output_prefix,$languages);
        //exit();
        while ($data = fgetcsv($handle)) {
                for ($i=0;$i<count($data);$i++) {
                        $language = $headings[$i];
                        $term = $data[$i];
			if ($language == "gb") {
                        	//echo "Fetching data for " . $term . " (" . $language . ") in $output_lang\n";
				$data[] =  Translate($term,$output_lang);
				fputcsv($whandle,$data);
			}
                }
        }
	fclose($handle);
	fclose($whandle);
	rename($new_file,$file);
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

?>
