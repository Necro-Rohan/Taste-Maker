import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useSearch } from "../context/searchContext.jsx";
import Footer from './Footer.jsx'
import {
  Search,
  Lightbulb,
  ChefHat,
  Heart,
  Carrot,
  Send,
  Sparkle,
} from "lucide-react"; 


import heroImage from "../assets/minimalist-salad-round-shape-salt.jpg"; 

const featuredRecipes = [
  {
    id: "123",
    title: "Creamy Tomato Pasta",
    image: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg",
    ingredients: [
      "pasta",
      "tomato sauce",
      "heavy cream",
      "garlic",
      "parmesan cheese",
    ],
  },
  {
    id: "456",
    title: "Spicy Chicken Curry",
    image: "https://images.pexels.com/photos/674574/pexels-photo-674574.jpeg",
    ingredients: [
      "chicken breast",
      "onion",
      "ginger",
      "garlic paste",
      "curry powder",
      "coconut milk",
      "tomatoes",
    ],
  },
  {
    id: "789",
    title: "Chocolate Lava Cake",
    image: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg",
    ingredients: [
      "dark chocolate",
      "butter",
      "eggs",
      "sugar",
      "flour",
      "vanilla extract",
    ],
  },
  {
    id: "101",
    title: "Avocado Toast Deluxe",
    image: "https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg",
    ingredients: [
      "sourdough bread",
      "avocado",
      "poached egg",
      "red pepper flakes",
      "lemon juice",
      "feta cheese",
    ],
  },
];

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); 
  const { setIngredients, setTriggerAiSearch } = useSearch();

  const handleFeaturedClick = (ingredientsList) => {
    if (ingredientsList && ingredientsList.length > 0) {
      setIngredients(ingredientsList); 
      setTriggerAiSearch(true);                       // Set the flag
      navigate("/recipes");                           // Navigate to search page
    } else {
      console.warn("No ingredients found for this featured recipe.");
      navigate("/recipes");
    }
  };

  return (
    <div className="bg-linear-to-br from-orange-50 via-red-50 to-amber-100 min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-center bg-cover bg-center text-white px-4"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${heroImage})`,
        }}
      >
        <div className="z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-md">
            Find Delicious Recipes with What's in Your Kitchen!
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto drop-shadow-sm">
            Enter your ingredients and discover amazing dishes you can whip up
            right now.
          </p>
          <Link
            to="/recipes"
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition-transform transform hover:scale-105"
          >
            Start Cooking
          </Link>
        </div>
      </section>

      {/* Featured / Trending Recipes */}
      <section className="py-16 px-4 bg-orange-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-amber-800 mb-8">
            Trending Recipes
          </h2>
          {/* grid carasol*/}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {featuredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => handleFeaturedClick(recipe.ingredients)}
                className="block group cursor-pointer"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform group-hover:scale-105 group-hover:shadow-xl">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-800 truncate">
                      {recipe.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              to="/recipes"
              className="text-amber-700 hover:text-amber-800 font-semibold"
            >
              View All Recipes &rarr;
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          {user ? (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Hi {user.username.toUpperCase()}! 👋
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Ready to cook something new today? Check your saved favorites!
              </p>
              <Link
                to="/recipes"
                className="inline-block mt-4 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-colors mr-4"
              >
                Start Cooking Now
              </Link>
              <Link
                to="/profile"
                className="inline-block mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-colors"
              >
                View Your Profile
              </Link>
            </div>
          ) : (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Save Your Favorites!
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Create a free account to save the recipes you love and easily
                find them later.
              </p>
              <Link
                to="/auth"
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-md transition-colors"
              >
                Sign Up Now
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 📱 5. How It Works / Why Choose Us 📱 */}
      <section className="py-16 px-4 bg-amber-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-amber-800 mb-10">
            How Taste Maker Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center p-4 text-center">
              <div className="bg-orange-100 rounded-full p-3 mb-3">
                <Carrot className="h-10 w-10 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                List Your Ingredients
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Just type in what you have in your kitchen - veggies, meats,
                spices, anything!
              </p>
            </div>
            <div className="flex flex-col items-center p-4 text-center">
              <div className="bg-red-100 rounded-full p-3 mb-3">
                <ChefHat className="h-10 w-10 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Discover Recipes
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We'll instantly show you tasty recipes you can make with those
                items. Magic!
              </p>
            </div>
            <div className="flex flex-col items-center p-4 text-center">
              <div className="bg-pink-100 rounded-full p-3 mb-3">
                <Heart className="h-10 w-10 text-pink-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Save Your Favorites
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Found something you love? Save it to your profile so you never
                lose it.
              </p>
            </div>
            <div className="flex flex-col items-center p-4 text-center">
              <div className="bg-yellow-100 rounded-full p-3 mb-3">
                <Lightbulb className="h-10 w-10 text-yellow-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Cook Smarter
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Reduce food waste and get inspired to try new things. Easy and
                fun!
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-amber-100">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-amber-900 mb-3">
            Get Weekly Recipe Ideas!
          </h2>
          <p className="text-amber-800 mb-4">
            Subscribe to our newsletter for trending recipes delivered to your
            inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="grow w-full px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md flex items-center justify-center gap-2 transition-colors"
            >
              <Send size={16} /> Subscribe
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </div> 
  );
};

export default HomePage;
