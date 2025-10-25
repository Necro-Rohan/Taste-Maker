import React from 'react';
import {Routes, Route} from 'react-router-dom';
import AuthCard from './components/authentication.jsx';
import IngredientSearch from './components/IngredientSearch.jsx';
import Navbar from './components/navbar.jsx';
import Profile from './components/profile.jsx';
import RecipeDetail from './components/recipeDetail.jsx';
import About from './components/About.jsx'
import Home from './components/Home.jsx'
import Footer from './components/Footer.jsx'

function App() {

  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/auth" element={<AuthCard />} />
        <Route path="/recipes" element={<IngredientSearch />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/"
          element={ <Home />}
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App
