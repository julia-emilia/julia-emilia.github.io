import { database, displayJsonAsTable } from "/FSDB/database.js";

function findWorldRecord(inputTable){
    let currRecord = 0;
    if(typeof inputTable[0]['adj time'] === 'undefined'){
        currRecord = 1000;
    }else{
        currRecord = inputTable[0]['adj time'];
    }
    let indecesToDelete = [];
    for(let i = 1; i<inputTable.length;i++){

        if((inputTable[i]['adj time']<currRecord)&&(typeof inputTable[i]['adj time'] != 'undefined')){
            currRecord = inputTable[i]['adj time'];
        }else{
            indecesToDelete.push(i);
        }
    }
    // deltete indeces from table
    for(let iter = 0; iter<indecesToDelete.length; iter++){
        inputTable.splice(indecesToDelete[indecesToDelete.length-1-iter],1);
    }
    return inputTable;
}

async function displayDatabase(){

    
    
    let CategoryToSortBy ='Date';
    let classIn = document.getElementById('classDrop').value;
    let wetIn = document.getElementById('wetDrop').value;
    let direction = 'asc';


    //Assemble filter
    let filterColumns = [];
    let filterValues = [];
    
    filterColumns= ['discipline'];
    filterValues = ['SKP']
    //handle class filter
    if(classIn !='-ALL-'){
        filterColumns.push('class');
        filterValues.push(classIn);
    }
    if(wetIn !='-ALL-'){
        filterColumns.push('wet');
        filterValues.push(wetIn);
    }
    let inputTable = await database(filterColumns,filterValues,CategoryToSortBy,direction);
    // find the world records
    let displayTable = findWorldRecord(inputTable);

    //console.log(displayTable)
    let columns =
    [
        "discipline",
        "class",
        "Event",
        //"year",
        "Date",
        "Team",
        //"bestrun",
        //"time",
        //"cones",
        //"off course",
        "adj time",
        "points",
        "place",
        //"Spalte1"
      ];
    
    displayJsonAsTable(displayTable,columns);
    
}

function refresh(){
    const fragment = document.getElementById("main");
    fragment.remove();
    displayDatabase();
  }
  displayDatabase();

document.querySelector('#displayButton').addEventListener('click', refresh);