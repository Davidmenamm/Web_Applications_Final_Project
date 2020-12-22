Create USER 'ChatAdmin'@'localhost' identified with mysql_native_password by 'AppChatAdmin202012';
GRANT ALL PRIVILEGES on mydb.* to 'ChatAdmin'@'localhost';
flush privileges;