import recipes from './recipes.js';
import displayRecipe from './displayRecipes.js';
import {
  normalizeData,
  closeSearchFieldWhenUserClickElswhere,
  displayElements,
  removeDuplicate,
} from './utils.js';
import {
  searchQuery,
  displayListElement,
  searchIngredient,
  searchAppliance,
  searchDevice,
} from './queryFunction.js';
import { reloadSearch } from './reloadSearch.js'

const searchInput = document.querySelector('#searchInput');
const resultSection = document.querySelector('.result');

let inputNormalized;
let globalSearch;
let globalIngredient;
let globalAppliance;
let globalDevice;
let ingredientTagsArray = [];
let applianceTagsArray = [];
let deviceTagsArray = [];

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
  }
});

displayElements()


/////////LISTEN TO THE MAIN INPUT//////////
const listIngredient = document.querySelector(
  '.search__filter__list.ingredients'
);
const listAppliance = document.querySelector(
  '.search__filter__list.appareils'
);
const listDevice = document.querySelector('.search__filter__list.ustenciles');
const tagSection = document.querySelector('.search__tags__ingredients');

searchInput.addEventListener('input', (e) => {
  const input = e.target.value;
  inputNormalized = normalizeData(input);
  tagSection.innerHTML = '';
  ingredientTagsArray = [];
  applianceTagsArray = [];
  deviceTagsArray = [];

  if (inputNormalized.length >= 3) {
    globalSearch = searchQuery(recipes, inputNormalized);
    if (globalSearch.length < 1) {
      resultSection.innerHTML = `<p class='error-result'>Pas de recettes à afficher pour cette recherche.</p>`;
      listIngredient.innerHTML = '';
      listAppliance.innerHTML = '';
      listDevice.innerHTML = '';
    } else {
      resultSection.innerHTML = displayRecipe(globalSearch);
      globalIngredient = globalSearch.flatMap(
        (element) => element.ingredients
      );
      displayListElement(globalIngredient, 'ingredient', '', 'ingredients');

      globalAppliance = globalSearch;
      displayListElement(globalAppliance, 'appliance', '', 'appareils');

      globalDevice = globalSearch;
      displayListElement(globalDevice, 'devices', '', 'ustenciles');
    }
  } else {
    resultSection.innerHTML = displayRecipe(recipes);
    listIngredient.innerHTML = '';
    listAppliance.innerHTML = '';
    listDevice.innerHTML = '';
  }
});


const searchInputIngredient = document.querySelector('#ingredientsInput');
const searchInputAppliance = document.querySelector('#appareilsInput');
const searchInputDevice = document.querySelector('#ustencilesInput');

/////////LISTEN TO THE INGREDIENT ADVANCED SEARCH INPUT//////////

searchInputIngredient.addEventListener('input', (e) => {
  const input = e.target.value;
  const inputNormalized = normalizeData(input);
  globalIngredient = globalSearch.flatMap((element) => element.ingredients);

  for (let i of ingredientTagsArray) {
    globalIngredient = globalIngredient.filter(
      (element) => element.ingredient !== i
    );
  }
  displayListElement(globalIngredient, 'ingredient', inputNormalized, 'ingredients');
});

///////////LISTEN TO THE APPLIANCES ADVANCED SEARCH INPUT//////////
searchInputAppliance.addEventListener('input', (e) => {
  const input = e.target.value;
  const inputNormalized = normalizeData(input);
  for (let i of applianceTagsArray) {
    globalAppliance = globalSearch.filter((element) => element.appliance !== i);
  }
  displayListElement(globalAppliance, 'appliance', inputNormalized, 'appareils');
});

/////////LISTEN TO THE DEVICES ADVANCED SEARCH INPUT////////////

searchInputDevice.addEventListener('input', (e) => {
  const input = e.target.value;
  const inputNormalized = normalizeData(input);
  let device = globalSearch.flatMap((element) => element.devices);
  for (let i of deviceTagsArray) {
    device = device.filter((element) => element !== i);
  }
  globalDevice = [{ devices: device }];
  displayListElement(globalDevice, 'devices', inputNormalized, 'ustenciles');
});

const articleIngredient = document.querySelector('.article-ingredients');
const articleAppliance = document.querySelector('.article-appareils');
const articleDevice = document.querySelector('.article-ustenciles');

////////////////////////////////DROPDOWN BUTTON CLICK\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//////LISTEN TO THE INGREDIENT ADVANCED SEARCH BUTTON CLICK///////
const filterElementIngredient = document.querySelector(
  '.search__filter__element.ingredients'
);

filterElementIngredient.addEventListener('click', () => {
  const listIngr = document.querySelectorAll(
    '.search__filter__list__item.ingredients'
  );
  if (listIngr.length > 0) {
    articleIngredient.classList.toggle('larger');
    filterElementIngredient.classList.toggle('open');
    articleAppliance.classList.remove('larger');
    articleDevice.classList.remove('larger');
    searchInputIngredient.value = '';
    searchInputIngredient.focus();
  }
});

