/*
Manages the pickup and dropoff together so you can make incidental stops.
We drop everyone off before we pick them up.
*/
'use strict';
define(['dropoffQueue', 'pickupQueue', 'lodash'], function(DropoffQueue, PickupQueue, _) {
    var Mananger = function(event) {
        this.dropoffQueue = new DropoffQueue(event);
        this.pickupQueue = new PickupQueue(event);
        this.array = [this.dropoffQueue, this.pickupQueue];
    };

    Mananger.prototype.getDropoff = function() {
        return this.dropoffQueue;
    };

    Mananger.prototype.getPickup = function() {
        return this.pickupQueue;
    };

    //Gets the command.
    Mananger.prototype.getCommand=function(floor,doorsOpen){
        //If there are no queues, we end this quickly.
        var nothing=_.every(this.array,function(queue){
            return queue.isEmpty();
        });
        if (nothing){
            return 'NOTHING';
        }
        //Get suggested command from first queue that has one.
        var suggestedCommand=this.suggestedCommand(floor);
        //Apply global knowledge and knowledge of the door to change the decision.
        var command=this.doorControlInterceptor(suggestedCommand,floor,doorsOpen);
        return command;
    }

    //Overrides decision the suggested decision by seeing if we should open the door for someone.
    //Or if we need to close the door before we can go.
    Mananger.prototype.doorControlInterceptor = function(suggestedCommand, floor, doorsOpen) {
        if (suggestedCommand === 'OPEN') {
            return suggestedCommand;
        }
        if (suggestedCommand === 'UP' || suggestedCommand === 'DOWN') {
            var openDoors = _.some(this.array, function(queue) {
                return queue.includesFloorAndDirection(floor, suggestedCommand);
            });
            if (openDoors) {
                return 'OPEN_'+suggestedCommand;
            }
            if (doorsOpen){
                return 'CLOSE';
            }
            return suggestedCommand;
        }
        throw new Error('Found no command in doorControlInterceptor!');
    };
    //The first queue with a person suggests where to go.
    Mananger.prototype.suggestedCommand = function(floor) {
        var command = 'NOTHING';
        _.find(this.array, function(queue) {
            if (queue.isEmpty()) {
                return false;
            }
            command = queue.suggestCommand(floor);
            return true;
        });
        return command;
    };

    return Mananger;

});
