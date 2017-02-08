var request = require('request');
var fs = require('fs');

function capitalize(name){
    return name[0].toUpperCase() + name.slice(1);
}

function massage_users(userlist){
    return userlist.map(function(user){
        return {
            first: capitalize(user.name.first),
            last: capitalize(user.name.last),
            email: user.email,
            id: Math.floor(Math.random() * 16777215).toString(16),
            memberSince: new Date().toISOString(),
            membershipSource: ['Paid', 'Ceroc', 'Meetup'][Math.floor(Math.random() * 3)],
            credits: [0,0,0,0,0,1,1,1,2,2,3][Math.floor(Math.random() * 11)],
            isCrew: [false, false, false, false, false, false, false, true][Math.floor(Math.random() * 8)]
        }
    });
}

var random_user_url = 'https://randomuser.me/api/?nat=ca&seed=mjv&page=1&results=500&format=json&inc=name,email,id&dl&noinfo'

request(random_user_url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var userlist = JSON.parse(body).results;
    var updatedlist = massage_users(userlist);
    fs.writeFileSync('js/members.js', 'var members = ' + JSON.stringify(updatedlist, null, '\t'));
  }
})
