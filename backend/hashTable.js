const tableSize=100;
function hashStringToInt(string) {
    let hash = 17;
    for (let i = 0; i < string.length; i++) {
      hash = (13 * hash * string.charCodeAt(i)) % tableSize;
    }
    return hash;
  }
  
  class HashTable {
    table = new Array(tableSize);

    setItem = (key, value) => {

      const index = hashStringToInt(key);
      if (this.table[index]) {
        this.table[index].push([key, value]);
      } else {
        this.table[index] = [[key, value]];
      }
    };
  
    getItem = key => {
      const index = hashStringToInt(key);
  
      if (!this.table[index]) {
        return null;
      }

      const foundItem = this.table[index].find(x => x[0] === key);

      if (!foundItem) {
        return null; // Key not found
      }
    
      return foundItem[1];
    };
  }
  module.exports = HashTable;