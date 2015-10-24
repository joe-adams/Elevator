/**
Maybe this is more of queue.  Basically it only takes unique objects and tell you whose at the front.
There are certainly libraries that can be to make this kind of functionality, but I haven't reviewed them yet,
and I don't know about their browser compatability.
**/
'use strict';
define(['lodash'], function(_) {
	var orderedSet=function(){
		this.arr=[];
		_.bindAll(this);
	};

	//Match by predicate
	orderedSet.prototype.some=function(target){
		return _.some(this.arr,target);
	};

	//Does it include this object
	orderedSet.prototype.includes=function(val){
		if (_.isNumber(val)){
			return _.includes(this.arr,val);
		}
		var matcher=_.matches(val);
		return _.some(this.arr,matcher);
		
	};
	//Can only push if item is not in there.
	orderedSet.prototype.push=function(val){
		if(this.includes(val)){
			return;
		}
		this.arr.push(val);
	};

	//remove
	orderedSet.prototype.remove=function(target){
		_.remove(this.arr,target);
	};

	//Get first object
	orderedSet.prototype.readHead=function() {
		if(this.arr.length<1){
			return false;
		}
		return this.arr[0];
	};

	orderedSet.prototype.isEmpty=function() {
		return this.arr.length<1;
	};

	//Just a string of the internal array.
	orderedSet.prototype.toString=function() {
		return JSON.stringify(this.arr);
	};

	return orderedSet;

});