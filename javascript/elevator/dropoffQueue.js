/**
Dropoffs are numbers that represent a floor.
**/
'use strict';
define(['queueParent'], function(QueueParent) {
    var commander = function() {
        QueueParent.apply(this,arguments);
    };

    commander.prototype=new QueueParent();
    commander.prototype.constructor=commander;

    commander.prototype.nextFloor=function(){
        return this.queue.readHead();
    };

    commander.prototype.includesFloor=function(floor){
        return this.queue.includes(floor);
    }

    commander.prototype.includesFloorAndDirection=function(floor,direction){
        return this.includesFloor(floor);
    };

    commander.prototype.match=function(floor){
        return function(item){
            return item===floor;
        }
    }
    commander.prototype.remove=function(floor,direction){
        var matcher=this.match(floor);
        this.queue.remove(matcher);
    }


    return commander;

});
