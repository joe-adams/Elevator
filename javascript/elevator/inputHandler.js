/*
Input handler, handles input.  It creates the elevator operator and deligates commands to it.
It does some error handling too, since the operator doesn't really need to worry about that.
*/
'use strict';
define(['jquery', 'operator'], function($, ElevatorOperator) {
    return function(number_of_floors, initialInterval) {
        //Okay, this is an example of JavaScript being quirky.  But it really isn't as quirky as everyone says...
        function isNumber(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }

        function isInteger(n) {
            if(isNumber(n)){
                var val=parseFloat(n);
                return val === +val && val === (val | 0);
            }
            return false;
        }

        function boundCheck(n, max) {
            if (n < 1) {
                return false;
            }
            if (max && (n > max)) {
                return false;
            }
            return true;
        }
        //Is it an integer in range?
        function inputValid(input, maxNumber) {
            if (isInteger(input)) {
                var value = parseInt(input);
                if (boundCheck(value, maxNumber)) {
                    return {
                        valid: true,
                        value: value
                    };
                }
            }
            return {
                valid: false
            };
        }
        $(function() {
            var elevator = window.elevator || {};
            elevator.operator = new ElevatorOperator(1, true, number_of_floors, initialInterval);

            var $run = $('#run');
            var $stop = $('#stop');
            var $intervalTime = $('#intervalTime');
            var $errorModal = $('#errorModal');
            var $errorBody = $('#errorBody');
            var $floor = $('#floorText');
            //Bootstrap Modal.
            var error = function(message) {
                $errorBody.html(message);
                $errorModal.modal('show');
            }
            //Run steps on the specified interval.
            $run.click(function() {
                var text = $intervalTime.val();
                var validated = inputValid(text);
                if (validated.valid) {
                    elevator.operator.setInterval(validated.value);
                } else {
                    error('Invalid interval time.  You entered: ' + text);
                }
            });
            //Cancel interval, stop the elevator.
            $stop.click(function() {
                elevator.operator.clearInterval();
            });
            //There's a button for every floor, for dropoff, up, and down.
            $('#buttonControls').on('click', '[data-role]', function() {
                var floor = parseInt($(this).data('floor'));
                var command = $(this).data('role');
                elevator.operator[command](floor);
            });
            $('#textInput').on('click', '[data-role]', function() {
                var text = $floor.val();
                var validated = inputValid(text, number_of_floors);
                if (validated.valid) {
                    var floor = validated.value;
                    var command = $(this).data('role');
                    elevator.operator[command](floor);
                } else {
                    error('Invalid floor.  There are ' + number_of_floors + ' floors. You entered: ' + text);
                }

            });

        });
    };

});
