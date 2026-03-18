(function (global) {
var dc = {};

var homeHtml = "snippets/home-snippet.html";
var allCategoriesUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
var categoriesTitleHtml = "snippets/categories-title-snippet.html";
var categoryHtml = "snippets/category-snippet.html";
var menuItemsUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";
var menuItemsTitleHtml = "snippets/menu-items-title.html";
var menuItemHtml = "snippets/menu-item.html";

// Convenience function for inserting innerHTML for 'select'
var insertHtml = function (selector, html) {
  var targetElem = document.querySelector(selector);
  targetElem.innerHTML = html;
};

// Show loading icon inside element identified by 'selector'.
var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<img src='images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
};

// Return substitute of '{{propName}}' 
// with propValue in given 'string' 
var insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  string = string.replace(new RegExp(propToReplace, "g"), propValue);
  return string;
};

// Remove the class 'active' from home and switch to Menu button
var switchMenuToActive = function () {
  // Remove 'active' from home button
  var classes = document.querySelector("#navHomeButton").className;
  classes = classes.replace(new RegExp("active", "g"), "");
  document.querySelector("#navHomeButton").className = classes;

  // Add 'active' to menu button if already not present
  classes = document.querySelector("#navMenuButton").className;
  if (classes.indexOf("active") === -1) {
    classes += " active";
    document.querySelector("#navMenuButton").className = classes;
  }
};

// On page load (before images or CSS)
document.addEventListener("DOMContentLoaded", function (event) {
  
// TODO: STEP 0: Look over the code from 
// *** start ***
// to 
// *** finish ***
// below.
// We changed this code to retrieve all categories from the server right
// after the page is loaded. We then build a single massive page of
// all the menu categories, but we only show it if the user clicks on the
// specials button. Make sure you scroll down to see the code that 
// has been added / changed. 

// ************** START **************
var categoriesUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
var categories = [];
$ajaxUtils.sendGetRequest(categoriesUrl, function (data) {
  categories = data;
});
// ************** FINISH **************

});

// Load the home snippet view 
dc.loadHomeSnippet = function (callback) {
  $ajaxUtils.sendGetRequest(homeHtml, function (responseText) {
    callback(responseText);
  }, false);
};

// Load the menu categories view
dc.loadMenuCategories = function () {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHTML);
};

// Load the menu items view
// 'categoryShort' is a short_name for a category
dc.loadMenuItems = function (categoryShort) {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(menuItemsUrl + categoryShort + ".json", buildAndShowMenuItemsHTML);
};

// Builds HTML for the categories page based on data from the server
function buildAndShowCategoriesHTML (categories) {
  // Load title snippet
  $ajaxUtils.sendGetRequest(categoriesTitleHtml, function (categoriesTitleHtml) {
    // Load single category snippet
    $ajaxUtils.sendGetRequest(categoryHtml, function (categoryHtml) {
      var categoriesViewHtml = buildCategoriesViewHtml(categories, 
                                        categoriesTitleHtml,
                                        categoryHtml);
      insertHtml("#main-content", categoriesViewHtml);
    }, false);
  }, false);
}

// Using categories data and snippets html
function buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml) {
  var finalHtml = categoriesTitleHtml;
  finalHtml += "<section class='row'>";

  // Loop over categories
  for (var i = 0; i < categories.length; i++) {
    var html = categoryHtml;
    var name = "" + categories[i].name;
    var short_name = categories[i].short_name;
    html = insertProperty(html, "name", name);
    html = insertProperty(html, "short_name", short_name);
    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}

// Builds HTML for the single category page based on data from the server
function buildAndShowMenuItemsHTML (categoryMenuItems) {
  // Load title snippet
  $ajaxUtils.sendGetRequest(menuItemsTitleHtml, function (menuItemsTitleHtml) {
    // Load single category snippet
    $ajaxUtils.sendGetRequest(menuItemHtml, function (menuItemHtml) {
      var menuItemsViewHtml = buildMenuItemsViewHtml(categoryMenuItems, 
                                        menuItemsTitleHtml,
                                        menuItemHtml);
      insertHtml("#main-content", menuItemsViewHtml);
    }, false);
  }, false);
}

// Using category menu items data and snippets html
function buildMenuItemsViewHtml(categoryMenuItems, menuItemsTitleHtml, menuItemHtml) {
  menuItemsTitleHtml = insertProperty(menuItemsTitleHtml,
                                       "name",
                                       categoryMenuItems.category.name);
  menuItemsTitleHtml = insertProperty(menuItemsTitleHtml,
                                       "special_instructions",
                                       categoryMenuItems.category.special_instructions);

  var finalHtml = menuItemsTitleHtml;
  finalHtml += "<section class='row'>";

  // Loop over menu items
  var menuItems = categoryMenuItems.menu_items;
  var catShortName = categoryMenuItems.category.short_name;
  for (var i = 0; i < menuItems.length; i++) {
    var html = menuItemHtml;
    html = insertProperty(html, "short_name", menuItems[i].short_name);
    html = insertProperty(html, "catShortName", catShortName);
    html = insertProperty(html, "name", menuItems[i].name);
    html = insertProperty(html, "description", menuItems[i].description);

    if (menuItems[i].price_small) {
      html = insertProperty(html, "price_small", menuItems[i].price_small);
    }
    if (menuItems[i].price_large) {
      html = insertProperty(html, "price_large", menuItems[i].price_large);
    }
    if (menuItems[i].small_portion_name) {
      html = insertProperty(html, "small_portion_name", menuItems[i].small_portion_name);
    }
    if (menuItems[i].large_portion_name) {
      html = insertProperty(html, "large_portion_name", menuItems[i].large_portion_name);
    }

    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}

global.$dc = dc;

})(window);
