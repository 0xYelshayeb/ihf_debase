import csv

def extract_addresses(file_path):
    addresses = []

    with open(file_path, mode='r', newline='') as file:
        csv_reader = csv.DictReader(file)
        for row in csv_reader:
            addresses.append(row['HolderAddress'])

    return addresses

file_path = 'holders.csv'

# Extract addresses
addresses = extract_addresses(file_path)

# Print the list of addresses
print(addresses[:200])
