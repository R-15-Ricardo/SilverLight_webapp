const fileArea = document.querySelector(".point_container");
const addButton = document.querySelector("#add_point_button");

addButton.addEventListener('click', (e) => {
    e.preventDefault();
    let formData = new FormData(document.getElementById("new_data"));
    let valid = true;

    for (let val of formData.values()) {
        //if (val == '') valid = false;
    }

    if (!valid) {
        alert("Invalid data entry");
    } else {
        const id = `entry-${Math.random().toString(32).substring(7)}`;

        let newEntry = {
            deliver : String(formData.get('data_deliver_date')) + ' ' + String(formData.get('data_deliver_time')),
            streetType : parseInt(formData.get('data_streettype')),
            floor : formData.get('data_floor'),
            apartment : formData.get('data_apartment'),
            province : formData.get('data_province'),
            district : formData.get('data_district'),
            parkingNo : formData.get('data_parkingno'),
            depositNo : formData.get('data_depositno'),
            loc : [parseFloat(formData.get('data_lat')), parseFloat(formData.get('data_lon'))],
            category : formData.get('data_category'),
            position : formData.get('data_position'),
            fronts : formData.get('data_fronts'),
            age : parseInt(formData.get('data_age')),
            elevators : parseInt(formData.get('data_elevators')),
            state : formData.get('data_state'),
            method : formData.get('data_method'),
            currency : formData.get('data_currency'),
            lotArea : parseFloat(formData.get('data_lotarea')),
            buildArea : parseFloat(formData.get('data_buildarea')),
            value : parseFloat(formData.get('data_value'))
        }   

        if (!uploadEntry(newEntry, id)) return

        const dataEntry = `
        <li id="${id}">
            <div><b>•</b> <u>${id}</u></div><a onclick="removeItem('${id}')" style="color:gray;"><i class="fas fa-minus-circle"></i></a>
        </li>
        `
        if (!dropArea.classList.contains("full")) {
            dropArea.classList.add("full");
            document.querySelector(".point_container").innerHTML = "<ul></ul>";
        }

        const ulhtml = document.querySelector(".point_container.full ul").innerHTML;
        document.querySelector(".point_container.full ul").innerHTML = ulhtml + dataEntry;

        document.getElementById("new_data").reset();

    }
})

async function uploadEntry (entry, id) {
    const formData = new FormData();
    formData.append("entry_id", id);
    formData.append("entry", JSON.stringify(entry));

    try {
        const response = await fetch("./entry", {
            method: "POST",
            body: formData,
        });
        const responseText = await response.text();
        console.log(responseText);
        
    } catch (error) {
        console.log("Error: could not upload file");
        return false
    }

    return true
}

