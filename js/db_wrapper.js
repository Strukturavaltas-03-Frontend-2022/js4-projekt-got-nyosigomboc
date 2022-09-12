const JSON_URL = '../json/got.json';

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

const filterLiving = (data = []) => data
  .filter((character) => !Object.prototype.hasOwnProperty.call(character, 'dead') || !character.dead);

const getLastName = (name = '') => {
  const nameParts = name.split(' ');
  return nameParts[nameParts.length - 1];
};

const usCollator = Intl.Collator('en-US');

const orderByLastName = (data = []) => {
  const dataCopy = [...data];
  dataCopy.sort((a, b) => usCollator.compare(getLastName(a.name), getLastName(b.name)));
  return dataCopy;
};

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
