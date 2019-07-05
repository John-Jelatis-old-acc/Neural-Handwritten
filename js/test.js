(function(self) {
    'use strict';
    /*
     * Filename: test.js
     * Date Created: July 4, 2019
     * Contributers: @John-Jelatis
     * Description: Handwritten Recognition Test via js/neural.js
     * Version: 0.0.4
     */

    var brain, training, characterDrawing, training, train;
    var canvas, context, draw, pixels, mouseIsDown, size;
    var toggleTrainBtn, pixelWidth, showWeights, guess, gtexts;
    var showWeightsBtn, whatToDrawLabel, displayMessage;

    displayMessage = { 'expire': Infinity, 'text': '' };

    size = 16;
    pixelWidth = (Math.min(self.innerWidth, self.innerHeight) * .8) / size | 0;

    showWeights = false;

    brain = new Braincell(size * size, .1);

    canvas = document.createElement('canvas');
    context = canvas.getContext('2d');

    pixels = Array.from({ 'length': brain.size }, function() { return -1; });

    training = true;
    mouseIsDown = false;

    characterDrawing = -1;

    gtexts = [
        ['Is that a ', ' I see?'], // Tryna be creative
        ['I\'d bet that is a ', ', but I am poor.'], // Well
        ['That is a ', ', right?'], // ...
        ['Unheard of! It is a ', '!'], // *sarcasm intensifies*
        ['That is a ', ' if I am not mistaken.'], // Ok seriously
        ['Is this the real ', '? Is this just fantasy?'], // :music: caught in a landslide to escape from reality 
        ['Bleep bloop the bot says ', '.'], // ...
        ['No one knows, \'', '\' comes and goes.'], // Goodbye, Ruby Tuesday, who could hang a name on you?
        ['Ooh! I know! A ', ', is it not?!']
    ];

    guess = function() {
        var ret, n, idx;

        ret = brain.guess(pixels);
        n = ret === 1 ? 'one' : 'zero';
        console.info(ret + ' -> ' + n);
        displayMessage.expire = Date.now() + 3000;
        idx = Math.random() * gtexts.length | 0;
        displayMessage.text = gtexts[idx][0] + n + gtexts[idx][1];

        for(idx = 0; idx < pixels.length; idx ++)
            pixels[idx] = -1;
    };

    train = function() {
        var idx;

        brain.train(pixels, characterDrawing);

        for(idx = 0; idx < pixels.length; idx ++) pixels[idx] = -1;

        characterDrawing *= -1;

        brain.save('handwritten' + size);
    };

    canvas.addEventListener('mousedown', function(evt) {
        var brect, x, y;

        brect = evt.target.getBoundingClientRect();

        mouseIsDown = true;

        x = (evt.pageX - brect.left) / pixelWidth | 0;
        y = (evt.pageY - brect.top - document.documentElement.scrollTop) / pixelWidth | 0;

        pixels[x + y * size] = -1;
    });

    canvas.addEventListener('mousemove', function(evt) {
        var brect, x, y;

        brect = evt.target.getBoundingClientRect();

        if(!mouseIsDown) return;

        x = (evt.pageX - 3 - brect.left) / pixelWidth | 0;
        y = (evt.pageY - 3 - brect.top - document.documentElement.scrollTop) / pixelWidth | 0;

        pixels[x + y * size] = 1;
    });

    canvas.addEventListener('mouseup', function(evt) {
        mouseIsDown = false;

        if(training) {
            train();
        } else {
            guess();
        }
    });

    canvas.addEventListener('touchstart', function(evt) {
        var brect, x, y;

        evt.preventDefault();
        brect = evt.target.getBoundingClientRect();

        mouseIsDown = true;

        x = (evt.changedTouches[0].pageX - 3 - brect.left) / pixelWidth | 0;
        y = (evt.changedTouches[0].pageY - 3 - brect.top - document.documentElement.scrollTop) / pixelWidth | 0;

        pixels[x + y * size] = 1;
    });

    canvas.addEventListener('touchmove', function(evt) {
        var brect, x, y;

        evt.preventDefault();
        brect = evt.target.getBoundingClientRect();

        if(!mouseIsDown) return;

        x = (evt.changedTouches[0].pageX - 3 - brect.left) / pixelWidth | 0;
        y = (evt.changedTouches[0].pageY - 3 - brect.top - document.documentElement.scrollTop) / pixelWidth | 0;

        pixels[x + y * size] = 1;
    });

    canvas.addEventListener('touchend', function(evt) {
        evt.preventDefault();
        mouseIsDown = false;

        if(training) {
            train();
        } else {
            guess();
        }
    });

    draw = function() {
        var on, x, y;

        whatToDrawLabel.innerHTML = (training ? 
            ('Draw a ' + (characterDrawing === 1 ? 'one' : 'zero')) :
            ('Ok, my turn to play. You draw, and I\'ll guess')) + '.'
            + '<br/>' + displayMessage.text;
        if(displayMessage.expire <= Date.now())
            displayMessage.text = '', displayMessage.expire = Infinity;


        for(x = 0; x < size; x ++) {
            for(y = 0; y < size; y ++) {
                if(showWeights)
                    context.fillStyle = (
                        pixels[x + y * size | 0] == 1 ? '#ffff' : '#0000'
                    ) + Math.abs(
                        brain.weights[x + y * size] * 5 + 80
                    ).toString(16).padStart(2, 0);
                else 
                    context.fillStyle = pixels[x + y * size | 0] == 1 ? '#ffffff' : '#000000';

                context.fillRect(x * pixelWidth, y * pixelWidth, pixelWidth, pixelWidth);
            }
        }
        requestAnimationFrame(draw);
    };

    toggleTrainBtn = document.createElement('a');
    toggleTrainBtn.addEventListener('click', function() {
        training = !training;
        toggleTrainBtn.innerHTML = training ? 'Start Guessing' : 'Start Training';
    });
    toggleTrainBtn.classList.add('button');
    toggleTrainBtn.innerHTML = 'Start Guessing';

    showWeightsBtn = document.createElement('a');
    showWeightsBtn.addEventListener('click', function() {
        showWeights = !showWeights;
        showWeightsBtn.innerHTML = showWeights ? 'Hide Weights' : 'Show Weights';
    });
    showWeightsBtn.classList.add('button');
    showWeightsBtn.innerHTML = 'Show Weights';

    whatToDrawLabel = document.createElement('label');
    whatToDrawLabel.innerHTML = 'Draw a zero';

    self.addEventListener('DOMContentLoaded', function() {
        canvas.width = size * pixelWidth;
        canvas.height = size * pixelWidth;

        document.body.appendChild(canvas);
        document.body.appendChild(document.createElement('br'));
        document.body.appendChild(toggleTrainBtn);
        document.body.appendChild(showWeightsBtn);
        document.body.appendChild(document.createElement('br'));
        document.body.appendChild(whatToDrawLabel);

        brain.load('handwritten' + size);

        draw();
    });

    self.addEventListener('resize', function() {
        pixelWidth = (Math.min(self.innerWidth, self.innerHeight) * .8) / size | 0;
        canvas.width = size * pixelWidth;
        canvas.height = size * pixelWidth;
    });

    // Make it read only but accessible
    Object.defineProperties(self, {
        'brain': {
            'get': function() { return Object.assign({ }, brain); }
        },
        'weights': {
            'get': function() { return Object.assign([ ], brain.weights); }
        }
    });
})(this);