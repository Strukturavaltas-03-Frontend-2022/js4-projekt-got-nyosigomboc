// url for the JSON file (it's the database now, in real life that would be a server)
const JSON_URL = './json/got.json';

// downloads the JSON file
const getRawJSON = async (url = JSON_URL) => {
  try {
    const response = await fetch(new Request(url));
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

// only leave living characters in the array
const filterLiving = (data = []) => data
  .filter((character) => !Object.prototype.hasOwnProperty.call(character, 'dead') || !character.dead);

// get the lastname part of a name
// (even if there are more than 3 or only - 1 in this case this is the last one)
const getLastName = (name = '') => {
  const nameParts = name.split(' ');
  return nameParts[nameParts.length - 1];
};

// make a collator object that can be reused many times
const usCollator = Intl.Collator('en-US');

// order the array by characters' last name part of their names
const orderByLastName = (data = []) => {
  const dataCopy = [...data];
  dataCopy.sort((a, b) => usCollator.compare(getLastName(a.name), getLastName(b.name)));
  return dataCopy;
};

// download the JSON, filter, sort, then return with the final array
// this is the default export
const getCharacters = async () => {
  try {
    const data = await getRawJSON(JSON_URL);
    const living = filterLiving(data);
    const result = orderByLastName(living);
    return result;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export default getCharacters;
