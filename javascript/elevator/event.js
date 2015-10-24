/**
Very simple event handler.  There are libraries that do this better.
The event we register is the door being up on a floor so the people can leave.
**/
'use strict';
define(['lodash'], function(_) {

	var event=function(){
		this.listeners=[];
	};

	event.prototype.addListener=function(func,context){
		this.listeners.push({func:func,context:context});
	};

	event.prototype.fire=function(){
		var args=arguments;
		_.forEach(this.listeners,function(listener){
			listener.func.apply(listener.context,args);
		});
	};


	return event;

});