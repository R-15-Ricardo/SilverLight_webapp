const router = require('express').Router();
//const csv = require('csv-string')
const xlsx = require('node-xlsx');
const customParser = require('../helpers/dataParser');

let dataEntries = {}

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/predict', async (req, res) => {

    if (Object.keys(dataEntries).length < 1) {
        res.send('Cannot predict on empty data')
        return
    }

    finalJson = customParser.unpackEntries(dataEntries);
    console.log(finalJson);

    dataEntries = {}

    res.render('loading');
});

router.post('/file', (req, res) => {
    let recievedXlsxData = xlsx.parse(req.files.file.data);

    let dataObjects = Array()

    for (let sheet of recievedXlsxData) {
        let sheetObjects = customParser.parseSheet(sheet.data);

        if (sheetObjects.length == 0) continue;        

        for (let dataEntry of sheetObjects) {
            dataObjects.push(dataEntry);
        }
    }

    if (dataObjects.length == 0){
        res.statusCode = 500;
        res.send(`File ${req.files.file.name} (id: ${req.body.file_id}) was invalid.`);    
        return;
    }

    dataEntries[req.body.file_id] = dataObjects

    console.log(Object.keys(dataEntries).length)
    //console.log(dataEntries)

    res.send(`File ${req.files.file.name} (id: ${req.body.file_id}) recieved sucsessfully.`);
});

router.post('/entry', (req, res) => {

    dataEntries[req.body.entry_id] = JSON.parse(req.body.entry)

    console.log(Object.keys(dataEntries).length)
    //console.log(dataEntries)

    res.send(`Entry ${req.body.entry_id}) recieved sucsessfully.`);
});


router.delete('/', (req, res) => {
    try {
        delete dataEntries[req.body.data_id];
    } catch {
        console.log('Entry was not found.');
    }

    console.log(Object.keys(dataEntries).length)

    res.send(`Deleted data point with id ${req.body.data_id}`)
});



module.exports = router;

