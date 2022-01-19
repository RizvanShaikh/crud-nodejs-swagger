const mongoose = require("mongoose");
const { toJSONData, paginateData } = require("./plugins");
const { DB_MODEL_REF } = require("../config/constant");

const universitySchema = new mongoose.Schema(
  {
    alphaTwoCode: { type: String, required: true },
    country: { type: String, required: true },
    domain: { type: String, required: true },
    webPage: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    isActive: { type: Boolean, default: true },
    createdBy: { type: String, default: null },
    updatedBy: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
universitySchema.plugin(toJSONData);
universitySchema.plugin(paginateData);

const University = mongoose.model(DB_MODEL_REF.UNIVERSITY, universitySchema);
module.exports = University;
