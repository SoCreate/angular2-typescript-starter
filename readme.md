## Workstation Requirements

- Node.js
- Gulp

## Getting Started

To get all modules:

    npm install

Then to build the client dependencies in `src`:  

    gulp
  
Finally, to start up the static server with live reload:

    gulp serve


## What we need it to do

- Do the TypeScript thing
- Include Angular type definitions
- Do the Angular specific transpiling (traceur)
- Do module loading (System.js)
- Include Angular additionals like Router, HTTP, etc
- Have a web server host for static files (to deliver the client)
- Support browser url routing
- Probably needs to work in multiple IDEs/Editors
- Would be nice if all the parts could be pulled down in project and not rely on remote call
- Do we want a src and dist dir?
