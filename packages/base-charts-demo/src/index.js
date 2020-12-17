// @flow
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, type Store } from 'redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import initialState, { type State } from './state';
import rootReducer from './state/root-reducer';
import theme, { GlobalStyles } from './view/theme';
import App from './view/app';
import Sandbox from './view/sandbox';
import FourOhFour from './view/404';

// TODO: Fix this Flow type workaround
// flowlint-next-line unclear-type:off
const store: Store<State, *, *> = createStore((rootReducer: any), initialState);
const appElement = document.getElementById('app');

// Set in .env files, statically replaced by Webpack DefinePlugin
const basename = process.env.ASSET_PATH;

if (appElement) {
  render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter basename={basename}>
          <Switch>
            <Route path={'/'} exact component={App} />
            <Route path={'/sandbox'} component={Sandbox} />
            <Route component={FourOhFour} />
          </Switch>
        </BrowserRouter>
        <GlobalStyles />
      </ThemeProvider>
    </Provider>,
    appElement
  );
}
