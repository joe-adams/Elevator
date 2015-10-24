'use strict';
define(['jquery', 'event', 'repaint', 'queueManager', 'lodash'], function($, Event, repaint, QueueManager, _) {
    /**
     * This an extremely simple interface for an Elevator Operator.
     */
    var ElevatorOperator = function() {
        var klass = function() {
            this.init.apply(this, arguments);
        };

        klass.fn = klass.prototype;
        klass.fn.klass = klass;

        /**
         * Initializes this ElevatorOperator instance, setting the starting
         * floor for the elevator, the initial state of the doors, ant the
         * top floor in the building.
         */
        klass.fn.init = function(startingFloor, doorsOpen, topFloor, initialInterval) {
            this.currentFloor = startingFloor;
            this.doorsOpen = doorsOpen;
            this.maxFloor = topFloor;
            this.event = new Event();
            var emergency = new QueueManager(this.event);
            var standard = new QueueManager(this.event);
            this.emergencyDropoff = emergency.getDropoff();
            this.emergencyPickup = emergency.getPickup();
            this.dropoff = standard.getDropoff();
            this.pickup = standard.getPickup();
            this.queues = [emergency, standard];
            this.step = _.bind(this.step, this);
            this.intervalTime=initialInterval;
            if (initialInterval) {
                this.setInterval(initialInterval);
            }
            this.repaintHandler();
        };

        //Run the elevator
        klass.fn.setInterval = function(time) {
            this.intervalTime=time;
            if (this.interval) {
                clearInterval(this.interval);
            }
            this.interval = setInterval(this.step, time);
            this.repaintHandler();
        };

        //stop
        klass.fn.clearInterval = function() {
            this.intervalTime=null;
            if (this.interval) {
                clearInterval(this.interval);
            }
            this.repaintHandler();
        };

        /**
         * Returns the current location (floor number) of the elevator.
         */
        klass.fn.getCurrentFloor = function() {
            return this.currentFloor;
        };

        /**
         * Returns a boolean indication of whether or not the elevator
         * doors are currently open.
         */
        klass.fn.areDoorsOpen = function() {
            return this.doorsOpen;
        };

        //Uses new state to repaint the screen.
        klass.fn.repaintHandler = function(addLog) {
            var queues = {
                emergencyDropoff: this.emergencyDropoff.toString(),
                emergencyPickup: this.emergencyPickup.toString(),
                dropoff: this.dropoff.toString(),
                pickup: this.pickup.toString()
            }
            repaint(this.areDoorsOpen(), this.getCurrentFloor(), queues,!!this.interval,this.intervalTime,addLog);
        }

        /**
         * Takes one of the following actions, updating the state of
         * the elevator:
         *  - Moves up
         *  - Moves down
         *  - Opens doors
         *  - Closes doors
         *  - Do nothing
         */
        klass.fn.step = function() {
            var command = 'NOTHING';
            _.find(this.queues, function(queue) {
                var innerCommand = queue.getCommand(this.getCurrentFloor(), this.areDoorsOpen());
                if (innerCommand === 'NOTHING') {
                    return false;
                }
                command = innerCommand;
                return true;
            }, this);
            //The command is actually the name of a function.  This is why JavaScript is cool.
            if (command) {
                this[command]();
            }
            this.repaintHandler(true);

        };

        /**
         * Indicates that a customer is waiting on the specified floor
         * to be picked up.
         */
        klass.fn.requestPickupUp = function(floor) {
            this.pickup.push({
                floor: parseInt(floor),
                direction: 'UP'
            });
            this.repaintHandler();

        };

        klass.fn.requestPickupDown = function(floor) {
            this.pickup.push({
                floor: parseInt(floor),
                direction: 'DOWN'
            });
            this.repaintHandler();
        };

        /**
         * Indicates that a customer inside the elevator has requested
         * to be dropped off at the specified floor.
         */
        klass.fn.requestDropoff = function(floor) {
            this.dropoff.push(parseInt(floor));
            this.repaintHandler();
        };

        klass.fn.requestEmergencyDropoff = function(floor) {
            this.emergencyDropoff.push(parseInt(floor));
            this.repaintHandler();
        };

        klass.fn.requestEmergencyPickupUp = function(floor) {
            this.emergencyPickup.push({
                floor: parseInt(floor),
                direction: 'UP'
            });
            this.repaintHandler();
        };

        klass.fn.requestEmergencyPickupDown = function(floor) {
            this.emergencyPickup.push({
                floor: parseInt(floor),
                direction: 'DOWN'
            });
            this.repaintHandler();
        };

        //Handle the different commands.s
        klass.fn.UP = function() {
            this.currentFloor++;
        };

        klass.fn.DOWN = function() {
            this.currentFloor--;
        };

        klass.fn.OPEN = function() {
            this.event.fire(this.currentFloor);
            this.doorsOpen = true;
        };

        klass.fn.OPEN_UP = function() {
            this.event.fire(this.currentFloor, 'UP');
            this.doorsOpen = true;
        };

        klass.fn.OPEN_DOWN = function() {
            this.event.fire(this.currentFloor, 'DOWN');
            this.doorsOpen = true;
        };

        klass.fn.CLOSE = function() {
            this.doorsOpen = false;
        };

        klass.fn.NOTHING = function() {};

        return klass;
    }();

    return ElevatorOperator;
});
