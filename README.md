# Natural History Museum

Simple Express app using Pug templates and SCSS.

### Installation
---
Built using Node. You'll need it installed to run locally.

Javascript packages are managed with NPM, and CSS packages are managed using Bower. To install, clone and then run

```
$ npm install
```

### SCSS
---
Libraries: Normalize.css and the Scut mixing library are included, along with some sensible defaults.

CSS selectors follow the BEM structure, and the names generally align with the Pug component names.

### Templates
---
Templates are rendered out from `/views/` by Pug.

The `base.pug` file in `/views/mixins` has all the stuff that makes the pages work.

### Routes
---
The `/routes/` folder contains a `middleware.js` collection of small modules and an `index.js` file where everything is imported.

Controllers are bulk-required from their own `/controllers/` folder.

### Libraries
---

- `errorHandler.js` attaches some extra routes, which catch most errors and renders them through the `error.pug` template.
- `loadControllers.js` is used by `/routes/index.js` to bulk-require the controllers from their folder.

### Development
---
There are a set of Gulp tasks in `/gulp_modules/tasks`, and a handy config file in `/gulp_modules/config.js`. If you want to modify the JS bundles or add more stylesheets, this is the place to do it.

The default task is set to compile Sass/SCSS and JS on save and refresh the browser when necessary (CSS is injected) via Browsersync.

So, to get making things, just run:

```
$ gulp
```
And it'll be visible on port 4000 by default.

### Linting
---
There are no fussy linters here, but if you run `npm test` it'll check the front-end Javascript files against [Happiness guidelines](https://github.com/JedWatson/happiness) and give you it's two cents.

### Deployment
---
Deployment is done with Gulp, but it runs through NPM for simplicity. The deployment task can be tested locally by running.

```
$ npm start
```

When doing this, we can also simulate the production environment by modifying the `.env` file in root.