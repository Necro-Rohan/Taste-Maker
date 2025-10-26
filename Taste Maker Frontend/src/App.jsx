import React,{useState, useEffect} from 'react';
import {Routes, Route} from 'react-router-dom';
import AuthCard from './components/authentication.jsx';
import IngredientSearch from './components/IngredientSearch.jsx';
import Navbar from './components/navbar.jsx';
import Profile from './components/profile.jsx';
import RecipeDetail from './components/recipeDetail.jsx';
import About from './components/About.jsx'
import Home from './components/Home.jsx'
// import Footer from './components/Footer.jsx'

function App() {
  const [isSafari, setIsSafari] = useState(false); // State to track Safari

  useEffect(() => {
    // Check user agent on component mount
    const userAgent = navigator.userAgent;
    const isLikelySafari =
      userAgent.includes("Safari") && // Contains "Safari"
      !userAgent.includes("Chrome") && // Does NOT contain "Chrome"
      !userAgent.includes("Chromium"); // Does NOT contain "Chromium"

    setIsSafari(isLikelySafari);
  }, []);

  return (
    <div className="app flex flex-col min-h-screen relative">
      <Navbar />
      {isSafari && (
        <div
          style={{
            position: "sticky", // Or 'fixed' if you want it always on screen
            top: "4rem", // Adjust based on your Navbar height (h-16 is 4rem)
            left: 0,
            right: 0,
            zIndex: 100, // Ensure it's above other content but below modals if any
          }}
          className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 text-center shadow-md"
          role="alert"
        >
          <p className="font-bold">Browser Notice</p>
          <p>
            For the best experience, including login persistence, we recommend
            using Chrome or Firefox. Some features may be limited in Safari due
            to cookie handling.
          </p>
        </div>
      )}
      <main className="flex-grow">
      <Routes>
        <Route path="/auth" element={<AuthCard />} />
        <Route path="/recipes" element={<IngredientSearch />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/" element={<Home />} />
      </Routes>
      </main>
      {/* <Footer /> */}
    </div>
  );
}

export default App
