const convex = require('./backend/config/convex');
const { api } = require('./backend/convex/_generated/api');

async function test() {
    try {
        console.log("Adding first visit...");
        const residents = await convex.query(api.users.getResidents);
        if (residents.length === 0) {
            console.log("No residents found. Please add a resident first.");
            return;
        }
        const resident = residents[0];

        await convex.mutation(api.visitors.addVisitor, {
            name: "Test Visitor",
            phone: "9999999999",
            flatNumber: resident.flatNumber,
            residentId: resident._id,
            purpose: "Delivery"
        });

        console.log("Adding second visit...");
        await convex.mutation(api.visitors.addVisitor, {
            name: "Test Visitor",
            phone: "9999999999",
            flatNumber: resident.flatNumber,
            residentId: resident._id,
            purpose: "Delivery"
        });

        console.log("Fetching today's visitors...");
        const visitors = await convex.query(api.visitors.getTodayVisitors);
        const testVisitors = visitors.filter(v => v.phone === "9999999999");
        console.log(`Found ${testVisitors.length} matches for 9999999999:`);
        testVisitors.forEach(v => console.log(v._id, v.createdAt, v.status));
    } catch (e) {
        console.error(e);
    }
}

test();
