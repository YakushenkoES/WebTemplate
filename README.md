# WebTemplate
Template for web site development.
This template let you
- view changes `.scss`, `.html`, `.js` immediately in browsers ([Browsersync](https://www.npmjs.com/package/browser-sync))
- preprocess `.scss` ([Sass](https://www.npmjs.com/package/gulp-sass)), add vendor prefixes ([Autoprefixer](https://www.npmjs.com/package/gulp-autoprefixer))
- minimize and uglify `.js`
- prepare site files for distribution


## Install
1. Download or clone project
2. Install [Node.js](https://nodejs.org/en/) (check "npm manager" and "Add to PATH")
3. Install packages
   1. Run `cmd.exe` and change directory to project directory
   2. Install "Gulp" globally: `npm i gulp -g`
   4. Install "Gulp" locally: `npm i gulp --save-dev`
   3. Install packages: `npm install`

## Usage
1. Run `cmd.exe` and change directory to project directory
   - Run `gulp` for start watching process
   - Run `gulp build` for prepare site files (to "dist" folder)


