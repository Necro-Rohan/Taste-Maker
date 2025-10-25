import React, { createContext, useState, useContext } from "react";

const SearchContext = createContext(null);

export const SearchProvider = ({ children }) => {
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [triggerAiSearch, setTriggerAiSearch] = useState(false);

  return (
    <SearchContext.Provider
      value={{
        ingredients,                            // lift the state for triggering ai search throug home page
        setIngredients,
        recipes,
        setRecipes,
        triggerAiSearch,
        setTriggerAiSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSearch = () => {
  return useContext(SearchContext);
};
