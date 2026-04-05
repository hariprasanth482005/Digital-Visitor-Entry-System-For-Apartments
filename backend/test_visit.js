require('dotenv').config();
const { ConvexHttpClient } = require('convex/browser');
const { api } = require('./convex/_generated/api');

// Setup convex client
const client = new ConvexHttpClient(process.env.CONVEX_URL);

async function test() {
    try {
        console.log("Adding first visit...");
        const residents = await client.query(api.users.getResidents);
        if (residents.length === 0) {
            console.log("No residents found. Please add a resident first.");
            return;
        }
        const resident = residents[0];

        console.log("Adding visit 1...");
        const v1 = await client.mutation(api.visitors.addVisitor, {
            name: "Test Visitor",
            phone: "9999999999",
            flatNumber: resident.flatNumber,
            residentId: resident._id,
            purpose: "Delivery"
        });

        console.log("Checking visit by phone...");
        let check1 = await client.query(api.visitors.getVisitorByPhone, { phone: "9999999999" });
        console.log("Check1 ID:", check1._id, "Status:", check1.status);

        console.log("Checking out visit 1...");
        await client.mutation(api.visitors.updateVisitorStatus, {
            id: v1,
            status: "checked_out",
            userId: resident._id
        });

        console.log("Adding visit 2...");
        const v2 = await client.mutation(api.visitors.addVisitor, {
            name: "Test Visitor",
            phone: "9999999999",
            flatNumber: resident.flatNumber,
            residentId: resident._id,
            purpose: "Friend"
        });

        console.log("Checking visit by phone...");
        let check2 = await client.query(api.visitors.getVisitorByPhone, { phone: "9999999999" });
        console.log("Check2 ID:", check2._id, "Status:", check2.status);
        if (check2._id === v2) {
            console.log("SUCCESS! getVisitorByPhone returns the NEWEST visit.");
        } else {
            console.log("FAIL! getVisitorByPhone returned the OLD visit.");
        }

    } catch (e) {
        console.error(e);
    }
}

test();