//////LISTEN TO THE APPLIANCES ADVANCED SEARCH BUTTON CLICK///////
const filterElementAppliance = document.querySelector(
  '.search__filter__element.appareils'
);
filterElementAppliance.addEventListener('click', () => {
  const listApp = document.querySelectorAll(
    '.search__filter__list__item.appareils'
  );
  if (listApp.length > 0) {
    articleAppliance.classList.toggle('larger');
    filterElementAppliance.classList.toggle('open');
    articleIngredient.classList.remove('larger');
    articleDevice.classList.remove('larger');
    searchInputAppliance.value = '';
    searchInputAppliance.focus();
  }
});

///////LISTEN TO THE DEVICES ADVANCED SEARCH BUTTON CLICK///////
const filterElementDevice = document.querySelector(
  '.search__filter__element.ustenciles'
);
filterElementDevice.addEventListener('click', () => {
  const listDev = document.querySelectorAll(
    '.search__filter__list__item.ustenciles'
  );
  if (listDev.length > 0) {
    articleDevice.classList.toggle('larger');
    filterElementDevice.classList.toggle('open');
    articleIngredient.classList.remove('larger');
    articleAppliance.classList.remove('larger');
    searchInputDevice.value = '';
    searchInputDevice.focus();
  }
});

////////////////////////////////////////ADVANCED SEARCH LIST MANAGER\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//////////OBSERVE INGREDIENT LIST CLICKS////////////////
const IngredientList = document.querySelector(
  `.search__filter__list.ingredients`
);

const observerIngredients = new MutationObserver(() => {
  const tags = document.querySelectorAll(
    `.search__filter__list__item.ingredients`
  );
  for (const item of tags) {
    item.addEventListener('click', () => {
      ingredientTagsArray.push(item.innerText);
      ingredientTagsArray = removeDuplicate(ingredientTagsArray);
      const tagsDisplayed = ingredientTagsArray.map((element) => {
        return `<span class='search__tags__item ingredients'>${element}<i id="close" class="far fa-times-circle"></i></span>`;
      }).join('');

    const tagSection = document.querySelector('.search__tags__ingredients');
    tagSection.innerHTML = tagsDisplayed;
  
      const tagInput = normalizeData(item.innerText);
      globalSearch = searchIngredient(globalSearch, tagInput);
      resultSection.innerHTML = displayRecipe(globalSearch);
      globalIngredient = globalSearch.flatMap((element) => element.ingredients);

      for (let i of ingredientTagsArray) {
        globalIngredient = globalIngredient.filter(
          (element) => element.ingredient !== i
        );
      }

      displayListElement(globalIngredient, 'ingredient', '', 'ingredients');
      
      globalAppliance = globalSearch;
      displayListElement(globalAppliance, 'appliance', '', 'appareils');

      let device = globalSearch.flatMap((element) => element.devices);
      for (let i of deviceTagsArray) {
        device = device.filter((element) => element !== i);
      }
      globalDevice = [{ devices: device }]
      displayListElement(globalDevice, 'devices', '', 'ustenciles');

  });
  }

});
observerIngredients.observe(IngredientList, { subtree: true, childList: true });

//////////OBSERVE APPLIANCE LIST CLICKS////////////////
const applianceList = document.querySelector(
  `.search__filter__list.appareils`
);
const observerAppliance = new MutationObserver(() => {
  const tags = document.querySelectorAll(
    `.search__filter__list__item.appareils`
  );
  for (const item of tags) {
    item.addEventListener('click', () => {
      applianceTagsArray.push(item.innerText);
      applianceTagsArray = removeDuplicate(applianceTagsArray);
      const tagsDisplayed = applianceTagsArray
        .map((element) => {
          return `<span class='search__tags__item appareils'>${element}<i id="close" class="far fa-times-circle"></i></span>`;
        })
        .join('');

      const tagSection = document.querySelector('.search__tags__appareils');
      tagSection.innerHTML = tagsDisplayed;

      const tagInput = normalizeData(item.innerText);
      globalSearch = searchAppliance(globalSearch, tagInput);  
      resultSection.innerHTML = displayRecipe(globalSearch);
      
      for (let i of applianceTagsArray) {
        globalAppliance = globalSearch.filter(
          (element) => element.appliance !== i
        );
      }
      displayListElement(globalAppliance, 'appliance', '', 'appareils');
      
      let device = globalSearch.flatMap((element) => element.devices);
      for (let i of deviceTagsArray) {
        device = device.filter((element) => element !== i);
      }
      globalDevice = [{ devices: device }]
      displayListElement(globalDevice, 'devices', '', 'ustenciles');

      globalIngredient = globalSearch.flatMap((element) => element.ingredients);
      for (let i of ingredientTagsArray) {
        globalIngredient = globalIngredient.filter(
          (element) => element.ingredient !== i
        );
      }
      displayListElement(globalIngredient, 'ingredient', '', 'ingredients');
  });
  }
});
observerAppliance.observe(applianceList, { subtree: true, childList: true });

