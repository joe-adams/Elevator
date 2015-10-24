/**
Since we have configurable variables, we have to do some JavaScript rendering.
**/
'use strict';
define(['jquery', 'lodash'], function($, _) {
    return function(numberOfFloors,initialInterval) {
        $(function() {
            $('#intervalTime').val(initialInterval);
            var logDiv = $('#elevator-log');
            if (logDiv.length <= 0) {
                var logDiv = $('<div>', {
                    id: 'elevator-log'
                }).appendTo($('body'));
            }
            var queues = [{
                template: $('#pickupTemplate').html(),
                method: 'requestEmergencyPickup',
                container: 'EmergencyPickup'
            }, {
                template: $('#dropoffTemplate').html(),
                method: 'requestEmergencyDropoff',
                container: 'EmergencyDropoff'
            }, {
                template: $('#pickupTemplate').html(),
                method: 'requestPickup',
                container: 'Pickup'
            }, {
                template: $('#dropoffTemplate').html(),
                method: 'requestDropoff',
                container: 'Dropoff'
            }];

            _.forEach(queues, function(queue) {
                var newHtml = '<div class="row"><div class="span2"></div>';
                for (var i = 1; i <= numberOfFloors; i++) {
                    newHtml += queue.template.replace(/FLOOR/g, "" + i).replace(/ROLE/g, queue.method).replace(/NAME/g, queue.name);
                    if (i % 5 == 0 && i != numberOfFloors) {
                        newHtml += '</div><div class="row"><div class="span2"></div>';
                    }
                }
                newHtml += '</div>';
                $('#' + queue.container).html(newHtml);
            });

        });
    };
});
