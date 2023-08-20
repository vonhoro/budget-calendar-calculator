import "server-only";
import * as mongodb from "../../utils/mongodb.js";
import * as uuidv4 from "../../utils/uuid.js";
import { cache } from "react";
import { NextResponse } from "next/server";
const db = "Budget";
const collection = "items";
export const DELETE = async (request, res) => {
  try {
    const info = await request.json();

    const { _id, ...rest } = info;

    const data = await mongodb.deleteOne({
      db,
      collection,
      filter: { _id },
    });
    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
  }
};
export const PUT = async (request, res) => {
  try {
    const info = await request.json();

    const { _id, ...rest } = info;

    const data = await mongodb.findOneAndUpdate({
      db,
      collection,
      filter: { _id },
      update: {
        $set: rest,
      },
      options: {
        returnDocument: "after",
      },
    });

    return NextResponse.json(data["value"]);
  } catch (error) {
    console.log(error);
  }
};
export const POST = async (request, res) => {
  try {
    const info = await request.json();
    const _id = uuidv4();
    const data = await mongodb.insertOne({
      db,
      collection,
      data: { _id, ...info },
    });

    const item = await mongodb.findOne({
      db,
      collection,
      filter: { _id },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.log(error);
  }
};

export const getItems = cache(async () => {
  try {
    const data = await mongodb.find({
      db,
      collection,
    });

    return data;
  } catch (error) {
    console.log(error);
  }
});
