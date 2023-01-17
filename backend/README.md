Library
Library is a project to study and a way to show my knowledge with Node.js and some libs.

Tech
TypeScript - TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.
Node - Node.js is open-source, cross-platform software based on Google's V8 interpreter that allows you to run JavaScript code outside of a web browser. The main feature of Node.js is its asynchronous and event-driven architecture.
body parser - body-parser is a module capable of converting the request body to various formats.
cors - is a mechanism that uses additional HTTP headers to inform a browser to allow a web application to run in an origin (domain) with permission to access selected resources from a server in an origin.
dotenv - is a lightweight npm package that automatically loads environment variables from a file.
express - is a framework for Node.js that provides minimal resources for building web servers.
file-system - It is a module that allows us to work with the computer's file system.
jsonwebtoken - is an Internet standard for creating data with optional signing and/or encryption
multer - it is used together with express on some chosen route. When used, multer will have options for storing files, such as their destination and name, what types of files and what is the maximum size allowed.
nodemon - is a command line interface utility and it monitors the file system and restarts the process automatically.

Installation
Install the dependencies and devDependencies

cd backend
npm install

How to use Start the server

initializing the back-end

cd backend 
npm run dev

After installing the dependencies and starting the servers, just access the address that appears in your terminal (usually http://localhost:4002/) The site has a protection system so that users who are not logged in do not have access to other pages than the Login page, so you will be immediately redirected to it, the user and password are:

email: admin@admin.com.br
password: Admin7242

Both can be changed directly by the db.json file

Once logged in, you have access to all pages on the site, being able to change and add new books, search and order in ascending or descending order.