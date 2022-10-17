const fileArea = document.querySelector(".point_container");
const addButton = document.querySelector("#add_point_button");

addButton.addEventListener('click', (e) => {
    e.preventDefault();
    let formData = new FormData(document.getElementById("new_data"));
    let valid = true;

    for (let val of formData.values()) {
        if (val == '') valid = false;
    }

    if (!valid) {
        alert("Invalid data entry");
    } else {
        const id = `entry-${Math.random().toString(32).substring(7)}`;

        let newEntry = {
            loc : '(' + formData.get('data_loclat') +', '+ formData.get('data_loclong') + ')',
            address : formData.get('data_address'),
            value : formData.get('data_value'),
            geo : formData.get('data_geo'),
            levels : formData.get('data_levels'),
            type : formData.get('data_type'),
            size : formData.get('data_size')
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

