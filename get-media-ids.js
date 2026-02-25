const { MongoClient } = require('mongodb');

async function run() {
    const uri = "mongodb+srv://mosque-admin:mosque123@cluster0.oggca09.mongodb.net/mosque-al-falah";
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db('mosque-al-falah');
        const media = database.collection('media');

        const filenames = [
            "A_photorealistic_cinematic_202602250646.jpeg",
            "A_warm_atmospheric_202602250646.jpeg",
            "Generate_a_photorealistic_202602250601.jpeg",
            "Generate_a_sweeping_202602250637.jpeg",
            "A_majestic_night_202602250645.jpeg",
            "A_majestic_night_202602250646.jpeg",
            "White_surface_in_202602250646.jpeg",
            "A_serene_eyelevel_202602250646.jpeg",
            "A_serene_eyelevel_202602250646 (1).jpeg"
        ];

        const docs = await media.find({ filename: { $in: filenames } }).toArray();
        console.log(JSON.stringify(docs.map(i => ({ id: i._id, filename: i.filename }))));
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
run();
