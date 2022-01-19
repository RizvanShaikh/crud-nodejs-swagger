/* eslint-disable no-param-reassign */

const {
  DEFAULT_SELECTED_LANGUAGE,
  PER_PAGE_RECORD,
} = require("../config/constant");
const { mapResult } = require("../config/utils");

/**
 * A mongoose schema plugin which applies the following in the toJSON transform call:
 *  - removes __v, createdAt, updatedAt, and any path that has private: true
 *  - replaces _id with id
 */
const toJSON = (schema) => {
  let transform;
  if (schema.options.toJSON && schema.options.toJSON.transform) {
    transform = schema.options.toJSON.transform;
  }

  schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
    transform(doc, ret, options) {
      Object.keys(schema.paths).forEach((path) => {
        if (schema.paths[path].options && schema.paths[path].options.private) {
          delete ret[path];
        }
      });

      delete ret.isDeleted;
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      // delete ret.createdAt;
      // delete ret.updatedAt;
      if (transform) {
        return transform(doc, ret, options);
      }
    },
  });
};

const translationFields = {
  name: "translation.name",
  description: "translation.description",
};

const paginate = async (schema) => {
  schema.statics.paginate = async function (options, populateFields = []) {
    const sort = {};
    if (options.orderBy) {
      sort[options.orderBy] = options.sort ? options.sort : -1;
    }
    const limit =
      options.limit && parseInt(options.limit, PER_PAGE_RECORD) > 0
        ? parseInt(options.limit, PER_PAGE_RECORD)
        : PER_PAGE_RECORD;
    const page =
      options.page && parseInt(options.page, 10) > 0
        ? parseInt(options.page, 10)
        : 1;
    const skip = (page - 1) * limit;
    const totalCounts = await this.countDocuments(options.search).exec();
    const results = await this.find(options.search)
      .populate(populateFields)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();
    const totalPages = Math.ceil(totalCounts / limit);
    return {
      results,
      page,
      limit,
      totalPages,
      totalCounts,
    };
  };
  // for multi language
  schema.statics.translationPaginate = async function (
    options,
    populateFields = [],
    defaultLanguage = DEFAULT_SELECTED_LANGUAGE,
    selectedFields = null
  ) {
    let sort = { createdAt: -1 };
    if (options.orderBy) {
      const field = translationFields[options.orderBy] || options.orderBy;
      sort = { [field]: options.sort ? parseInt(options.sort) : -1 };
    }
    const limit =
      options.limit && parseInt(options.limit, PER_PAGE_RECORD) > 0
        ? parseInt(options.limit, PER_PAGE_RECORD)
        : PER_PAGE_RECORD;
    const page =
      options.page && parseInt(options.page, 10) > 0
        ? parseInt(options.page, 10)
        : 1;
    const skip = (page - 1) * limit;
    let totalCounts = 0;
    const aggregateQuery = [
      { $unwind: "$translation" },
      {
        $match: {
          "translation.language": defaultLanguage,
          ...options.search,
        },
      },
    ];
    try {
      totalCounts = await this.aggregate(aggregateQuery).count("totalCount");
      totalCounts = totalCounts[0].totalCount;
    } catch {
      totalCounts = 0;
    }

    if (selectedFields) {
      aggregateQuery.push({
        $project: selectedFields,
      });
    }
    if (populateFields.length > 0) {
      populateFields.forEach((element) => {
        aggregateQuery.push({
          $lookup: selectedFields,
        });
      });
    }
    const results = await this.aggregate(aggregateQuery)
      .sort(sort)
      .skip(skip)
      .limit(limit);
    const totalPages = Math.ceil(totalCounts / limit);
    return {
      results: await mapResult(results),
      page,
      limit,
      totalPages,
      totalCounts,
    };
  };
};

/* exclud */
/**
 * A mongoose schema plugin which applies the following in the toJSON transform call:
 *  - removes __v, createdAt, updatedAt, and any path that has private: true
 *  - replaces _id with id
 */
const toJSONData = (schema) => {
  let transform;
  if (schema.options.toJSON && schema.options.toJSON.transform) {
    transform = schema.options.toJSON.transform;
  }

  schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
    transform(doc, ret, options) {
      Object.keys(schema.paths).forEach((path) => {
        if (schema.paths[path].options && schema.paths[path].options.private) {
          delete ret[path];
        }
      });

      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      // delete ret.createdAt;
      // delete ret.updatedAt;
      if (transform) {
        return transform(doc, ret, options);
      }
    },
  });
};

const paginateData = async (schema) => {
 
  schema.statics.paginate = async function (
    filter,
    options,
    populateFields = []
  ) {
    const sort = {};
    if (options.orderBy) {
      sort[options.orderBy] = options.sort ? options.sort : -1;
    }
    
    const limit =
      options.limit && parseInt(options.limit, 10) > 0
        ? parseInt(options.limit, 10)
        : 10;
    const page =
      options.page && parseInt(options.page)
        ? parseInt(options.page)
        : 1;
    
    const skip = (page - 1) * limit;
    const totalCounts = await this.countDocuments({...filter, ...options.search}).exec();
    const results = await this.find({...filter, ...options.search})
      .populate(populateFields)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();
    const totalPages = Math.ceil(totalCounts / limit);
    return {
      results,
      page,
      limit,
      totalPages,
      totalCounts,
    };
  };
  
};

module.exports = {
  toJSON,
  paginate,
  toJSONData,
  paginateData
};








