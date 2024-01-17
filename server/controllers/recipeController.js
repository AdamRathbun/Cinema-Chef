// sample data to be replaced with PostgreSQL db
const recipes = [
  {
    id: 1,
    title: "Pulp Fiction Royale with Cheese",
    ingredients: "1 pound ground beef\n4 brioche burger buns\n4 slices of Swiss cheese\n4 slices of crispy bacon\n1 red onion thinly sliced\n1 tomato sliced\nLettuce leaves\nDill pickles\nMayonnaise\nMustard\nKetchup\nSalt and pepper",
    instructions: "Start by preparing the patties. Season one pound of ground beef with salt and pepper, then shape it into four patties. Cook the patties on a grill or stovetop until they reach your desired level of doneness.\n\nWhile the patties are cooking, cut four brioche burger buns in half. Toast the buns on the grill or in a toaster until they are lightly browned.\n\nNow, it's time to build the burgers. On the bottom half of each bun, spread a layer of mayonnaise, mustard, and ketchup. Place a lettuce leaf on top of the sauce and add a cooked patty on each bun.\n\nNext, add the toppings. Layer a slice of Swiss cheese on top of each patty, followed by a slice of crispy bacon. Add slices of red onion, tomato, and dill pickles to enhance the flavors.\n\nTo complete the burger, top it with the other half of the toasted bun. Your Pulp Fiction Royale Burgers are now ready to be served!",
    movie_id: 101
  },
  {
    id: 2,
    title: "Fury Road Firestorm Lasagna",
    ingredients: "1 pound ground meat (beef or alternative)\n1 pound Italian sausage\n1 box of lasagna noodles\n2 cups shredded mozzarella cheese\n1 cup grated Parmesan cheese\n1 large onion, finely chopped\n3 cloves garlic, minced\n1 can crushed tomatoes\n1 can tomato sauce\n1 cup diced roasted red peppers\n1 tablespoon dried oregano\n1 tablespoon dried basil\nSalt and pepper\nOlive oil",
    instructions: "Embark on the apocalyptic journey of crafting the Fury Road Firestorm Lasagna. Begin by heating olive oil in a pan and sautéing finely chopped onions and minced garlic until golden brown. Add ground meat and Italian sausage, cooking until browned. Drain excess fat.\n\nIncorporate crushed tomatoes, tomato sauce, diced roasted red peppers, dried oregano, dried basil, salt, and pepper into the meat mixture. Simmer on low heat, letting the flavors meld into a fiery sauce.\n\nBoil lasagna noodles until al dente. Preheat your oven to 375°F (190°C).\n\nIn a baking dish, layer lasagna noodles, followed by a generous portion of the fiery meat sauce. Sprinkle a mixture of shredded mozzarella and grated Parmesan cheese over the sauce. Repeat the layers until your dish is filled, finishing with a cheese layer on top.\n\nBake in the preheated oven for about 25-30 minutes or until the cheese is golden and bubbly. Allow the Fury Road Firestorm Lasagna to cool for a few minutes before serving.\n\nThis lasagna is a culinary journey through the chaotic landscapes of Mad Max: Fury Road, with layers of bold flavors and a fiery kick. Brace yourself for a delicious firestorm!",
    movie_id: 102
  }
]

const getAllRecipes = (req, res) => {
  res.json(recipes);
};

const getRecipeById = (req, res) => {
  const { id } = req.params;
  const recipe = recipes.find((r) => r.id === parseInt(id));
  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' });
  }
  res.json(recipe);
};

const addRecipe = (req, res) => {
  const { title, ingredients, instructions } = req.body;
  const newRecipe = { id: recipes.length + 1, title, ingredients, instructions };
  recipes.push(newRecipe);
  res.status(201).json(newRecipe);
};

const updateRecipe = (req, res) => {
  const { id } = req.params;
  const { title, ingredients, instructions } = req.body;
  const index = recipes.findIndex((r) => r.id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ error: 'Recipe not found' });
  }
  recipes[index] = { id: parseInt(id), title, ingredients, instructions };
  res.json(recipes[index]);
};

const deleteRecipe = (req, res) => {
  const { id } = req.params;
  const index = recipes.findIndex((r) => r.id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ error: 'Recipe not found' });
  }
  const deletedRecipe = recipes.splice(index, 1);
  res.json(deletedRecipe[0]);
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  addRecipe,
  updateRecipe,
  deleteRecipe,
};


