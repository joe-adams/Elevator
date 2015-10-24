/*
The two kinds of queues inherit from this.  Everything you need to manage a pickup queue or dropoff queue.
*/
'use strict';
define(['lodash', 'orderedSet'], function(_, OrderedSet) {

    var commander = function(event) {
        this.queue = new OrderedSet();
        this.push = this.queue.push;
        this.toString = this.queue.toString;
        this.isEmpty = this.queue.isEmpty;
        //Because of the inheritance patter used, I call the constructor to make prototypes.
        //That is the only reason there should not be an event.
        if (event) {
            this.event = event;
            this.event.addListener(this.remove, this);
        }
    };

    commander.prototype.nextFloor = function() {
        throw new Error("Must define me.");
    };

    commander.prototype.includesFloor = function(floor) {
        throw new Error("Must define me.");
    };

    commander.prototype.includesFloorAndDirection = function(floor, direction) {
        throw new Error("Must define me.");
    };

    commander.prototype.remove = function(floor, direction) {
        throw new Error("Must define me.");
    }

    //Doesn't know if door is open or closed.
    //This feed into another method that wants to know where this queue wants to go, and doesn't need to be told to close the door.
    //Basically just take everyone in order.  You can stay to pick someone up.
    //Or you can suggest up or down.
    commander.prototype.suggestCommand = function(floor) {
        var next = this.nextFloor();
        if (next === floor) {
            return 'OPEN';
        }
        if (next < floor) {
            return 'DOWN';
        }
        if (next > floor) {
            return 'UP';
        }
        throw new Error('Found no command!');
    };

    return commander;

});
