const mysql = require("mysql2/promise");
const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

// MySQL configuration
const mysqlConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "dump_check_db",
};

// MongoDB configuration
const mongoUrl =
  "mongodb+srv://check_mls:uAbq9J3Kbia0j5ge@cluster0.xvqvt5s.mongodb.net/DUMMYCHECK";
const mongoDbName = "DUMMYCHECK";

// Generate date-based directory path
const date = new Date();
const dateString = `${date.getFullYear()}-${(date.getMonth() + 1)
  .toString()
  .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
const backupDir = path.join(__dirname, `../dumps/${dateString}`);
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

async function fetchMySQLData(tableName, connection) {
  const [rows] = await connection.query(`SELECT * FROM ${tableName}`);
  return rows;
}

async function saveToJSONFile(tableName, data) {
  const filePath = `dumps/${dateString}/${tableName}.json`;
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

async function importToMongoDB(tableName, data, client) {
  if (data.length === 0) {
    console.log(`No data to import for table: ${tableName}`);
    return;
  }

  const db = client.db(mongoDbName);
  const collection = db.collection(tableName);

  await collection.insertMany(data);
}

async function main() {
  const mysqlConnection = await mysql.createConnection(mysqlConfig);
  const mongoClient = new MongoClient(mongoUrl);

  await mongoClient.connect();

  // Get MongoDB database reference
  const db = mongoClient.db(mongoDbName);

  // Get all table names from MySQL
  const [tables] = await mysqlConnection.query("SHOW TABLES");
  for (let table of tables) {
    const tableName = Object.values(table)[0];
    console.log(`Exporting table: ${tableName}`);

    // Check if the collection exists and drop it
    const collections = await db.listCollections({ name: tableName }).toArray();
    if (collections.length > 0) {
      console.log(`Dropping existing collection: ${tableName}`);
      await db.collection(tableName).drop();
    }

    const data = await fetchMySQLData(tableName, mysqlConnection);
    await saveToJSONFile(tableName, data); // Save data to JSON file
    await importToMongoDB(tableName, data, mongoClient);
  }

  await mysqlConnection.end();
  await mongoClient.close();

  console.log("All tables exported and imported successfully.");
}

module.exports = main;

// const { MongoClient } = require("mongodb");
// const { Client } = require("pg");

// // mongodb connection
// const mongoDb =
//   "mongodb://sidd:siddhesh123@128.140.104.241:27017/postgresDump?authSource=admin";
// const mongoDbName = "postgresDump";
// const mongoClient = new MongoClient(mongoDb);

// // postgres connection
// const postgresClient = new Client({
//   user: "hit",
//   host: "103.112.121.125",
//   database: "sdms",
//   password: "Hit@#$2024",
//   port: 5432,
// });

// async function getTableName(table) {
//   try {
//     const res = await postgresClient.query(
//       `SELECT * FROM ${table} WHERE schemaname = \'public\' ORDER BY tablename ASC`
//     );
//     return res.rows.map((item) => item.tablename);
//   } catch (error) {
//     return error;
//   }
// }

// // store in mongodb with conditions
// async function importToMongoDb(item, data) {
//   const db = mongoClient.db(mongoDbName);
//   const collection = db.collection(item);

//   // if (collection) {
//   //   data.filter(async (entry) => {
//   //     let yesterday = new Date(
//   //       new Date().setDate(new Date().getDate() - 1)
//   //     ).getTime();
//   //     let itemCreate = new Date(entry.created_at).getTime();

//   //   });
//   // }
//   await collection.insertMany(data);
// }

// // fetch data from pg n send to mongo
// async function exportPgImportToMongo() {
//   console.time("dbsave"); // Start the timer here
//   let tables = await getTableName(`pg_catalog.pg_tables`);

//   await Promise.all(
//     tables?.map(async (item) => {
//       if (item === "document_dataexcels") {
//         return;
//       }
//       const res = await postgresClient.query(`SELECT * FROM ${item}`);
//       const data = res?.rows;

//       console.log(`Exporting table: ${item}`);

//       if (data && data.length > 0) {
//         await importToMongoDb(item, data);
//       } else {
//         console.log(`No data in table - ${item}`);
//       }
//     })
//   );

//   console.log("Done exporting the database");
//   console.timeEnd("dbsave"); // Stop the timer here
// }

// // running both
// async function main() {
//   await postgresClient.connect();
//   await mongoClient.connect();
//   console.log("Connected to pg & mongo");
// }

// main()
//   .then(async () => {
//     exportPgImportToMongo();
//   })
//   .catch((err) => console.log(err));
