import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { Foo, Bar } from './page';
import Page from './components/Page/';

const routes = (
  <Route path="/" component={Page} >
    <IndexRoute component={Foo} />
    <Route path="bar" component={Bar} />
  </Route>
);

export default routes;
