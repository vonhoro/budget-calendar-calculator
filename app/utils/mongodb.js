const { MongoClient, ObjectId } = require("mongodb");
const uri = "mongodb://127.0.0.1:27017/";

const operateDb = async ({
  execute,
  db,
  collection,
  data,
  filter,
  aggregation,
  projection,
  options,
  update,
}) => {
  try {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    const collec = await client.db(db).collection(collection);

    const response = await execute({
      collection: collec,
      data,
      filter,
      aggregation,
      projection,
      options,
      update,
    });
    await client.close();
    return response;
  } catch (error) {
    console.log("Mongo Error");
    console.log(error);
    const { data, ...rest } = error;
    console.log(rest);
  }
};

const aggregateMongo = async ({ collection, aggregation }) => {
  const allData = await collection
    .aggregate(aggregation, { allowDiskUse: true })
    .toArray();
  return allData;
  // console.log(allData);
};

const insertMany = async ({ db, collection, data }) =>
  await operateDb({
    execute: async ({ collection, data }) => {
      await collection.insertMany(data);
    },
    db,
    collection,
    data,
  });

const find = async ({ db, collection, filter = {}, projection = {} }) =>
  await operateDb({
    execute: async ({ collection, filter, projection }) => {
      const allData = await collection
        .find(filter)
        .project(projection)
        .toArray();
      return allData;
    },
    db,
    collection,
    filter,
    projection,
  });

const findOne = async ({ db, collection, filter = {}, projection = {} }) =>
  await operateDb({
    execute: async ({ collection, filter, projection }) => {
      const item = await collection.findOne(filter, { projection: projection });
      return item;
    },
    db,
    collection,
    filter,
    projection,
  });

const updateOne = async ({
  db,
  collection,
  filter = {},
  update = {},
  options = {},
}) =>
  await operateDb({
    execute: async ({ collection, filter, update, options }) => {
      const item = await collection.updateOne(filter, update, options);
      return item;
    },
    db,
    collection,
    filter,
    update,
    options,
  });

const findOneAndUpdate = async ({
  db,
  collection,
  filter = {},
  update = {},
  options = {},
}) =>
  await operateDb({
    execute: async ({ collection, filter, update, options }) => {
      const item = await collection.findOneAndUpdate(filter, update, options);
      return item;
    },
    db,
    collection,
    filter,
    update,
    options,
  });

const insertOne = async ({ db, collection, data }) =>
  await operateDb({
    execute: async ({ collection, db }) => {
      const item = await collection.insertOne(data);
      return item;
    },
    db,
    collection,
    data,
  });
const deleteOne = async ({ db, collection, filter }) =>
  await operateDb({
    execute: async ({ collection, db }) => {
      const item = await collection.deleteOne(filter);
      return item;
    },
    db,
    collection,
    filter,
  });

module.exports = {
  deleteOne,
  find,
  insertMany,
  findOne,
  updateOne,
  findOneAndUpdate,
  insertOne,
};
