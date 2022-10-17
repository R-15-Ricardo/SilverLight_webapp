const router = require('express').Router();
const csv = require('csv-string')

let dataEntries = {}

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/predict', async (req, res) => {

    if (Object.keys(dataEntries).length < 1) {
        res.send('Cannot predict on empty data')
        return
    }

    finalJson = unpackEntries();
    console.log(finalJson);

    dataEntries = {}

    res.render('loading');
});

router.post('/file', (req, res) => {
    let dataCsv = String(req.files.file.data);

    dataEntries[req.body.file_id] = csv.parse(dataCsv, { output: 'objects' })

    console.log(Object.keys(dataEntries).length)
    // console.log(dataEntries)

    res.send(`File ${req.files.file.name} (id: ${req.body.file_id}) recieved sucsessfully.`);
});

router.post('/entry', (req, res) => {

    dataEntries[req.body.entry_id] = JSON.parse(req.body.entry)

    console.log(Object.keys(dataEntries).length)
    // console.log(dataEntries)

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

function unpackEntries() {

    let entriesArray = Array();

    for (let key of Object.keys(dataEntries)) {

        if (key.includes('file')) {
            for (datapt of dataEntries[key]) {
                entriesArray.push(datapt)
            }
        } else if (key.includes('entry')) {
            entriesArray.push(dataEntries[key])
        }
    }

    return JSON.stringify(entriesArray)

}

module.exports = router;

