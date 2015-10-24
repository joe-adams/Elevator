'use strict';
requirejs.config({
    paths: {
        lib: '../lib',
        jquery: ['//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min',
            '../lib/jquery-1.10.2'
        ],
        lodash: ['../lib/lodash'],
        bootstrap: ['../lib/bootstrap']
    },
    shim: {
        'bootstrap':{
            deps:['jquery']
        }
    }
});


require(['jquery', 'operator', 'intialRender', 'inputHandler','bootstrap'], function($, ElevatorOperator, intialRender, inputHandler) {
    var NUMBER_OF_FLOORS = 10;
    var INITIAL_INTERVAL=1000;
    intialRender(NUMBER_OF_FLOORS,INITIAL_INTERVAL);
    inputHandler(NUMBER_OF_FLOORS,INITIAL_INTERVAL);
});
