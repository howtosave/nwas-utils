//!/usr/bin/mongo
(function _(_dbhost, _dbname, _adminUser, _adminPassword, _addUsers) {
  var db = null;
  if (_adminUser) {
    // connect to the 'admin' database first for the auth.
    db = connect(_dbhost + "/admin", _adminUser, _adminPassword);
    // then change to the target database
    db = db.getSiblingDB(_dbname);
  } else {
    db = new Mongo(_dbhost).getDB(_dbname);
  }
  //printjson(db.getCollectionNames());
  if (_addUsers && _addUsers.length > 0) {
    // reset _addUsers
    _addUsers = [
      <% _.forEach(addUsers, function(user) { %>
        [ "<%= user[0] %>", "<%= user[1] %>"],
      <% }); %>
    ];
    if (_addUsers.length > 0) {
      var existingUsers = db.getUsers();
      //printjson(existingUsers);
      _addUsers.forEach(function __(user) {
        var existing = false;
        for (var i = 0; i < existingUsers.length; i++) {
          if (user[0] === existingUsers[i].user) {
            existing = true;
            break;
          }
        }
        if (existing) {
          db.updateUser(user[0],
            {
              pwd: user[1],
              roles: [{
                role: "readWrite",
                db: _dbname,
              }]
            });
        }
        else {
          // create user
          db.createUser({
            user: user[0],
            pwd: user[1],
            roles: [{
              role: "readWrite",
              db: _dbname,
            }]
          });
        }
      });
    }
  }
})("${dbhost}", "${dbname}", "${adminUser}", "${adminPassword}", ["${addUsers}"]);
