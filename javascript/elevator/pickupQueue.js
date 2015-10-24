/**
Pickups are objects with a floor and a direction.
**/
'use strict';
define(['queueParent'], function(QueueParent) {

    var commander = function() {
        QueueParent.apply(this, arguments);
    };

    commander.prototype = new QueueParent();
    commander.prototype.constructor = commander;

    commander.prototype.nextFloor = function() {
        return this.queue.readHead().floor;
    };

    commander.prototype.floorMatch = function(floor) {
        return function(item) {
            return item.floor === floor;
        };
    }

    commander.prototype.match = function(floor,direction) {
        return function(item) {
            return item.floor === floor&&item.direction===direction;
        };
    }

    commander.prototype.includesFloor = function(floor) {
        var matcher = this.floorMatch(floor);
        return this.queue.some(matcher);
    };
    
    commander.prototype.includesFloorAndDirection = function(floor, direction) {
        var matcher = this.match(floor,direction);
        return this.queue.some(matcher);
    };

    commander.prototype.remove=function(floor,direction){
        if(direction){
            this.removeFloorAndDirection(floor,direction);
        } else{
            this.removeFloor(floor);
        }
    }
    commander.prototype.removeFloor = function(floor) {
        var matcher = this.floorMatch(floor);
        this.queue.remove(matcher);
    }

    commander.prototype.removeFloorAndDirection = function(floor, direction) {
        var matcher = this.match(floor,direction);
        this.queue.remove(matcher);
    }

    return commander;

});
