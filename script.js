const fs = require('fs');
const geojson = JSON.parse(fs.readFileSync('./nepal-wards.geojson'));

// Look at the first ward found in your 101-ward set
const sample = geojson.features.find(f => 
  JSON.stringify(f.properties).toUpperCase().includes("KATHMANDU")
);

console.log("--- EXACT PROPERTY KEYS IN YOUR FILE ---");
console.log(Object.keys(sample.properties));
console.log("--- SAMPLE DATA ---");
console.log(sample.properties);