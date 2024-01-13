function GetElectricalFrequency() {
    let pp = document.getElementById("pp").value;
    var n_rpm = document.getElementById("n_rpm").value;
    var outputDiv1 = document.getElementById("f_mech");
    var outputDiv2 = document.getElementById("w_mech");
    var outputDiv3 = document.getElementById("f_el");
    var outputDiv4 = document.getElementById("w_el");
    let f_mech = n_rpm/60;
    let w_mech = f_mech*2*Math.PI;
    let f_el = pp*f_mech;
    let w_el = pp*w_mech;
    outputDiv1.innerHTML = "Mechanical frequency: " + f_mech.toFixed(3) +"&nbsp;Hz";
    outputDiv2.innerHTML = "Mechanical frequency: " + w_mech.toFixed(3) +"&nbsp;rad/s";
    outputDiv3.innerHTML = "Electrial frequency: " + f_el.toFixed(3) +"&nbsp;Hz";
    outputDiv4.innerHTML = "Electrial frequency: " + w_el.toFixed(3) +"&nbsp;rad/s";
}