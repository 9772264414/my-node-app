import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import AddProductPage from './pages/AddProductPage';
import UploadImagePage from './pages/UploadImagePage';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/products" component={Products} />
        <Route path="/add-product" component={AddProductPage} />
        <Route path="/upload-image" component={UploadImagePage} />
      </Switch>
    </Router>
  );
}

export default App;
