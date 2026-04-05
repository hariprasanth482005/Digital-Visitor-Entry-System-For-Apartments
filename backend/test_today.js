require('dotenv').config();
const { ConvexHttpClient } = require('convex/browser');
const { api } = require('./convex/_generated/api');

const client = new ConvexHttpClient(process.env.CONVEX_URL);

async function test() {
    try {
        console.log("Fetching getTodayVisitors...");
        const visitors = await client.query(api.visitors.getTodayVisitors);

        console.log(`Returned ${visitors.length} visitors.`);

        // Count visitors with phone 9999999999
        const testVisitors = visitors.filter(v => v.phone === "9999999999");
        console.log(`Found ${testVisitors.length} matches for 9999999999 in Today's Visitors:`);
        testVisitors.forEach(v => console.log(v._id, new Date(v.createdAt).toISOString(), v.status));

    } catch (e) {
        console.error(e);
    }
}

test();
