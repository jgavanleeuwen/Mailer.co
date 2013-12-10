var Imap = require('imap');

module.exports = function( done ) {
  // Define custom MIME types.  Consult the mime module [documentation](https://github.com/broofa/node-mime)

  var self = this;
  
  this.imap = new Imap({
    user: self.prmt.username + '@gmail.com',
    password: self.prmt.password,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false }
  });

  this.imap.once('ready', function() {

    this.openBox('INBOX', true, function(error, mailbox) {
      if(error) die(error);

      self.mailbox = mailbox;

      self.imap.on('mail', function(items, err) {
        self.socket.emit('mail:new');
      });

      done();

    });
  });

  this.imap.once('error', function(err) {
    console.log(err);
  });

  this.imap.once('end', function() {
    console.log('Connection ended');
  });

  this.imap.connect();

}
