//To add new user for DB with read and write permission
//To execute this script run 
//mongo localhost:27017/mybooks scritps\db\createNewUser.js

db.createUser({
	user: "test",
	pwd: "test",
	roles: [
	{
		role: "readWrite",
		db: "mybooks"
	}]
});