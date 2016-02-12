$(document).keypress(function(e) {
        if (e.which == 104) {
                hop = $("#helpBox").css('display');
		console.log("Hello " + hop);
                if (hop == "none") {
			$("#helpBox").fadeIn();
                } else {
			$("#helpBox").fadeOut();
                }
        }
});
function showHelp() {
	$("#helpBox").fadeIn();
}
function hideHelp() {
	$("#helpBox").fadeOut();
}
