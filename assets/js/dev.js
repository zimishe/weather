/**
 * Created by eugene on 19.12.2016.
 */
var $ = require('jquery');

function DevStuff() {
    return {
        ajaxMessage: function() {
            var body = $('body');

            console.log('body', body);
        }
    }
}

var dev = new DevStuff();

$(document).ready(function(){
    dev.ajaxMessage();
});

// some random comment for dev branch

// another comment for dev branch
