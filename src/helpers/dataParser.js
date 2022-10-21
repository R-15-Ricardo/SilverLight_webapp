const customParser = {}

const headers2name = new Map([
    ['Fecha entrega del Informe', 'deliver'],
    ['Tipo de vía', 'streetType'],
    ['Piso', 'floor'],
    ['Departamento', 'apartment'],
    ['Provincia', 'province'],
    ['Distrito', 'district'],
    ['Número de estacionamiento', 'parkingNo'],
    ['Depósitos', 'depositNo'],
    ['Latitud (Decimal)', 'loc'],
    ['Longitud (Decimal)', 'loc'],
    ['Categoría del bien', 'category'],
    ['Posición', 'position'],
    ['Número de frentes', 'fronts'],
    ['Edad', 'age'],
    ['Elevador', 'elevators'],
    ['Estado de conservación', 'state'],
    ['Método Representado', 'method'],
    ['Área Terreno', 'lotArea'],
    ['Área Construcción', 'buildArea'],
    ['Valor comercial (USD)', 'value'],
])

customParser.parseSheet = (data) => {
    //console.log(data)

    let header_row = -1
    for (let i = 0; i<10; i++) {

        if (data[i].length != headers2name.size) {
            console.log('Row ' + String(i) + ': Size does not match');
            break;
        }

        for (let key of headers2name.keys()) {
            if (!data[i].includes(key)) {
                console.log('Row ' + String(i) + ': Keys do not match');
                break;
            }

            header_row = i;
            break
        }

        if (header_row != -1) break

    }

    if (header_row == -1) {
        console.log('Invalid data sheet: No matching header found')
        return []
    }

    console.log('Header found at row: ' + String(header_row))

    let sheetEntries = []

    for (let dataRow of data.slice(header_row+1,data.length)) {
        let i = 0
        let newEntry = new Object()

        if (dataRow.length == 0) continue;

        let loclist = new Array();

        for (let key of headers2name.keys()) {
            if (headers2name.get(key) === 'deliver') {
                newEntry[headers2name.get(key)] = new Date (dataRow[i]).toLocaleString('en-GB');
            } else if (headers2name.get(key) === 'loc') {
                loclist.push(parseFloat(dataRow[i]));
                if (loclist.length == 2) {
                    newEntry[headers2name.get(key)] = loclist;
                }
                
            } else {
                newEntry[headers2name.get(key)] = dataRow[i];
            }            
            i++;
        }

        sheetEntries.push(newEntry)
    }

    return sheetEntries
}

customParser.unpackEntries = (data) => {

    let entriesArray = Array();

    for (let key of Object.keys(data)) {

        if (key.includes('file')) {
            for (datapt of data[key]) {
                entriesArray.push(datapt)
            }
        } else if (key.includes('entry')) {
            entriesArray.push(data[key])
        }
    }

    return JSON.stringify(entriesArray)

}

module.exports = customParser;