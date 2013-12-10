var locomotive = require('locomotive');
var Controller = locomotive.Controller;
var Imap = require('imap');
var MailParser = require('mailparser').MailParser;
var inspect = require('util').inspect;
var mimelib = require('mimelib');
var fs = require('fs');
var email = require('emailjs');
var _ = require('underscore');

var MailController = new Controller();
var output = [];

MailController.before('index', function( next ) {
  var app = this.app;
  if(this.params('box')) {
    app.imap.openBox( this.params('box'), function(error, mailbox) {
      if(error) throw error;
      app.mailbox = mailbox;

      console.log(mailbox);
      next();
    });
  } else {
    next();
  }
});

MailController.before('index', function( next ) {
  
  var app = this.app;
  var options = 'ALL';
  var date = ['SINCE', 'Septembre 6, 2013'];

  if(this.params('q')) {
    options = ['TEXT', this.params('q')];
    date = ['SINCE', 'January 1, 2013'];
  }

  if(this.params('tag')) {
    console.log(this.params('tag'));
    options = ['KEYWORD', this.params('tag')];
    date = ['SINCE', 'January 1, 2013'];
  }

  app.imap.search([ options, date ], function(error, results) {
    if(error) die(error);

    try {
      var f = this.fetch( results, { 
        bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE CONTENT-TYPE)',
        struct: true
      });

      f.on('message', function(msg, seqno) {
        var hdrs = {};

        msg.on('body', function(stream, info) {
          var buffer = '';

          stream.on('data', function(chunk) {
            buffer += chunk.toString('utf8');
          });

          stream.once('end', function() {
            hdrs = Imap.parseHeader(buffer);          
          });
        });

        msg.once('attributes', function(attrs) {
          //hdrs = attrs;
          hdrs.id = attrs.uid;
          hdrs.flags = attrs.flags;
          hdrs.to = mimelib.parseAddresses(hdrs.to);
          hdrs.from = mimelib.parseAddresses(hdrs.from);
          hdrs.date = new Date(hdrs.date);
        });

        msg.once('end', function() {
          output.push(hdrs);
        });
      });

      f.once('error', function(error) {
        console.log('Fetch Error');
      });

      f.once('end', function() {
        next();
      });

    } catch( error ) {
      console.log(error);
      next();
    }

  });
});

MailController.index = function() {
  this.output = JSON.stringify(output);
  this.render();
};

MailController.before('show', function( next ) {

  var self = this;

  var f = this.app.imap.fetch(self.params('id'), {bodies: ''});

  f.on('message', function(msg, seqno) {
    var attributes = {};

    var mailparser = new MailParser({
      streamAttachments: true
    });

    msg.on('body', function(stream, info) {
      var buffer = '';

      mailparser.on("attachment", function(attachment) {
        var out = fs.createWriteStream('public/attachements/' + attachment.generatedFileName);
        attachment.stream.pipe(out);
      });

      mailparser.on('error', function(error) {
        console.log(error);
      });

      mailparser.on('end', function(mail) {
        mail.flags = attributes.flags;
        output.push(mail);
        next();
      });

      stream.on('data', function(chunk) {
        mailparser.write(chunk.toString());
      });

      stream.once('end', function() {
        mailparser.end();
      });
    });

    msg.once('attributes', function(attrs) {
      attributes.flags = attrs.flags;
    });

    msg.once('end', function() {
      //next();
    });
  });

  f.once('error', function(error) {
    console.log('Fetch Error');
  });

  f.once('end', function() {
    //next();
  });
});

MailController.show = function() {
  this.output = JSON.stringify(output);
  this.render();
};

MailController.before('create', function( next ) {
  var app = this.app;

  var server  = email.server.connect({
     user:    "jgavanleeuwen@gmail.com", 
     password:"Element1", 
     host:    "smtp.gmail.com", 
     ssl:     true
  });

  console.log(this.params('to'));
  console.log(this.params('subject'));

  var message = {
      text:       this.params('text'),
      html:       this.params('text'),
      from:       "Jeroen van Leeuwen <jgavanleeuwen@gmail.com>", 
      to:         "Jeroen <jgavanleeuwen@gmail.com>",
      subject:    this.params('subject'),
      attachment: [
        { data: this.params('text'), alternative: true}
      ]
  };

  server.send(message, function(err, message) {  
    console.log(err || message);
    next();
  });
});

MailController.create = function() {
  console.log('SENT MAIL');
  this.output = JSON.stringify({ success: true});
  this.render('show');
}

MailController.before('update', function( next ) {
  var app = this.app;
  var flg = _.intersection(['\\Flagged', '\\Seen'], this.params('flags'));
  console.log(flg);

  if (flg.length > 0) {
    app.imap.setFlags(this.params('id'), flg, function(error) {
      if (error) console.log(error);

      next();
    });
  } else {
    app.imap.delFlags(this.params('id'), ['\\Flagged', '\\Seen'], function(error) {
      if (error) console.log(error);

      next();
    });
  }
});

MailController.before('update', function( next ) {
  var app = this.app;

  if (this.params('box')) {
    
    app.imap.move(this.params('id'), this.params('box'), function(error) {
      if (error) console.log(error);

      next();
    });

  } else {
    next();
  }
});

MailController.before('update', function( next ) {
  var app = this.app;

  if (this.params('keyword')) {
    
    app.imap.addKeywords(this.params('id'), this.params('keyword'), function(error) {
      if (error) console.log(error);

      next();
    });

  } else {
    next();
  }
});

MailController.update = function() {
  this.output = JSON.stringify({ success: true});
  this.render('show');
}

MailController.after('*', function(next) {
  output = [];
  next();
});

module.exports = MailController;
