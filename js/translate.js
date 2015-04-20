function googleTranslateElementInit() {
  new google.translate.TranslateElement({pageLanguage: 'en', includedLanguages: 'az,be,bg,bs,ca,cs,cy,da,de,el,en,eo,es,et,fi,fr,ga,hr,hy,is,it,ka,lt,lv,mk,mt,nl,no,pl,pt,ro,ru,sk,sl,sq,sr,sv,tr,uk,uz', layout: google.translate.TranslateElement.InlineLayout.SIMPLE, gaTrack: true, gaId: 'UA-34573394-17'}, 'google_translate_element');  
}

$('document').ready(function () {
    $('#google_translate_element').on("click", function () {

        // Change font family and color
        $("iframe").contents().find(".goog-te-menu2-item div, .goog-te-menu2-item:link div, .goog-te-menu2-item:visited div, .goog-te-menu2-item:active div, .goog-te-menu2 *")
            .css({
                'color': '#730100',
                'font-family': 'tahoma'
            });

        // Change hover effects
        $("iframe").contents().find(".goog-te-menu2-item div").hover(function () {
            $(this).css('background-color', '#F38256').find('span.text').css('color', 'white');
        }, function () {
            $(this).css('background-color', 'white').find('span.text').css('color', '#544F4B');
        });

        // Change Google's default blue border
        $("iframe").contents().find('.goog-te-menu2').css('border', '1px solid #730100');
    });
});
