'use strict';

// helpful notes: https://github.com/ncb000gt/node-cron

var CronJob = require('cron').CronJob;
var CSV = require('fast-csv');
var mongoose = require('mongoose');
var Player = mongoose.model('Player');
var processed = false;
var error = false;

var updateMe = function () {

    /*
        Player.findByIdAndUpdate(
            '55b166bbeffec298166bec79',
            {$push: {'ratings': {
                                        ratingType: 'ecf',
                                        gameRatingType: 'standard',
                                        rating: 224,
                                        ratingDate: new Date(2014, 6, 1),
                                        ratingRef: null
                                    }
                        }
                },
            {safe: true, upsert: true, new : true},
            function(err, model) {
                console.log(err);
            }
        );
    */

    console.log(Player.find({ 'ratings.rating': '200', 'ratings.gameRatingType': 'rapidplay' }).count());

    //.exec(function (err, player) {
    //console.log('found!' + player);
    //});

};

//updateMe();

var ECF_GRADE_DOWNLOAD = new CronJob({
    cronTime: '0 * * * * *',
    onTick: function () {
        var dateTime = new Date();
        console.log('Checking to see if any new grades are ready to process ' + dateTime);

        if (!processed) {
            CSV.fromPath('app/data/grades-jan-15.csv')
                .on('data', function (data) {

                    if (!error) {

                        var record = {
                            ref: data[0],
                            name: data[1],
                            sex: data[2],
                            age: data[3],
                            gradeCat: data[4],
                            grade: data[5],
                            gradeCount: data[6],
                            gradeOld: data[7],
                            rapidCat: data[8],
                            rapid: data[9],
                            rapidCount: data[11],
                            rapidOld: data[10],
                            Clubs: [data[12], data[13], data[14], data[15], data[16], data[17]],
                            fideRef: data[18]
                        };

                        if (record.name !== 'Name') {

                            var name = record.name.split(',');
                            var surname = '';
                            var forename = '';

                            if (name.length > 1) {
                                surname = name[0];
                                forename = name[1];
                            } else {
                                surname = name[0];
                            }

                            var standardRating = {
                                ratingType: 'ecf',
                                gameRatingType: 'standard',
                                rating: TryParseInt(record.grade, 0),
                                ratingDate: new Date(2015, 1, 1),
                                ratingRef: record.ref
                            };

                            var rapidRating = {
                                ratingType: 'ecf',
                                gameRatingType: 'rapidplay',
                                rating: TryParseInt(record.rapid, 0),
                                ratingDate: new Date(2015, 1, 1),
                                ratingRef: record.ref
                            };


                            var player = new Player({
                                forename: forename,
                                surname: surname,
                                sex: record.sex,
                                ratings: [standardRating, rapidRating]
                            });

                            player.save(function (err, player) {
                                if (err) {
                                    error = true;
                                    return console.error(err);
                                }
                            });

                        }

                        processed = true;

                    }


                }).on('end', function () {
                    console.log('done');
                });

        } else {
            console.log('Nothing to process!');
        }

    },
    onComplete: function () {
        var dateTime = new Date();
        console.log('This job was completed at ' + dateTime);
    },
    start: false,
    timeZone: null
});


function TryParseInt(str,defaultValue) {
     var retValue = defaultValue;
     if(str !== null) {
         if(str.length > 0) {
             if (!isNaN(str)) {
                 retValue = parseInt(str);
             }
         }
     }
     return retValue;
}

ECF_GRADE_DOWNLOAD.start();


