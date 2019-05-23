import express from 'express';
import http from 'http';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import React from 'react';
import graphqlHTTP from 'express-graphql';
import schema from './api';
import { createStore } from 'redux';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router';
import App from '../client/components/app';
import reducers from '../client/reducers';
import {
  headersMiddleware,
  graphQLMiddleware,
  logMiddleware,
  requestIDMiddleware,
  metaDataMiddleware,
} from './middleware';

//--//--//--// INIT //--//--//--//
const app = new express();
const server = http.createServer(app);
const viewDir = process.env.NODE_ENV === 'production'
  ? 'dist/views'
  : 'src/server/views';

app.set('view engine', 'pug');
app.set('views', viewDir);

//--//--//--// CONNECT DATABASE //--//--//--//
mongoose.Promise = global.Promise;
mongoose.connect(
  `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/portfolio`,
  {
    useNewUrlParser: true,
    autoReconnect: true
  }
);

mongoose.set('useCreateIndex', true);

const db = mongoose.connection;

db.on('error', err => {
  console.error(err);
});

//--//--//--// RUN WEBPACK WHEN IN DEV MODE //--//--//--//
if (process.env.NODE_ENV === 'development') {
  const webpack = require('webpack');
  const wpConfig = require('../../webpack.dev.config');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const compiler = webpack(wpConfig);

  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: wpConfig.output.publicPath,
    stats: { colors: true }
  }));

  app.use(webpackHotMiddleware(compiler, {
    log: console.log
  }));
}

//--//--//--// MIDDLEWARES //--//--//--//
app.use(requestIDMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(headersMiddleware);
app.use(logMiddleware());
app.use(metaDataMiddleware);

if (process.env.SERVER_STATIC === 'true') {
  app.use(express.static(path.join(__dirname, 'public/')));
}

//--//--//--// GRAPHQL API //--//--//--//
app.use(
  '/graphql',
  bodyParser.json(),
  graphQLMiddleware,
  graphqlHTTP(req => ({
    schema,
    graphiql: false,
    context: { req },
    pretty: process.env.NODE_ENV === 'development'
})));

//--//--//--// SERVER SIDE RENDERING //--//--//--//
app.get('*', (req, res) => {
  const store = createStore(reducers);
  const context = {};
  const criticalCSS = require('./views/critical.css');
  const html = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} context={context}>
        <App />
      </StaticRouter>
    </Provider>
  );

  if (context.url) {
    res.redirect(301, context.url);
    res.end();
  }

  console.log(`meta data:`);
  console.log(req.metaData);

  const preloadedState = store.getState();

  res
    .set('Content-Type', 'text/html')
    .status(200)
    .render('index', {
      html,
      preloadedState,
      criticalCSS,
      metaData: req.metaData || null,
      assetPath: process.env.ASSET_PATH || '/'
    });
});

//--//--//--// START SERVER //--//--//--//
server.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
})
