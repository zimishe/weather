/**
 * Created by eugene on 19.12.2016.
 */

require('select2');
var $ = require('jquery');

function FrontCustom() {
    return {
        windowHeight: function() {
            var height = $(window).height();

            console.log('window height 111: ', height)
        }
    }
}

function FrontForm() {
    return {
        top: function () {
            var select = $('select');

            if (select.length) {
                select.select2({

                })
            }
        }
    }
}

var custom = new FrontCustom(),
    selectCustom = new FrontForm();

$(document).ready(function(){
    custom.windowHeight();

    selectCustom.top();
});

// hotfix text text text
