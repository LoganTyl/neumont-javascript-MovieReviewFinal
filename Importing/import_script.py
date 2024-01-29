# python -m pip install pymongo
# pip install bcrypt

from pymongo import MongoClient
import bcrypt
import csv

client = MongoClient(port=27017)

db = client.fandingo

with open('users4.csv') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    line_count = 0

    for row in csv_reader:
        if line_count == 0:
            print(f'Column names are {", ".join(row)}')
            line_count += 1
        else:
            # Replacing the unhashed password with the hashed password.
            hashed = bcrypt.hashpw(row[7].encode('utf-8'), bcrypt.gensalt())
            row[7] = hashed

            user = {
                'isAdmin' : False,
                'username' : f'{row[0].lower()}{row[1][0].lower()}',
                'fname' : row[0],
                'lname' : row[1],
                'street' : row[2],
                'city' : row[3],
                'state' : row[4],
                'zip_code' : row[5],
                'email' : row[6],
                'password' : row[7],
                'phone' : row[8],
                'reviews' : []
            }

            # Inserting user into database
            result = db.accounts.insert_one(user)

            # Confirming that the object was successfully inserted into the database.
            print(f'Created {result.inserted_id}')

            # print(row)
            # print(hashed == bcrypt.hashpw(row[7].encode('utf-8'), hashed))
            line_count += 1
    print(f'Processed {line_count} lines.')