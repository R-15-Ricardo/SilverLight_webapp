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
    ['Moneda principal para cálculos', 'currency'],
    ['Área Terreno', 'lotArea'],
    ['Área Construcción', 'buildArea'],
    ['Valor comercial', 'value'],
])

customParser.parseSheet = (data) => {
    if (data[1].length != headers2name.size) {
        return [];
    }

    for (let key of headers2name.keys()) {
        if (!data[1].includes(key)) {
            console.log('invalid data sheet');
            return [];
        }
    }

    let sheetEntries = []

    for (let dataRow of data.slice(2,data.length)) {
        let i = 0
        let newEntry = new Object()

        if (dataRow.length == 0) continue;

        for (let key of headers2name.keys()) {
            newEntry[headers2name.get(key)] = dataRow[i];
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