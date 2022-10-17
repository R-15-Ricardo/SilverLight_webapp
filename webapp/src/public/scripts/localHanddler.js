let dataToSend = Array();

function parseDataFromFile(file, id) {
    fs.createReadStream(file)
        .pipe(csv({}))
        .on('data', () => results.push(data))
        .on('end', () => {
            console.log(results)
        });
}

function parseAdition() {
    
}