//////////OBSERVE DEVICES LIST CLICKS////////////////
const deviceList = document.querySelector(
  `.search__filter__list.ustenciles`
);
const observerDevice = new MutationObserver(() => {
  const tags = document.querySelectorAll(
    `.search__filter__list__item.ustenciles`
  );
  for (const item of tags) {
    item.addEventListener('click', () => {
      deviceTagsArray.push(item.innerText);
      deviceTagsArray = removeDuplicate(deviceTagsArray);

      const tagsDisplayed = deviceTagsArray
        .map((element) => {
          return `<span class='search__tags__item ustenciles'>${element}<i id="close" class="far fa-times-circle"></i></span>`;
        })
        .join('');

      const tagSection = document.querySelector('.search__tags__ustenciles');
      tagSection.innerHTML = tagsDisplayed;
      const tagInput = normalizeData(item.innerText);
      globalSearch = searchDevice(globalSearch, tagInput);
      resultSection.innerHTML = displayRecipe(globalSearch);

      let device = globalSearch.flatMap((element) => element.devices);
      for (let i of deviceTagsArray) {
        device = device.filter((element) => element !== i);
      }
      globalDevice = [{ devices: device }]

      displayListElement(globalDevice, 'devices', '', 'ustenciles');
      
      globalIngredient = globalSearch.flatMap((element) => element.ingredients);
      for (let i of ingredientTagsArray) {
        globalIngredient = globalIngredient.filter(
          (element) => element.ingredient !== i
        );
      }
      displayListElement(globalIngredient, 'ingredient', '', 'ingredients');

      globalAppliance = globalSearch;
      displayListElement(globalAppliance, 'appliance', '', 'appareils')

    });
  }
});
observerDevice.observe(deviceList, { subtree: true, childList: true });

////////////////////////////////////TAG LIST MANAGER\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//////////////INGREDIENTS TAG MANAGEMENT///////////////
  const ingredientsTagSection = document.querySelector('.search__tags__ingredients');
  const ingredientTagObserver = new MutationObserver(() => {
    const tags = document.querySelectorAll('.search__tags__item');
    if (tags !== null) {
      for (let i = 0; i < tags.length; i++) {
        const closeButton = document.querySelectorAll('#close');
        closeButton[i].addEventListener('click', () => {
          tags[i].remove();
          globalIngredient.push({ ingredient: tags[i].innerText, quantity: '', unit: '' });
          ingredientTagsArray = ingredientTagsArray.filter(
            element => element !== tags[i].innerText
          );
        
          displayListElement(globalIngredient, 'ingredient', '', 'ingredients');
          
          globalSearch = reloadSearch(
            ingredientTagsArray,
            applianceTagsArray,
            deviceTagsArray,
            inputNormalized,
            globalSearch
          );
          
        });
      }
    }
  });
ingredientTagObserver.observe(ingredientsTagSection, {
  subtree: true,
  childList: true,
});

//////////////APPLIANCE TAG MANAGEMENT///////////////
const applianceTagSection = document.querySelector(
  '.search__tags__appareils'
);
const applianceTagObserver = new MutationObserver(() => {
  const tags = document.querySelectorAll('.search__tags__item');
  if (tags !== null) {
    for (let i = 0; i < tags.length; i++) {
      const closeButton = document.querySelectorAll('#close');
      closeButton[i].addEventListener('click', () => {
        tags[i].remove();
        globalAppliance.push(tags[i].innerText);
        globalAppliance = removeDuplicate(globalAppliance);
        applianceTagsArray = applianceTagsArray.filter(
          (element) => element !== tags[i].innerText
        );

        displayListElement(globalAppliance, 'appliance', '', 'appareils');

        globalSearch = reloadSearch(
          ingredientTagsArray,
          applianceTagsArray,
          deviceTagsArray,
          inputNormalized,
          globalSearch
        );
      });
    }
  }
});
applianceTagObserver.observe(applianceTagSection, {
  subtree: true,
  childList: true,
});


//////////////DEVICES TAG MANAGEMENT///////////////
const deviceTagSection = document.querySelector('.search__tags__ustenciles');
const deviceTagObserver = new MutationObserver(() => {
  const tags = document.querySelectorAll('.search__tags__item');
  if (tags !== null) {
    for (let i = 0; i < tags.length; i++) {
      const closeButton = document.querySelectorAll('#close');
      closeButton[i].addEventListener('click', () => {
        tags[i].remove();
       // globalDevice.devices.push(tags[i].innerText);
        for (let el of globalDevice) {
          el.devices.push(tags[i].innerText);
        }
        deviceTagsArray = deviceTagsArray.filter(
          (element) => element !== tags[i].innerText
        );

        displayListElement(globalDevice, 'devices', '', 'ustenciles');

        globalSearch = reloadSearch(
          ingredientTagsArray,
          applianceTagsArray,
          deviceTagsArray,
          inputNormalized,
          globalSearch
        );
      });
    }
  }
});
deviceTagObserver.observe(deviceTagSection, {
  subtree: true,
  childList: true,
});
  
closeSearchFieldWhenUserClickElswhere();