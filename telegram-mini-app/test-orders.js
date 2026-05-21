import fs from 'fs';
const db = JSON.parse(fs.readFileSync('./src/data/database.json', 'utf8'));
const orders = db.orders.filter(o => o.customerId === "550e8400-e29b-41d4-a716-446655440000");
console.log("Orders for Abebe:", orders.length);
