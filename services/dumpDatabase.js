// const mysql = require("mysql2/promise");
// const { MongoClient } = require("mongodb");
// const fs = require("fs");
// const path = require("path");

// // MySQL configuration
// const mysqlConfig = {
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "dump_check_db",
// };

// // MongoDB configuration
// const mongoUrl =
//   "mongodb+srv://check_mls:uAbq9J3Kbia0j5ge@cluster0.xvqvt5s.mongodb.net/DUMMYCHECK";
// const mongoDbName = "DUMMYCHECK";

// // Generate date-based directory path
// const date = new Date();
// const dateString = `${date.getFullYear()}-${(date.getMonth() + 1)
//   .toString()
//   .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
// const backupDir = path.join(__dirname, `../dumps/${dateString}`);
// if (!fs.existsSync(backupDir)) {
//   fs.mkdirSync(backupDir, { recursive: true });
// }

// async function fetchMySQLData(tableName, connection) {
//   const [rows] = await connection.query(`SELECT * FROM ${tableName}`);
//   return rows;
// }

// async function saveToJSONFile(tableName, data) {
//   const filePath = `dumps/${dateString}/${tableName}.json`;
//   fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
// }

// async function importToMongoDB(tableName, data, client) {
//   if (data.length === 0) {
//     console.log(`No data to import for table: ${tableName}`);
//     return;
//   }

//   const db = client.db(mongoDbName);
//   const collection = db.collection(tableName);

//   await collection.insertMany(data);
// }

// async function main() {
//   const mysqlConnection = await mysql.createConnection(mysqlConfig);
//   const mongoClient = new MongoClient(mongoUrl);

//   await mongoClient.connect();

//   // Get MongoDB database reference
//   const db = mongoClient.db(mongoDbName);

//   // Get all table names from MySQL
//   const [tables] = await mysqlConnection.query("SHOW TABLES");
//   for (let table of tables) {
//     const tableName = Object.values(table)[0];
//     console.log(`Exporting table: ${tableName}`);

//     // Check if the collection exists and drop it
//     const collections = await db.listCollections({ name: tableName }).toArray();
//     if (collections.length > 0) {
//       console.log(`Dropping existing collection: ${tableName}`);
//       await db.collection(tableName).drop();
//     }

//     const data = await fetchMySQLData(tableName, mysqlConnection);
//     await saveToJSONFile(tableName, data); // Save data to JSON file
//     await importToMongoDB(tableName, data, mongoClient);
//   }

//   await mysqlConnection.end();
//   await mongoClient.close();

//   console.log("All tables exported and imported successfully.");
// }

// module.exports = main;
