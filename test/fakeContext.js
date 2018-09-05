(function() {

/*global module */


module.exports = function(){
        
    var fakeContext =  {

        /**
         *  @type {string}
         */
        fillStyle: "black",

        /**
         *  @type {number}
         */
        lineWidth: 1,

        /**
         *  @type {string}
         */
        strokeStyle: "black",

        /**
         *  Fake context.beginPath method. 
         * 
         *  @return {undefined}
         */
        beginPath: function (){
            fakeContext.beginPathCalls.push({
            });
        },

        /**
         *  Fake context.moveTo method. 
         * 
         *  @param {number} x - x
         *  @param {number} y - y
         *  @return {undefined}
         */
        moveTo: function(x, y){
            fakeContext.moveToCalls.push({
                x: x,
                y: y
            });
        },

        /**
         *  Fake context.lineTo method. 
         * 
         *  @param {number} x - x
         *  @param {number} y - y
         *  @return {undefined}
         */
        lineTo: function(x, y){
            fakeContext.lineToCalls.push({
                x: x,
                y: y
            });
        },

        /**
         *  Fake context.fill method. 
         * 
         *  @return {undefined}
         */
        fill: function(){
            fakeContext.fillCalls.push({
            });
        },

        /**
         *  Fake context.stroke method. 
         * 
         *  @return {undefined}
         */
        stroke: function(){
            fakeContext.strokeCalls.push({
            });
        },

        /**
         *  Fake context.fillRect method. 
         * 
         *  @param {number} x - x
         *  @param {number} y - y
         *  @param {number} width - width
         *  @param {number} height - height
         *  @return {undefined}
         */
        fillRect: function(x, y, width, height){
            fakeContext.fillRectCalls.push({
                x: x,
                y: y,
                width: width,
                height: height
            });
        },

        /**
         *  Fake context.fillText method. 
         * 
         *  @param {string} text - text
         *  @param {number} x - x
         *  @param {number} y - y
         *  @return {undefined}
         */
        fillText: function(text, x, y){
            fakeContext.fillTextCalls.push({
                text: text,
                x: x,
                y: y
            });
        },

        /**
         *  Fake context.measureText method. 
         * 
         *  @param {string} text - text
         *  @return {object} - width and height
         */
        measureText: function(text){

            fakeContext.measureTextCalls.push({
                text: text
            });

            return fakeContext.measureTextReturnValue;
        },

        /**
         *  Calls tracker for test for the context.beginPath method. 
         * 
         *  @type {array}
         */
        beginPathCalls: [],

        /**
         *  Calls tracker for test for the context.moveTo method. 
         * 
         *  @type {array}
         */
        moveToCalls: [],

        /**
         *  Calls tracker for test for the context.lineTo method. 
         * 
         *  @type {array}
         */
        lineToCalls: [],

        /**
         *  Calls tracker for test for the context.fill method. 
         * 
         *  @type {array}
         */
        fillCalls: [],

        /**
         *  Calls tracker for test for the context.stroke method. 
         * 
         *  @type {array}
         */
        strokeCalls: [],

        /**
         *  Calls tracker for test for the context.fillRect method. 
         * 
         *  @type {array}
         */
        fillRectCalls: [],

        /**
         *  Calls tracker for test for the context.fillText method. 
         * 
         *  @type {array}
         */
        fillTextCalls: [],

        /**
         *  Calls tracker for test for the context.measureText method. 
         * 
         *  @type {array}
         */
        measureTextCalls: [],

        /**
         *  Return value for fake context.measureText method. 
         * 
         *  @type {object}
         */
        measureTextReturnValue: {
            width: 0,
            height: 0
        }
    };

    return fakeContext;

};

}());
