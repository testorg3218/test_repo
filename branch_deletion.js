var request = require('request-promise');
var async = require('async');
var unirest = require('unirest');
var mail = require('./send_mail.js')

var dltfn = function(branch, callback) {
  var dlturl = "https://api.github.com/repos/BalipalliGayathri/Repo/git/refs/heads/" + branch + "?access_token=688cb6e134ff89ba91e9b889a0630093d6261b55"
  unirest.delete(dlturl)
    .headers({
      'Content-Type': 'application/json',
      'User-Agent': 'Repo'
    })
    .end(function(response) {
      if (response.status != 204) {
        callback('err', null);
      } else {
        callback(null, response.status);
      }
    });
};

var options = {
  method: 'GET',
  uri: 'https://api.github.com/repos/BalipalliGayathri/Repo/branches?access_token=688cb6e134ff89ba91e9b889a0630093d6261b55',
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'Repo',
    'X-RateLimit-Limit': 50
  },
  json: true
};


request(options)
  .then(function(parsedBody) {
    async.each(parsedBody, function(file, callback) {
      unirest.get(file.commit.url + '?access_token=688cb6e134ff89ba91e9b889a0630093d6261b55')
        .headers({
          'Content-Type': 'application/json',
          'User-Agent': 'Repo'
        })
        .end(function(response) {
          var date1 = new Date();
          var date2 = new Date(response.body.commit.committer.date)
          var timeDiff = Math.abs(date2.getTime() - date1.getTime());
          var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
		 /*  console.log(date2);
		  console.log(date1)
		  console.log(diffDays);
		  console.log(file.name); */
          if (diffDays <= 1 && file.name != "master") {
            dltfn(file.name, function(err, result) {
              if (result) {
					 mail("gbalipalli@miraclesoft.com",file.name,function(response){
						 console.log('we have sent you a message on branch deletion')
					 })
                console.log('branch deletion success for ' + file.name);
              } else {
                console.log('error in branch deletion for' + file.name);
              }
            })
          } else {
            console.log('no branch to delete ');
          }
        })
    }, function(err) {
      console.log('something went wrong in getting the branches list');
    });
  })
  .catch(function(err) {
    console.log(err);
  });
