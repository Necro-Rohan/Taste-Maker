import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api.js";
import CreatableSelect from "react-select/creatable";
import { Sparkles } from "lucide-react";
import { useSearch } from "../context/searchContext.jsx";
import img from "../assets/rustic-vintage-cooking-background-showcasing-various-ingredients-herbs-ideal-italian-cuisine-themes-food-blogs-recipe-books-classic-design-that-captivates-culinary-imagination-ai_372197-51728.jpg"



const IngredientSearch = () => {
  const {
    ingredients,
    setIngredients,
    recipes,
    setRecipes,
    triggerAiSearch,
    setTriggerAiSearch,
  } = useSearch();
  const navigate = useNavigate();
  const [cuisine, setCuisine] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSearch = async () => {
    if (ingredients.length === 0) {
      setMessage("Please add some ingredients first.");
      return;
    }
    setIsLoading(true);
    setMessage("");
    try {
      const res = await api.post("/recipes/search", {
        ingredients,
        cuisine,
      });
      setRecipes(res.data);
      if (res.data.length === 0) {
        setMessage("No recipes found with the given ingredients.");
      } else {
        setMessage(
          "Recipes fetched successfully. If you want to try something new, use the AI Generate button!"
        );
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        alert("You are not logged in. Please log in to search for recipes.");
        navigate("/auth");
      }
    } finally {
      setIsLoading(false); 
    }
  };

  
  const handleGenerate = async () => {
    if (ingredients.length === 0) {
      if (triggerAiSearch) setTriggerAiSearch(false);
      setMessage("Please add some ingredients first.");
      return;
    }
    setIsLoading(true); 
    setMessage("");
    try {
      const res = await api.post("/recipes/generate", {
        ingredients,
        cuisine,
      });
      setRecipes(res.data);
      if (res.data.length === 0) {
        setMessage("The AI couldn't generate recipes for these ingredients.");
      } else {
        setMessage(
          `New AI-generated recipes are ready for you! <br/> (P.S. The images are predefined — so don't judge the recipe by its photo 😉)`
        ); 
      }
    } catch (error) {
      console.error("Error generating recipes:", error);
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        alert("You are not logged in. Please log in to generate recipes.");
        navigate("/auth");
      } else {
        alert("An error occurred while generating recipes. Please try again.");
      }
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    if (triggerAiSearch) {
      console.log("AI search triggered by context flag.");
      handleGenerate();
      setTriggerAiSearch(false);
    }
    // Added setTriggerAiSearch and triggerAiSearch to the dependency list as required by linting rules.
    // The main action is actually triggered by triggerAiSearch.
    // We’re not including handleGenerate here because it can cause an infinite loop unless it’s memoized,
    // so the lint rule for that is intentionally disabled.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerAiSearch, setTriggerAiSearch]);

  return (
    <div className="relative">
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="fixed inset-0 z-10 bg-black/10 backdrop-blur-sm" />
      <div
        className={`relative z-20 transition-all duration-500 ease-in-out ${
          recipes.length === 0
            ? "flex justify-center items-center min-h-[calc(100vh-8rem)]"
            : "pt-24 pb-10"
        }`}
      >
        <div className="max-w-2xl mx-auto w-full px-6 py-8 bg-white/70 backdrop-blur-md rounded-lg shadow-xl">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Search Recipes by Ingredients
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <CreatableSelect
                isMulti
                placeholder="Add ingredients"
                name="ingredients"
                value={ingredients.map((ing) => ({ value: ing, label: ing }))}
                onChange={(options) =>
                  setIngredients(options ? options.map((opt) => opt.value) : [])
                }
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: "#D1D5DB", // gray-300
                    borderRadius: "0.50rem", // rounded-lg
                    paddingTop: "0.25rem",
                    paddingBottom: "0.25rem",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", // shadow-sm
                    "&:hover": {
                      borderColor: "#D1D5DB",
                    },
                  }),
                }}
              />
            </div>

            <div className="col-span-2">
              <label
                htmlFor="cuisine"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Select Cuisine Type (Optional)
              </label>
              <select
                id="cuisine"
                name="cuisine"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">All Cuisines</option>
                <option value="Indian">Indian</option>
                <option value="Italian">Italian</option>
                <option value="Chinese">Chinese</option>
                <option value="Mexican">Mexican</option>
                <option value="American">American</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="flex-1 bg-amber-600 text-white font-semibold px-6 py-3 shadow-md flex items-center justify-center gap-2 rounded-lg hover:bg-amber-700 transition-colors disabled:bg-amber-300"
            >
              {isLoading ? "Searching..." : "Search Recipes"}
            </button>
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md flex items-center justify-center gap-2 transition-colors disabled:bg-purple-300"
            >
              <Sparkles size={18} />
              {isLoading ? "Generating..." : "Generate with AI"}
            </button>
          </div>
          {message && (
            <div
              className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg"
              dangerouslySetInnerHTML={{ __html: message }}
            />
          )}
          {recipes.length > 0 &&
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {recipes.map((r) => (
                <Link to={`/recipe/${r.id}`} key={r.id}>
                  <div className="border rounded-lg p-3 shadow hover:shadow-lg transition-shadow duration-200">
                    <img
                      src={r.image}
                      alt={r.title}
                      className="rounded-md w-full h-40 object-cover"
                    />
                    <div className="mt-2 flex justify-between text-sm text-gray-500">
                      <p className="text-sm text-black/80 font-medium">
                        {r.prepTime != 0
                          ? `${r.prepTime} - ${r.prepTime + 5} mins`
                          : "N/A"}
                      </p>
                      <p
                        className={`text-sm ${r.difficulty === "Easy"
                            ? "text-green-500"
                            : r.difficulty === "Medium"
                              ? "text-orange-500"
                              : "text-red-500"
                          } font-semibold`}
                      >
                        {r.difficulty}
                      </p>
                    </div>
                    <h3 className="font-semibold mt-2 text-lg">{r.title}</h3>
                    {r.generatedByAI && (
                      <span className="mt-1 text-xs font-medium bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                        ✨ AI Generated
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default IngredientSearch;