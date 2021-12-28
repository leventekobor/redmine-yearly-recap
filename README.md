# redmine-yearly-recap

## Install

### backend

**Setup**

The `.env` file should be in the `server` folder.

In the `.env` file set `PORT` and `BASE_URL` file.

**Install**

In the `server` folder: `npm install` and `npm audit fix --force`

To start the server run `npm start`

### frontend

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```
this creates a `dist` folder.

### Lints and fixes files
```
npm run lint
```

### cors

In the `src/services/Api.js` file set the `baseURL` to the address of the cors server. 
