import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SearchApartment from './pages/SearchApartment.js';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <>
        <Navbar />
        <Switch>
          <Route exact path='/' component={SearchApartment} />
          <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
        </Switch>
      </>
    </Router>
  );
}

export default App;
