Installation Guide:

1. Install Node.js
  -1. Download and install Node.js from the official website https://nodejs.org/en
  -2. Verify the installation on your device's command prompt using the commands: node -v & npm -v

2. Setting up the server dependencies 
  -1. 

node.js install
npm install express body-parser mysql   ->MySQL install for database
npm install mysql2
npm install cors
download XAMPP to view datebases in GUI


To run back end server,command is node index.js
  To exit CTRL C


JSON

{
  "name": "soen287-group-project-nov11",
  "version": "1.0.0",
  "main": "index.js",                                               //possible change
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "description": "",
  "type": "commonjs"
}

Package.json Configuration: The "main": "index.js" field in your 
package.json file indicates the entry point for your application. 
If you change the name of your main file, make sure to update this 
field accordingly.