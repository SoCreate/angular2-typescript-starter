## Workstation Requirements

- [Node.js](https://nodejs.org/en/)  
  use the *Mature and Dependable* version
- Gulp  
  use `npm install -g gulp` after you have installed Node

## Getting Started

To get all modules:

    npm install

Then to build the client dependencies in `src`:  

    gulp
  
Finally, to start up the static server with live reload:

    gulp serve

*If you run into any wacky issues when npming or gulping you may want to blow away the `node_modules` 
dir and run an `npm install` again.*