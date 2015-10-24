'use strict';
define(['jquery', 'lodash'], function($, _) {
    return function(isOpen, floor, queues, hasInterval, intervalTime, addLog) {
        var door = isOpen ? 'Open' : 'Closed';
        $('#door').html(door);
        $('#floor').html(floor);
        _.forEach(queues, function(val, key) {
            $('#' + key + 'Queue').html(val);
        });
        var status;
        if (hasInterval) {
            status = 'Elevator is running with an interval of ' + intervalTime + ' ms';
        } else {
            status = 'Elevator is stopped.'
        }
        $('#status').html(status);
        if (addLog) {
            var log = 'Current Floor: ' + floor + ', Doors Open: ' + isOpen;
            var logDiv = $('#elevator-log');
            $('<div>', {
                class: 'state',
                text: log
            }).prependTo(logDiv);
        }
    }
});
