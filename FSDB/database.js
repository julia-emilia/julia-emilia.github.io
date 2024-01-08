async function fetchJsonFile() {
    try {
      const response = await fetch('FSDB.json');
  
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
  
function database() {
    // await(location.reload(true));
    let discipline = document.getElementById('disciplineDrop').value;
    let CategoryToSortBy = document.getElementById('sortCategoryDrop').value;
    // Example usage
  fetchJsonFile()
  .then((data) => {
    console.log('Contents of sample.json:', data);
    const table = data.Tabelle1;
    let tableFiltered = FilterTable(table,discipline);
    let tableDisplay = SortTable(tableFiltered,CategoryToSortBy);
    displayJsonAsTable(tableDisplay);
    
    // Do something with the data
  })
  .catch((error) => {
    // Handle errors
  });
  
    //https://products.aspose.app/cells/conversion/excel-to-json
}
function displayJsonAsTable(jsonData) {
    // Assuming jsonData is an array of objects with consistent structure
    const keys = Object.keys(jsonData[0]);
  
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
    document.body.appendChild(table);
  }
  function findIndecesToDelete(table,discipline){
    let indexArray = [];
    for(let iter = 0; iter<table.length; iter++){
        if(table[iter].discipline != discipline){
            indexArray.push(iter);
        }
    }
    return indexArray;
  }

  function FilterTable(table,discipline) {
    let filteredTable = table;

    //filteredTable.splice(0,1);
    let indeces = findIndecesToDelete(filteredTable,discipline);

    for(let iter = 0; iter<indeces.length; iter++){
        filteredTable.splice(indeces[indeces.length-1-iter],1);
    }
    
    
    
    //console.log(filteredTable)
    //console.log(x)
    return filteredTable;
  }

  function quicksortGPT(arr) {
    if (arr.length <= 1) {
      return arr;
    }
  
    const pivot = arr[Math.floor(arr.length / 2)];
    const left = [];
    const right = [];
    const equal = [];
  
    for (let element of arr) {
      if (element < pivot) {
        left.push(element);
      } else if (element > pivot) {
        right.push(element);
      } else {
        equal.push(element);
      }
    }
  
    return quicksortGPT(left).concat(equal, quicksortGPT(right));
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

function SortTable(tableFiltered,category){
    
    let tableSorted = quicksortTable(tableFiltered,category);
    return tableSorted;
}
function getRow(table){
    return table[0];  
}

function handleHeaderClick(){
    console.log('hello');
}