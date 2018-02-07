module.exports = function(mailid,branch,callback){
var nodemailer = require('nodemailer');
 
// create reusable transporter object using the default SMTP transport 
var transporter = nodemailer.createTransport({service: 'Gmail',
                    auth: {
                        user: 'iotnode123@gmail.com',
                        pass: 'Miracle@123'	
}
});
 
// setup e-mail data with unicode symbols 
var mailOptions = {
    from: 'pavani sri <pavaniloukhya@gmail.com>', // sender address 
    to: mailid, // list of receivers 
    subject: 'github', // Subject line 
    text: 'Branch deletion', // plaintext body 
    html: 'Your branch "'+branch+'" got deleted succesfuly' // html body 
};
 
// send mail with defined transport object 
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }else{
    callback('success');
	}
});
}