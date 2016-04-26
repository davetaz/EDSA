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

You can then run the term highlighter on the output file to highlight key words

php highlight_terms.php output.html

You can add terms to highlight_terms.php by editing it in a text editor and simply adding them to the array. There are plenty there already, just add a new line with the same syntax. 

You can then open the result in a web browser (drag and drop to address bar)

Done
