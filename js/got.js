// eslint-disable-next-line import/extensions
import getCharacters from './db_wrapper.js';

let characters = null;
let lastSelected = null;
const mainElement = document.querySelector('main');
const infoElement = document.querySelector('.info');

const placeHolderHouse = 'assets/houses/placeholder.png';

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

const getHouseUrl = (houseName = '') => (Object.prototype.hasOwnProperty.call(houseObj, houseName) ? houseObj[houseName] : placeHolderHouse);

const getInfoDiv = (name, picture, bio, houseName) => `<img src="${picture}" alt="${name}">
<div class="name">${name}<img src="${getHouseUrl(houseName)}" alt="${houseName} house logo"></div>
<div class="bio">${bio}</div>`;

const getPortraitDiv = (name, portrait, index) => `<div class="character" id="ch_${index}">
  <img src="${portrait}" alt="${name}">
  <div>${name}</div>
</div>`;

const showInfo = (index) => {
  const {
    name, picture, bio, house, portrait,
  } = characters[index];
  const html = getInfoDiv(name, picture || portrait, bio, house);
  infoElement.innerHTML = html;
};

const selectThis = (element) => {
  if (lastSelected !== null) {
    lastSelected.classList.remove('character__selected');
  }
  element.classList.add('character__selected');
  lastSelected = element;
};

const addListeners = () => {
  const divs = document.querySelectorAll('.character');
  divs.forEach((element, index) => element.addEventListener('click', function () {
    showInfo(index);
    // console.log(this);
    selectThis(this);
  }));
};

const generateTable = async () => {
  characters = await getCharacters();
  const html = characters.map((c, index) => getPortraitDiv(c.name, c.portrait, index)).join('\n');
  mainElement.innerHTML = html;
  addListeners();
};

generateTable();
