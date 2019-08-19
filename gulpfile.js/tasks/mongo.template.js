printjson({a:0});
//!/usr/bin/mongo
var dbhost = '${dbhost}';
var dbname = '${dbname}';
var adminUser = '${adminUser}';
var adminPassword = '${adminPassword}';
var addUsers = [[${addUsers}]];
var db = null;
if (adminUser) {
  // connect to the 'admin' database first for the auth.
  db = connect(`${dbhost}/admin`, adminUser, adminPassword);
  // then change to the target database
  db = db.getSiblingDB(dbname);
} else {
  db = new Mongo(dbhost).getDB(dbname);
}
//printjson(db.getCollectionNames());
if (addUsers && addUsers.length > 0) {
  existingUsers = db.getUsers();
  //printjson(existingUsers);
  addUsers.forEach((user) => {
    var existing = false;
    for (i = 0; i < existingUsers.length; i++) {
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
            db: dbname,
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
          db: dbname,
        }]
      });
    }
  });
}