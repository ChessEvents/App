'use strict';

var CronJob = require('cron').CronJob;
var CSV = require('fast-csv');
var fs = require('fs');

var mongoose = require('mongoose');
//var Promise = require('promise');
var Player = mongoose.model('Player');

var RatingUpdateSchedule = mongoose.model('RatingUpdateSchedule');


// get list of files in directory:
/*
    var SET_FILES_FOR_PROCESSING = function() {

    // Get a list of all CSV's from data directory: 
    fs.readdir('app/data/', function (err, files) {

        console.log(files.length + ' files found in directory.');

        for (var i = files.length - 1; i >= 0; i--) {
            
            // Check if files have been processed:
            checkExists(files[i]);
        }

        console.log('Process complete.'.green);
    });

    var checkExists = function (fileName) {

        console.log('Checking file ' + fileName + '...');

        if(fileName !== '') {

            // Using directory file name to check database for file:
            RatingUpdateSchedule.findOne({ 'fileName' : fileName }, function (err, file) {

                if(!file) {

                    var fileSegments = fileName.split('-');

                    if(fileSegments.length === 6) {

                        if(fileSegments[0] === '555' && fileSegments[1] === '888') {

                                // FILE HAS PASSED BASIC VALIDATION! :-)

                                console.info('New file found, adding to database.'.green);

                                var newList = new RatingUpdateSchedule({
                                    fileName: fileName,
                                    body: fileSegments[2],
                                    gameType: fileSegments[3],
                                    month: fileSegments[4],
                                    year: fileSegments[5].split('.')[0],
                                    waitingForProcess: true,
                                    processDate: null,
                                    isProcessing: false,
                                    allowReprocess: false
                                });

                                newList.save(function (err, list) {
                                        if (err) {
                                           // error = true;
                                            return console.error(err);
                                        }
                                });

                        } else {
                            console.error('File invalid, key check does not match! ' + fileName.red);
                        }
                    } else {
                        console.error('File invalid, string name format needs to be {xxx-xxx-body-gameType-month-year} file is: ' + fileName.red);
                    }
                } else {
                    console.warn('File exists, moving on.'.yellow);
                }
            });

        }

    };

    };


    // check files against db

    var GET_FILE_NAMES_FOR_PROCESSING = function() {

        console.log('getting files!');

    	var list = function () {
    		return RatingUpdateSchedule.find({ '$or' : [ {'waitingForProcess': true } , { 'allowReprocess' : true } ] }, function (err, files) {
    		
                    if(err) {
                        return err;
                    }

                    console.log('got files.');
                    return files;
    		});
    	};

    	var processList = list();

        .then(function () {

            for (var i = processList.length - 1; i >= 0; i--) {
                console.log('Doing something with ' + processList[i].fileName);
            }

        });



    };

*/

//GET_FILE_NAMES_FOR_PROCESSING();

// return files which need processing


// process files 