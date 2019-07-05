(function(self) {
    'use strict';
    /*
     * Filename: neural.js
     * Date Created: July 4, 2019
     * Contributers: @John-Jelatis, @jbrundage
     * Description: Creates a Braincell Object you can use for many things
     * Version: 0.0.2
     */

    var BraincellInstance;

    BraincellInstance = function(size, rate) {
        this.size = size || 1;
        this.learningRate = rate || 1;
        this.weights = Array.from({ 'length': this.size }, function() { return 0; });
    };

    BraincellInstance.prototype = {
        'guess': function(input) {
            var sum, idx;

            if(typeof input === 'string') input = this.strToArray(input);

            sum = 0;
            for(idx = 0; idx < this.size; idx++)
                sum += input[idx] * this.weights[idx];

            return sum >= 0 ? 1 : -1;
        },
        'train': function(input, expectedOut) {
            var err, guessOut, idx, ret;

            if(typeof input === 'string') input = this.strToArray(input);
            
            guessOut = this.guess(input);
            err = expectedOut - guessOut;

            for(idx = 0; idx < this.size; idx++)
                this.weights[idx] += input[idx] * err * this.learningRate;
        },

        'strToArray': function(str) {
            var ret;

            ret = [ ];
            while(ret.length < this.size)
                ret[ret.length] = (str.charCodeAt(ret.length) || 0);

            return ret;
        },

        'save': function(name) {
            localStorage.setItem(name, JSON.stringify(this.weights));
        },
        'load': function(name) {
            var weights;

            try {
                weights = JSON.parse(localStorage.getItem(name));
            } catch(err) {
                //
            }
            
            if(weights) {
                this.weights = weights;
                return;
            }

            console.warn('[Braincell] You tried loading a nonexistant save');
            console.warn('[Braincell] Use braincell.save(\'' + name + '\') to save');
        }
    };

    self.Braincell = BraincellInstance;
})(this);