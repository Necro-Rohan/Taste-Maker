import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api.js";
import { Clock, Users, BarChart3, Globe, Utensils } from "lucide-react";
import bg1 from "../assets/modern-gastronomic-background-z13r630gqpmwq4wj.jpg";
import bg3 from "../assets/high-angle-delicious-burger-composition_23-2148868220.jpg";
import bg4 from "../assets/brown-distressed-rustic-wood-grain-twig-imperfections-scratches-overhead-view-old-dark-brown-wooden-table-texture-403208008.webp";
import bg5 from "../assets/recipe background dark.jpg";
import bg6 from "../assets/rustic-vintage-cooking-background-showcasing-various-ingredients-herbs-ideal-italian-cuisine-themes-food-blogs-recipe-books-classic-design-that-captivates-culinary-imagination-ai_372197-51728.jpg"
import bg7 from "../assets/side-view-shrimp-caesar-plate-topped-with-potato-shoestrings.jpg";


const RecipeDetail = () => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/recipes/${id}`);
        setRecipe(res.data);
      } catch (err) {
        console.error("Error fetching recipe:", err);
        if (err.response) {
          if (err.response.status === 404) {
            setError("Recipe not found.");
          } else if (err.response.status === 401 || err.response.status === 403) {
            alert("You must be logged in to view this.");
            navigate("/auth");
          } else {
            setError("Failed to load recipe.");
          }
        } else {
          setError("An error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, navigate]);

  
  const isUrl = (text) => {
    return typeof text === 'string' && (text.startsWith("http://") || text.startsWith("https://"));
  };

  const isHtml = (text) => {
    return typeof text === "string" && /<[a-z][\s\S]*>/i.test(text);
  };

  if (loading) {
    return <div className="text-center mt-20">Loading recipe...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  }

  if (!recipe) {
    return <div className="text-center mt-20">No recipe data.</div>;
  }
  const backgroundColors = [
    "rgba(226, 114, 91, 0.8)", 
    "rgba(128, 0, 0, 0.8)", 
    "rgba(255, 219, 88, 0.8)", 
    "rgba(85, 107, 47, 0.8)", 
    "rgba(47, 79, 79, 0.8)", 
    "rgba(0, 128, 128, 0.8)", 
    "rgba(54, 69, 79, 0.8)", 
    "rgba(61, 43, 31, 0.8)", 
    "rgba(201, 192, 187, 0.8)",
  ];

  const BACKGROUND_IMAGE_URL = [bg1, bg3, bg4, bg5, bg6, bg7][
    Math.floor(Math.random() * 6)
  ];

  return (
    <div className="relative">
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${BACKGROUND_IMAGE_URL})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="fixed inset-0 z-10 backdrop-blur-xs" />
      <div
        className={`relative z-20 max-w-4xl md:mx-auto  md:p-8 md:rounded-lg shadow-md md:my-10`}
        style={{
          backgroundColor:
            backgroundColors[
              Math.floor(Math.random() * backgroundColors.length)
            ],
          backdropBlur: "true",
          backgroundOpacity: 0.8,
        }}
      >
        <div className="bg-white shadow-lg md:rounded-lg overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-64 md:h-96 object-cover"
          />
          <div className="p-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {recipe.title}
            </h1>

            {recipe.generatedByAI && (
              <span className="mb-4 inline-block text-sm font-medium bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                ✨ AI Generated
              </span>
            )}

            <div className="flex flex-wrap gap-4 text-gray-700 mb-6">
              {recipe.prepTime > 0 && (
                <span className="flex items-center gap-1.5">
                  <Clock size={18} /> {recipe.prepTime} mins
                </span>
              )}
              {recipe.servings > 0 && (
                <span className="flex items-center gap-1.5">
                  <Users size={18} /> Serves {recipe.servings}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <BarChart3 size={18} /> {recipe.difficulty}
              </span>
              {recipe.cuisine && (
                <span className="flex items-center gap-1.5 capitalize">
                  <Globe size={18} /> {recipe.cuisine}
                </span>
              )}
              {recipe.dietType && (
                <span className="flex items-center gap-1.5 capitalize">
                  <Utensils size={18} /> {recipe.dietType}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <h2 className="text-2xl font-semibold mb-3 border-b-2 border-gray-200 pb-2">
                  Ingredients
                </h2>
                <ul className="list-disc list-inside space-y-2">
                  {recipe.ingredients.map((ing, index) => (
                    <li key={index} className="text-gray-800">
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="md:col-span-2">
                <h2 className="text-2xl font-semibold mb-3 border-b-2 border-gray-200 pb-2">
                  Instructions
                </h2>
                {isUrl(recipe.instructions) ? (
                  <div>
                    <p className="text-gray-700 mb-4">
                      This recipe's instructions are available at the original
                      source.
                    </p>
                    <a
                      href={recipe.instructions}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700"
                    >
                      View Original Recipe
                    </a>
                  </div>
                ) : isHtml(recipe.instructions) ? (
                  <div
                    className="text-gray-800 space-y-4"
                    dangerouslySetInnerHTML={{ __html: recipe.instructions }}
                  />
                ) : (
                  <div className="text-gray-800 space-y-4 whitespace-pre-wrap">
                    {recipe.instructions || "No instructions provided."}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;