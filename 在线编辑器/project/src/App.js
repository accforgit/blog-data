import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

import EditorA from './Component/EditorA'
import EditorC from './Component/EditorC'
import EditorB from './Component/EditorB'

class App extends Component {
  render() {
    return (
      <Router>
      <div id="app">
        <Route exact path="/" component={EditorA}/>
        <Route path="/a" component={EditorA}/>
        <Route path="/b" component={EditorB}/>
        <Route path="/c" component={EditorC}/>
      </div>
      </Router>
    )
  }
}

export default App
