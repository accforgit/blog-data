import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

import EditorA from './Component/EditorA'
import EditorB from './Component/EditorB'

// import RouteMap from './routeMap'

class App extends Component {
  render() {
    return (
      <Router>
      <div id="app">
        <Route exact path="/" component={EditorA}/>
        <Route path="/a" component={EditorA}/>
        <Route path="/b" component={EditorB}/>
      </div>
      </Router>
    )
  }
}

export default App
