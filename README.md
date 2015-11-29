# Basic Boilerplate

> This is a simple boilerplate using Grunt & Assemble

This boilerplate enforces very few conventions and can be pieces can be swapped out as needed. Here's a list of what comes by default:

- HTML
⋅⋅- Assemble/Handlebars for templating
- CSS
⋅⋅- Scss
⋅⋅- PostCSS Autoprefixer
- Javascript
⋅⋅- RequireJS
⋅⋅- Babel (ES6 Transpiling)
- Bower
- Grunt


## Setup

1. Clone/download repo
2. Run `cp build-env.js-dist build-env.js` to make a local copy of the build environment variables
3. Run `npm install -g grunt-cli`
4. Run `npm install`
5. Run `bower install`
6. Run `grunt`
7. Run `grunt connect`
8. Navigate to `localhost:4000` in browser to view output
9. Optionally run `grunt watch` to watch for changes


## Production Builds
Want to build for production? Run `grunt --prod` and the following will occur:
- CSS will be minified
- JS will run through the r.js optimizer and be minified into one `main.js` file.
- `foot.hbs` markup will output adjust ouput for production.

Need to check for production in your Handlebars templates? Simply use an `{{#if production}}` block to output content for production.


## Errors or want changes?

Submit an issue or pull request. 