import { database, displayJsonAsTable } from "./database.js";

async function displayDatabase(){

    let disciplineIn = document.getElementById('disciplineDrop').value;
    let classIn = document.getElementById('classDrop').value;
    let eventIn = document.getElementById('eventDrop').value;
    let CategoryToSortByIn = document.getElementById('sortCategoryDrop').value;
    let directionIn = document.getElementById('directionDrop').value;
    let direction = directionIn;

    //Assemble filter
    let filterColumns = [];
    let filterValues = [];
    //handle discipline filter
    if(disciplineIn !='-ALL-'){
        filterColumns.push('discipline');
        filterValues.push(disciplineIn);
    }
    //handle class filter
     if(classIn !='-ALL-'){
        filterColumns.push('class');
        filterValues.push(classIn);
    }
    //handle event filter
    if(eventIn !='-ALL-'){
        filterColumns.push('Event');
        filterValues.push(eventIn);
    }
    let displayTable = await database(filterColumns,filterValues,CategoryToSortByIn,direction);

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
        "time",
        "cones",
        "off course",
        "adj time",
        "points",
        "place",
        //"Spalte1"
      ];
    if(disciplineIn == 'SKP'){
        columns =
    [
        "discipline",
        "class",
        "Event",
        //"year",
        "Date",
        "Team",
        //"bestrun",
        "time",
        "cones",
        "off course",
        "adj time",
        "points",
        "place",
        "wet"
        //"Spalte1"
      ];
    }
    if(disciplineIn == 'OVR'){
        columns =
    [
        "discipline",
        "class",
        "Event",
        "Date",
        "Team",
        "points",
        "place",
      ];
    }
      else{

      }
    displayJsonAsTable(displayTable,columns);
    
}

function refresh(){
  const fragment = document.getElementById("main");
  fragment.remove();
  displayDatabase();
}
  displayDatabase();

document.querySelector('#displayButton').addEventListener('click', refresh);