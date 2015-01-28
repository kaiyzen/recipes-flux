var McFly = require("./McFly");
var db = require("./mock-db");
var _ = require("lodash");
// var uuid = require("uuid");

// Creates a DataStore
var RecipeStore = McFly.createStore({
  // Initial setup
  _recipes: db,

  updateRecipeIngredientList: function (_id, index) {
    var recipe = this.getRecipe(_id);
    if (index || index === 0) {
      /* Delete operation */
      recipe.ingredients.splice(index, 1);
    } else {
      /* Create operation */
      recipe.ingredients.push(
        {
          ingredient: "",
          quantity: "",
          measurement: "",
          modifier: ""
        }
      );
    }
  },

  updateRecipe: function (_id, accessor, index, value) {
    var recipe = this.getRecipe(_id);
    if (index || index === 0) {
      recipe.ingredients[index][accessor] = value;
    } else {
      recipe[accessor] = value;
    }
  },

  createRecipe: function (recipe) {
    this._recipes.push(recipe);
  },

  createIngredient: function () {},

  deleteRecipe: function (_id) {
    _.remove(this._recipes, {_id: _id});
  },

  getRecipe: function (_id) {
    return _.find(this._recipes, {_id: _id});
  },

  getRecipes: function () {
    return this._recipes;
  }
}, function (payload) {
  if (payload.actionType === "RECIPE_CREATE") {
    RecipeStore.createRecipe(payload.data);
    RecipeStore.emitChange();
  }
  if (payload.actionType === "RECIPE_DELETE") {
    RecipeStore.deleteRecipe(payload.data._id);
    RecipeStore.emitChange();
  }
  if (payload.actionType === "INPUT_CHANGED") {
    RecipeStore.updateRecipe(
      payload.data._id,
      payload.data.accessor,
      payload.data.index,
      payload.data.value
    );
    RecipeStore.emitChange();
  }
  if (payload.actionType === "INGREDIENT_DELETED") {
    RecipeStore.updateRecipeIngredientList(
      payload.data._id, payload.data.index
    );
    RecipeStore.emitChange();
  }
  if (payload.actionType === "INGREDIENT_CREATED") {
    RecipeStore.updateRecipeIngredientList(payload.data._id);
    RecipeStore.emitChange();
  }
});

module.exports = RecipeStore;
