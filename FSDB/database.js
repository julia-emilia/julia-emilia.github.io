async function fetchJsonFile(path) {
    try {
      const response = await fetch(path);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const jsonContent = await response.json();
      return jsonContent;
    } catch (error) {
      console.error('Error fetching JSON file:', error.message);
      throw error;
    }
  }
  
export async function database(filterColumns,filterValues,CategoryToSortBy,direction) {
    // await(location.reload(true));
    //let discipline = document.getElementById('disciplineDrop').value;
    //let CategoryToSortBy = document.getElementById('sortCategoryDrop').value;
    //let discipline = disciplineIn;
    //let CategoryToSortBy = CategoryToSortByIn;

    let data = await fetchJsonFile('/FSDB/FSDB.json');
    const table = data.Tabelle1;
    let tableFiltered = FilterTable(table,filterColumns,filterValues);
    let tableDisplay = SortTable(tableFiltered,CategoryToSortBy,direction);
    return tableDisplay;
    // Example usage
  //fetchJsonFile()
  //.then((data) => {
    //console.log('Contents of sample.json:', data);
    //const table = data.Tabelle1;
    //let tableFiltered = FilterTable(table,discipline);
    //let tableDisplay = SortTable(tableFiltered,CategoryToSortBy);
    //return tableDisplay;
    //displayJsonAsTable(tableDisplay);
    
    // Do something with the data
  //})
  //.catch((error) => {
    // Handle errors
  //});
  
  
    //https://products.aspose.app/cells/conversion/excel-to-json
}
export function displayJsonAsTable(jsonData,columns) {
  // Assuming jsonData is an array of objects with consistent structure
 //const keys = Object.keys(jsonData[0]);
 const keys = columns;
 
 
  //const keys = ["discipline","event","year"]
  console.log(keys)
  let table = document.createElement("table");
  table.id = 'myTable';

  // Create table header
  const headerRow = table.insertRow(0);
  keys.forEach((key) => {
    const th = document.createElement('th');
    th.textContent = key;
    // Add click event listener to the header cell
      th.addEventListener('click', () => {
      handleHeaderClick(key);
    });
    headerRow.appendChild(th);
  });

  // Create table rows
  jsonData.forEach((data) => {
    const row = table.insertRow();
    keys.forEach((key) => {
      const cell = row.insertCell();
      cell.textContent = data[key];
    });
  });
  

  // Append the table to the body or any desired HTML element
  const fragment = document.createDocumentFragment();
const li = fragment
  .appendChild(document.createElement("main"))
  .appendChild(table);

document.body.appendChild(fragment);

}

  function findIndecesToDelete(table,columnName,valueToKeep){
    let indexArray = [];
    for(let iter = 0; iter<table.length; iter++){
        if(table[iter][columnName] != valueToKeep){
            indexArray.push(iter);
        }
    }
    return indexArray;
  }

  function FilterTable(table,filterColumns,filterValues) {
    let filteredTable = table;
    // filter for discipline
    let indeces = [];
    for(let iterCol = 0; iterCol<filterColumns.length;iterCol++){
    indeces = findIndecesToDelete(filteredTable,filterColumns[iterCol],filterValues[iterCol]);
    for(let iter = 0; iter<indeces.length; iter++){
        filteredTable.splice(indeces[indeces.length-1-iter],1);
    }
  }

    return filteredTable;
  }

  function quicksortTable(arr,category) {
    if (arr.length <= 1) {
      return arr;
    }
  
    const pivot = arr[Math.floor(arr.length / 2)][category];
    const left = [];
    const right = [];
    const equal = [];
  
    for (let element of arr) {
      if (element[category] < pivot) {
        left.push(element);
      } else if (element[category] > pivot) {
        right.push(element);
      } else {
        equal.push(element);
      }
    }
  
    return quicksortTable(left,category).concat(equal, quicksortTable(right,category));
  }

function SortTable(tableFiltered,category,direction){
    
    let tableSorted = quicksortTable(tableFiltered,category);
    if(direction == 'desc'){
      tableSorted.reverse();
    }
    return tableSorted;
}
function getRow(table){
    return table[0];  
}

function handleHeaderClick(){
    console.log('hello');
}