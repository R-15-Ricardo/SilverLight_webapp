import sys, getopt
from faker import Faker
import pandas as pd
from scipy import stats
import numpy as np
import random

# Data headers
# 'loc': [LAT, LONG]
# 'adress': 'string: direccion fisica'
# 'value': 'int???: valorización del perito'
# 'geo': 'excuse me wtf???'
# 'levels': 'int:pisos'
# 'type': 'string: tioplogía del inmueble'
# 'size': 'mts2'

# Peru mean
#-10.688198, -74.925900

# Peru sd
#-12.122742, -77.053204

def parse_args(argv):
	generator_options = dict()

	try:
		opts, args = getopt.getopt(argv, "n:f:", ["entry-nums=","file-name="])
	except getopt.GetoptError:
		print("Missign agrs")
		sys.exit(2)

	for opt, arg in opts:
		if opt in ("-n", "--entry-nums"):
			generator_options['entry_nums'] = int(arg)
		if opt in ("-f", "--file-name"):
			generator_options['filename'] = arg

	if generator_options['entry_nums'] is None:
		print("Invalid args. Missing entry nums.")
		sys.exit(2)

	return generator_options



def generateData(n_entries: int) -> pd.DataFrame():
	f = Faker(['es_CL'])

	latCenter = -10.688198
	lonCenter = -74.925900

	latSd = np.abs(latCenter - -12.122742)
	lonSd = np.abs(lonCenter - -77.053204)

	dataDict = {
		'loc': [],
		'address': [],
		'value': [],
		'geo': [],
		'levels': [],
		'type': [],
		'size': []
	}

	usages = ['vivienda', 'oficinas', 'comercial']

	for i in range(n_entries):
		# Generate loc
		lat = stats.norm.rvs(size=1, loc=latCenter, scale=latSd)[0]
		lon = stats.norm.rvs(size=1, loc=lonCenter, scale=lonSd)[0]
		dataDict['loc'].append(str((lat, lon)))

		# Generate address
		dataDict['address'].append(f.address())

		# Generate value
		price = stats.uniform.rvs(size=1, loc=2000, scale=3000)[0]
		dataDict['value'].append('${valusd:.2f} USD'.format(valusd=price))

		# Generate geofile
		dataDict['geo'].append('---')

		# Generate levels
		dataDict['levels'].append(random.randint(0, 10))

		# Generate type
		dataDict['type'].append(usages[random.randint(0, 2)])

		# Generate size
		propertySize = price = stats.uniform.rvs(size=1, loc=10, scale=1990)[0]
		dataDict['size'].append('{houseSize:.2f} mts2'.format(houseSize=propertySize))

	return pd.DataFrame(dataDict)

if __name__ == '__main__':
	options = parse_args(sys.argv[1:])
	data = generateData(options["entry_nums"])


	if options['filename'] is None:
		data.to_csv('dummy_data.csv', index=False)
	else:
		data.to_csv(options['filename']+'.csv', index=False)

	print("Data generated successfully!!")
	
