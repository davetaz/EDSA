Thematic analyser
=================

You need an API key to open calais in a config file (api_key.php) You can get one from https://permid.org/onecalaisViewer by registering. 

The content of the api_key.php file is as follows (obviosly with your api_key going between the quotes).

<?php 
	
	$api_key = "";

?>


Content must be in a single file, one line per item (e.g. content.txt)

run the analyser and give the argument as the file name where the content is.

php run_analysis.php content.txt > output.html

Done
