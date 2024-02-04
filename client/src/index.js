import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './Navbar/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/recipes" exact component={Recipes} />
        <Route path="/add-recipe" exact component={AddRecipe} />
        {/* more routes*/}
      </Switch>
    </Router>
  );
}

export default App;
