import mongoose from 'mongoose';

beforeAll(async () => {
    await mongoose.connect(process.env['MONGO_URI'] as string);
})

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }

})

afterAll(async () => {
    await mongoose.disconnect();
})