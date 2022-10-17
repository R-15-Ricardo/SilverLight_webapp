const dropArea = document.querySelector(".point_container");
const dragText = dropArea.querySelector("h2");
const button = dropArea.querySelector("button");
const input = dropArea.querySelector("#input-data");

const defaultText = dragText.textContent;
const emptyDragArea = dropArea.innerHTML;

let files;

button.addEventListener('click', () => {
    input.click();
});

input.addEventListener('change', (e) => {
    files = input.files;
    dropArea.classList.add("active");
    showFiles(files);
    dropArea.classList.remove("active");
});

dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.classList.add("active");
    dragText.textContent = "Drop to upload files";
})

dropArea.addEventListener("dragleave", (e) => {
    dropArea.classList.remove("active");
    dragText.textContent = defaultText;
})

dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    files = e.dataTransfer.files;
    showFiles(files);

    dropArea.classList.remove("active");
    dragText.textContent = defaultText;
})

function showFiles(files) {
    if (files.length === undefined) {
        processFile(files);
    } else {
        for (const file of files) {
            processFile(file);
        }
    }
}

function processFile(file) {
    const docType = file.type;
    const validExtensions = ['text/csv', 'text/json'];

    if (validExtensions.includes(docType)) {
        const fileReader = new FileReader();
        const id = `file-${Math.random().toString(32).substring(7)}`;
        
        fileReader.addEventListener('load', (e) => {
            const dataFile = `
            <li id="${id}">
                <div><b>•</b> <u>${file.name}</u></div><a onclick="removeItem('${id}')" style="color:gray;"><i class="fas fa-minus-circle"></i></a>
            </li>
            `

            if (!dropArea.classList.contains("full")) {
                dropArea.classList.add("full");
                document.querySelector(".point_container").innerHTML = "<ul></ul>";
            }

            const ulhtml = document.querySelector(".point_container.full ul").innerHTML;
            document.querySelector(".point_container.full ul").innerHTML = ulhtml + dataFile;
        });

        fileReader.readAsDataURL(file);
        uploadFile(file, id);
        
    } else {
        alert("Not a valid file");
    }

}

async function uploadFile (entry, id) {
    const formData = new FormData();
    formData.append("file_id", id);
    formData.append("file", entry);

    try {
        const response = await fetch("./file", {
            method: "POST",
            body: formData,
        });
        const responseText = await response.text();
        console.log(responseText);
        
    } catch (error) {
        console.log("Error: could not upload file");
    }
}

async function removeItem(id) {
    const formData = new FormData();
    formData.append("data_id", id);

    try {
        const response = await fetch("./", {
            method: "DELETE",
            body: formData,
        });
        const responseText = await response.text();
        console.log(responseText);
        
    } catch (error) {
        console.log("Error: could not upload file");
        return
    }

    document.getElementById(id).remove();
    const dataList = document.querySelector(".point_container.full ul");

    if (dataList.childElementCount < 1) {
        dropArea.classList.remove("full");
        document.querySelector(".point_container").innerHTML = emptyDragArea;
    }

    

}

