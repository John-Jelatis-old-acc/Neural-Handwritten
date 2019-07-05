(function(self) {
    'use strict';
    /*
     * Filename: error.js
     * Date Created: July 4, 2019
     * Contributers: @John-Jelatis
     * Description: Alerts all errors for mobile devices without dev console
     * Version: 0.0.1
     */

    self.addEventListener('error', function(err) {
        self.alert(err.message + '\n\t' + err.lineno + ':' + err.colno + '\n\t'
            + err.filename);
    });
})(this);