// eslint-disable-next-line import/extensions
import getCharacters from './db_wrapper.js';

let characters = null; // the characters array given by getCharacters
let lastSelected = null; // last selected character
// (a clicked element to "unclick" next time the user clicks on a different one)

// elements to use many times
const mainElement = document.querySelector('main');
const infoElement = document.querySelector('.info');
const searchInput = document.querySelector("input[name='search']");
const notFoundDiv = document.querySelector('#notFound');

// placeholder house's url
const placeHolderHouse = 'assets/houses/placeholder.png';

// this object holds the houses and their coat-of-arms URLs
// generate:
// \ls -1|sed "s/^\(.*\)\.png$/  \1: 'assets\/houses\/\1.png',/"
const houseObj = {
  baratheon: 'assets/houses/baratheon.png',
  clegane: 'assets/houses/clegane.png',
  greyjoy: 'assets/houses/greyjoy.png',
  lannister: 'assets/houses/lannister.png',
  mormont: 'assets/houses/mormont.png',
  nightwatch: 'assets/houses/nightwatch.png',
  royalguard: 'assets/houses/royalguard.png',
  stark: 'assets/houses/stark.png',
  targaryen: 'assets/houses/targaryen.png',
  tarly: 'assets/houses/tarly.png',
  tully: 'assets/houses/tully.png',
};

// gives back an image url for a house name (or the placeholder if wasn't found)
const getHouseUrl = (houseName = '') => (Object.prototype.hasOwnProperty.call(houseObj, houseName) ? houseObj[houseName] : placeHolderHouse);

// template literals to generate the HTML code
// info div is on the sidebar
const getInfoDiv = (name, picture, bio, houseName) => `<img src="${picture}" alt="${name}">
<div class="name">${name}<img src="${getHouseUrl(houseName)}" alt="${houseName} house logo"></div>
<div class="bio">${bio}</div>`;

// an individual's portrait+name as a template literal
const getPortraitDiv = (name, portrait, index) => `<div class="character" id="ch_${index}">
  <img src="${portrait}" alt="${name}">
  <div>${name}</div>
</div>`;

// creates and shows the Nth character's info (Nth in the array)
// if it's null, delete the info
const showInfo = (index) => {
  if (index === null) {
    infoElement.innerHTML = '';
    return;
  }
  const {
    name, picture, bio, house, portrait,
  } = characters[index];
  const html = getInfoDiv(name, picture || portrait, bio, house);
  infoElement.innerHTML = html;
};

// unselect last selected character
const unselectLast = () => {
  if (lastSelected !== null) {
    lastSelected.classList.remove('character__selected');
    lastSelected = null;
  }
};

// select a character (show their info and an effect)
const selectThis = (element) => {
  unselectLast();
  element.classList.add('character__selected');
  lastSelected = element;
};

// add 'click' event listeners to the characters
const addListeners = () => {
  const divs = document.querySelectorAll('.character');
  divs.forEach((element, index) => element.addEventListener('click', function () {
    showInfo(index);
    selectThis(this);
  }));
};

// generate the table and show everyone on the map
const generateTable = async () => {
  characters = await getCharacters();
  const html = characters.map((c, index) => getPortraitDiv(c.name, c.portrait, index)).join('\n');
  mainElement.innerHTML = html;
  addListeners();
};

// these functions show and hide the given elements
const showElement = (element) => {
  element.classList.remove('hidden');
};

const hideElement = (element) => {
  element.classList.add('hidden');
};

const showOrHide = (element, show = true) => {
  if (show) {
    showElement(element);
  } else {
    hideElement(element);
  }
  return show;
};

// refactored out from the search function
// shows the result of the search
const updateSearchResult = (firstMatchedIndex) => {
  unselectLast();
  showInfo(firstMatchedIndex);
  showOrHide(notFoundDiv, firstMatchedIndex === null);
};

// search the caracters by their names
// (filter them, then hide or show character portraits by the filter)
const search = (query) => {
  const portraitDivs = document.querySelectorAll('.character');
  let firstMatchedIndex = null;
  const re = new RegExp(query, 'i');
  portraitDivs.forEach((element, index) => {
    if (showOrHide(element, re.test(characters[index].name))
      && (firstMatchedIndex === null)) {
      firstMatchedIndex = index;
    }
  });
  updateSearchResult(firstMatchedIndex);
};

// handle delays and key events for the search bar
const searchDelay = 500;
let lastTimeout = null;

const addSearch = () => {
  searchInput.addEventListener('keyup', () => {
    if (lastTimeout !== null) {
      clearTimeout(lastTimeout);
    }
    lastTimeout = setTimeout(() => {
      clearTimeout(lastTimeout);
      lastTimeout = null;
      search(searchInput.value);
    }, searchDelay);
  });
};

// initialize the board
generateTable();
addSearch();
