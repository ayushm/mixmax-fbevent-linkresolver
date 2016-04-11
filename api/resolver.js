var key = require('../utils/key');
var sync = require('synchronize');
var request = require('request');
var _ = require('underscore');
var moment = require('moment');


// The API that returns the in-email representation.
module.exports = function(req, res) {
  var url = req.query.url.trim();


  var matches = url.match(/events\/([0-9]+)/);
  if (!matches) {
    res.status(400).send('Invalid URL format');
    return;
  }

  var id = matches[1];

  var response;
  try {
    response = sync.await(request({
      url: 'https://graph.facebook.com/v2.5/' + id,
      qs: {
        access_token: key,
        fields: "name,owner,cover,place,description,attending_count,start_time,end_time"
      },
      json: true,
      timeout: 15 * 1000
    }, sync.defer()));
  } catch (e) {
    res.status(500).send('Error');
    return;
  }

  if(response.body.error) {
    res.status(404).send('No such event found');
    return;
  }

  //console.log(response.body.name);

  response = response.body;

  var eventName = response.name;
  var ownerName = response.owner.name;
  var coverUrl = response.cover.source;
  var description = response.description.substring(0, 300);
  if(response.description.length > 300) description += "...";
  var attendanceCount = response.attending_count;
  var eventUrl = "https://facebook.com/events/" + id;

  var startTimeMoment = moment(response.start_time);

  var startTime = startTimeMoment.format("MMM D (h:mma)");

  console.log(startTime);

  var eventLocationName = '';

  var eventLocationHTML = '';

  if(response.place) {
    eventLocationName = response.place.name;
    eventLocationHTML = '\
    \
      <div class="icon-container" id="event-location-container" style="text-align: center;float: left;display: inline-block;margin-right: 10px;padding-left: 10px;margin-top: 10px;margin-bottom: 10px;border-left: 1px solid #000;font-size: 10pt;max-width: 120px;">\
          <img class="event-icon" src="https://cdn3.iconfinder.com/data/icons/watchify-v1-0/70/location-70px-64.png" style="max-width: 32px;"><br>\
          <span id="event-attendance">' + response.place.name + '</span>\
        </div>\
    \
    ';
  }

  var googleFormattedStartDate = startTimeMoment.toISOString().replace(/-|:|\.\d\d\d/g,"");
  var googleFormattedEndDate = (response.end_time) ? moment(response.end_time).toISOString().replace(/-|:|\.\d\d\d/g,"") : googleFormattedStartDate;

  var googleCalendarUrl = 'http://www.google.com/calendar/event?action=TEMPLATE&text=' + encodeURIComponent(eventName) + '&dates=' + googleFormattedStartDate + '/' + googleFormattedEndDate + '&details=' + encodeURIComponent(response.description) + '&location=' + encodeURIComponent(eventLocationName) + '&trp=false&sprop=&sprop=name:';
  //console.log(googleCalendarUrl);
  //console.log(googleFormattedDate);


  var html = '\
\
<div id="mixmax-fbevent-preview-container" style="padding-bottom: 50px;width: 550px;height: 200px;font-family: \'proxima-nova\', \'Avenir Next\', \'Segoe UI\', \'Calibri\', \'Helvetica Neue\', Helvetica, Arial, sans-serif;">\
\
  <div id="cover-picture-container" style="float: left;height: 150px;width: 150px;display: inline-block;">\
    <img id="cover-picture" src="' + coverUrl + '" style="max-width: 150px;">\
    <a href="' + eventUrl + '" target="_blank" rel="nofollow"><button class="fbevent-button" id="facebook-button" style="margin-top: 10px;width: 150px;height: 40px;color: #fff;outline: none;border: none;cursor: pointer;text-decoration: none;background: #103C73;"><img src="https://cdn0.iconfinder.com/data/icons/yooicons_set01_socialbookmarks/48/social_facebook_box_white.png" style="width: 32px;vertical-align: middle;margin-left: -5px;margin-right: 5px;">View on Facebook</button></a>\
\
    <a href="' + googleCalendarUrl + '" target="_blank" rel="nofollow">\
    <button class="fbevent-button" id="calendar-button" style="margin-top: 10px;width: 150px;height: 40px;color: #fff;outline: none;border: none;cursor: pointer;text-decoration: none;background: #C75721;"><img src="https://cdn0.iconfinder.com/data/icons/yooicons_set01_socialbookmarks/48/social_google_box_white.png" style="width: 32px;vertical-align: middle;margin-left: -5px;margin-right: 5px;">Add to calendar +</button></a>\
  </div>\
\
  <div id="event-info" style="float: left;display: inline-block;height: 150px;width: 380px;margin-left: 20px;">\
    <div id="event-name" style="font-size: 14pt;font-weight: 600;">' + eventName + '</div>\
    <div id="owner-name" style="font-size: 11pt;//margin-top: 10px;">' + ownerName + '</div>   \
\
    <div class="icon-container" id="event-attendance-container" style="text-align: center;float: left;display: inline-block;margin-right: 10px;padding-left: 10px;margin-top: 10px;margin-bottom: 10px;border-left: 1px solid #000;font-size: 10pt;max-width: 45px;">\
      <img class="event-icon" src="https://cdn3.iconfinder.com/data/icons/watchify-v1-0/70/users-70px-64.png" style="max-width: 32px;"><br>\
      <span id="event-attendance">' + attendanceCount + '</span>\
    </div>\
\
    ' + eventLocationHTML + '\
\
    <div class="icon-container" id="event-time-container" style="text-align: center;float: left;display: inline-block;margin-right: 10px;padding-left: 10px;margin-top: 10px;margin-bottom: 10px;border-left: 1px solid #000;font-size: 10pt;max-width: 130px;">\
      <img class="event-icon" src="https://cdn3.iconfinder.com/data/icons/watchify-v1-0/70/calendar-70px-64.png" style="max-width: 32px;"><br>\
      <span id="event-time">' + startTime + '</span>\
    </div>\
\
    <br><br>\
\
    <div id="event-description" style="width: 330px;font-size: 10pt;float: left;">\
      ' + description + '\
    </div>  \
\
\
  </div>\
\
  \
\
</div>\
\
\
\
  ';


  res.json({
    body: html
    // Add raw:true if you're returning content that you want the user to be able to edit
  });
};