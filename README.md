# Web_Applications_Final_Project

David Mena
Manolo Noboa
Juan Javier Arosemena

A simple prototype of a multi-layer web application implemented with React, includes a database, back-end and front-end.
To test the prototype, follow these steps:
  1. Execute the ChatScript.sql script on the web_chat_server folder, to create the database to be used.
  2. Execute the OldAuth.sql script to create a user with the old authentification used by mysql node.js package.
  3. Run the server.js by executing yarn install and yarn start on the web_chat_server folder.
  4. Run the client app by executing yarn install and yarn start on the web_chat_client folder.
  5. Enjoy.


If you wish to use the app within your local network (or through the internet if you wish) then you must change the line of code in line 9 in Socket.js from `'localhost'` to the IP of the machine running the server side.


Development:
1. Server side functionality
	* Base architecture (David)
	* Websocket interactions (David)
	* Global chat (David) 
	* Online user tracking (JJ)
	* Private chat (JJ)
2. Client side functionality
	* Base architecture (David)
	* Websocket interactions (David)
	* Global chat (David)
	* Private chat (JJ)
3. Data persistence (Manolo)
	* Database creation
	* Persistence of data from the server side