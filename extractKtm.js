const fs = require('fs');

// 1. Read your specific file
const rawData = fs.readFileSync('./nepal-wards.geojson');
const geojson = JSON.parse(rawData);

console.log("Total polygons in original file:", geojson.features.length);

// 2. Filter for Kathmandu and Lalitpur District urban centers
const urbanPalikas = geojson.features.filter(feature => {
    if (!feature.properties) return false;

    // Use your specific keys
    const district = (feature.properties.DISTRICT || "").toLowerCase();
    
    // We want everything in the Kathmandu (Dist ID 27) and Lalitpur (Dist ID 28) districts
    return district === 'kathmandu' || district === 'lalitpur';
});

// 3. Clean and Standardize the properties for your Frontend
const cleanFeatures = urbanPalikas.map(f => ({
    type: "Feature",
    geometry: f.geometry,
    properties: {
        // Since this file doesn't have Ward numbers, we use the VDC_NAME as the primary ID
        name: f.properties.VDC_NAME, 
        district: f.properties.DISTRICT,
        code: f.properties.VDC_CODE,
        // We add a 'type' to distinguish the big metros for styling later
        isMetropolitan: ["Kathmandu", "Lalitpur"].includes(f.properties.VDC_NAME)
    }
}));

const output = {
    type: "FeatureCollection",
    features: cleanFeatures
};

fs.writeFileSync('./kathmandu-palikas.json', JSON.stringify(output, null, 2));

console.log(`\n✅ Success! Extracted ${cleanFeatures.length} Palikas/Municipalities.`);
console.log(`📍 Sample of included areas: ${cleanFeatures.slice(0, 5).map(f => f.properties.name).join(", ")}...`);