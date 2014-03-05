'use strict';


var express = require('express');
var path    = require('path');
var debug   = require('debug');
var stylus  = require('stylus');



/**
 * Express configuration
 */
module.exports = function (app) {

	var config = app.get('config');

    app.configure('development', function () {
        app.use(require('connect-livereload')());

        // Disable caching of scripts for easier testing
        app.use(function noCache(req, res, next) {
            if (req.url.indexOf('/scripts/') === 0) {
                res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
                res.header('Pragma', 'no-cache');
                res.header('Expires', 0);
            }
            next();
        });

        app.use(stylus.middleware({
            src: __dirname + '/../../app/views/stylesheets', // .styl files are located in `views/stylesheets`
            dest: __dirname + '/../../app/styles/', // .styl resources are compiled `/stylesheets/*.css`
        }));

        app.use(express.static(path.join(config.root, '.tmp')));
        app.use(express.static(path.join(config.root, 'app')));
        app.use(express.errorHandler());
        app.set('views', config.root + '/app/views');
    });

    app.configure('production', function () {
        app.use(express.favicon(path.join(config.root, 'public', 'favicon.ico')));
        app.use(express.static(path.join(config.root, 'public')));
        app.set('views', config.root + '/views');
    });

    app.configure(function () {
        app.engine('html', require('ejs').renderFile);
        app.set('view engine', 'jade');
        app.use(express.logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded());
        app.use(express.methodOverride());
        app.use(express.cookieParser());
        app.use(express.session({
            secret: 'dasldjasidjaiodjioj2389ruhf278'
        }));
        app.use(function (req, res, next) {
            req.config = app.get('config');
            next();
        });

        // Router needs to be last
        app.use(app.router);

    });
};

