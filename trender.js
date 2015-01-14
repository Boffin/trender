var C = {
    AXIS_SCALE_LIN: 1,
    AXIS_SCALE_LOG: 2
};


var settings = {
    axis: {
        x: {
            id: 'x',
            scale: C.AXIS_SCALE_LIN
        },
        y: {
            id: 'y',
            scale: C.AXIS_SCALE_LIN
        }
    },
    metrics: {
        statuses: {
            id: 'statuses',
            title: 'Amount of statuses'
        },
        followers: {
            id: 'followers',
            title: 'Amount of followers'
        },
        following: {
            id: 'following',
            title: 'Amount of following'
        }
    }
};


/**
 * @param options
 * @constructor
 */
var Trender = function(options) {
    this._options = options;
    this._axis = {};
    this._metrics = {};

    // initialize different components
    for (var i in settings.axis) {
        this._axis[i] = new Axis(settings.axis[i]);
    }
    for (i in settings.metrics) {
        this._metrics[i] = new Metric(settings.metrics[i]);
    }
};


/**
 * @param {string} options.id
 * @param {number} options.scale
 * @constructor
 */
var Axis = function(options) {
    this._options = options;
};


/**
 * @param {string} options.id
 * @param {string} options.title
 * @constructor
 */
var Metric = function(options) {
};


$(document).ready(function() {
    var t = new Trender({});
});