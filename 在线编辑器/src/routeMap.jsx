import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

import App from './App'


export default (
  <Router history={BrowserRouter}>
    <Route path='/' component={App}>
      <IndexRoute component={EditorA}/> 
      <Route path='/EditorA' getComponent={EditorA}/>
      <Route path='/Discover' component={EditorA}/>
      <Route path='/Order' component={EditorA}/>
      <Route path='/User' component={EditorA}/>
      <Route path='/Search' getComponent={EditorA}/>
      <Route path='/SearchResult/:key' getComponent={EditorA}/>
      <Route path='/ShopDetail/:shopId' getComponent={EditorA}/>
      <Route path='*' getComponent={EditorA}/>
    </Route>
  </Router>
)