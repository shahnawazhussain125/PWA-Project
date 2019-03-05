////////////////////////////////////////////////////////////////
//                    Crime Category API
/////////////////////////////////////////////////////////////////
var select1 = document.getElementById("crimeId");

fetch("https://data.police.uk/api/crime-categories")
.then((res) => res.json())
.then((criminal) => {
    for(var key of criminal){
        var option = document.createElement("option");
        option.setAttribute("value", key.url);
        option.innerHTML = key.name;
        select1.appendChild(option);
    }
});

var select2 = document.getElementById("forceId");

fetch("https://data.police.uk/api/forces")
.then((res) => res.json())
.then((police) => {
    for(var key of police){
        var option = document.createElement("option");
        option.setAttribute("value", key.id);
        option.innerHTML = key.name;
        select2.appendChild(option);
    }
});


////////////////////////////////////////////////////////////////
//        searching crime status 
/////////////////////////////////////////////////////////////////


function search()
{
    let div = document.getElementById('detail');
    div.innerHTML = "";

    let URL = "https://data.police.uk/api/crimes-no-location?category=" + select1.value + "&force=" + select2.value;
    fetch(URL)
    .then((res) => res.json())
    .then((crimeStatus) => {
        console.log(crimeStatus.length);
        if(crimeStatus.length !== 0)
        {
            div.innerHTML = `
                <h3 style="text-align: center">Criminal Detail</h3>
                <table class="table table-bordered" id="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Category</th>
                            <th>Date</th>
                        </tr>  
                    </thead>
                    <tbody>
                        ${
                            crimeStatus.map(value =>{
                                return(`
                                <tr>
                                    <td>${value.id}</td>
                                    <td>${value.outcome_status.category}</td>
                                    <td>${value.outcome_status.date}</td>
                                </tr>`)
                            }).join('')
                        }
                    </tbody>                 
                </table>`
        }
        else
        {
            swal("OOps!", "No Record Found!!", "error");
        }
    }).catch(error =>{
        swal("OOps!", "Internet Connection Problem !!", "error");
    })


}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
    .register('/sw.js')
    .then(function() { 
        console.log('Service Worker Registered'); 
    });
  }