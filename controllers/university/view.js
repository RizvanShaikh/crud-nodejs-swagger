// ==================== Load Starts Modules =========================================
const httpStatus = require("http-status");
const { pick } = require("lodash");
const { University } = require("../../models");

const MESSAGE = require("../../config/message");
const { uploadFileToS3 } = require("../../services/file-upload.service");

const _ = require('lodash');
// ==================== Load Modules Ends ===========================================


/**
 * Query for University
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const listUniversity = async (req, res) => {
    const filter = pick(req.query, ["name"]);
    const options = pick(req.query, [
        "search",
        "sort",
        "orderBy",
        "limit",
        "offset",
        "page"
    ]);
    if (options.search) {
        options.search = {
            $or: [
                { name: { $regex: options.search, $options: "i" } },
                { alphaTwoCode: { $regex: options.search, $options: "i" } },
                { sku: { $regex: options.search, $options: "i" } },
                { shortDescription: { $regex: options.search, $options: "i" } },
                { longDescription: { $regex: options.search, $options: "i" } },
                { supplierRef: { $regex: options.search, $options: "i" } }
            ],
        };
    }
    const data = await University.paginate(filter, options);
    return res.status(httpStatus.OK).send({ ...data });
};


const addUniversity = async (req, res) => {
    const data = req.body;
    await University.findOne({ name: data.name })
        .then(async (existName) => {
            if (!existName) {
                const university = await University.create(data);
                return res.json({
                    code: 200,
                    status: true,
                    message: MESSAGE.createSuccess,
                    data: university
                })
            } else {
                return res.json({
                    code: 404,
                    status: false,
                    message: MESSAGE.nameExists,
                    data: {}
                })
            }
        })
        .catch((error) => {
            return res.json({
                code: 404,
                status: false,
                message: error.message,
                data: {}
            })
        });
}

/**
 * Update University by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<University>}
 */
const editUniversity = async (req, res) => {
    let query = {
        _id: req.params.id
    };
    let data = req.body;
    let uniqueQuery = { name: data.name }
// console.log("data.name", data.name)
    return await University.findOne(uniqueQuery).then(async (data) => {
        /* if university found by exixting name this if condition will execute */
        if (data && data != null) {
            return await University.findOne(query).then(async (result) => {
                if (result && result != null) {
                    let details = req.body;
                    if (data.name == result.name) {
                        if (req.body.image == null || req.body.image == 'undefined' || req.body.image == undefined) {
                            details.image = result.image;
                            return await University
                                .findByIdAndUpdate(query, { $set: details })
                                .then(async (result) => {
                                    if (result) {
                                        return res.json({
                                            code: 200,
                                            status: true,
                                            message: MESSAGE.editSuccess,
                                            data: result
                                        })
                                    }
                                }).catch((error) => {
                                    return error;
                                });
                        } else {
                            return await University
                                .findByIdAndUpdate(query, { $set: details })
                                .then(async (result) => {
                                    if (result) {
                                        return res.json({
                                            code: 200,
                                            status: true,
                                            message: MESSAGE.editSuccess,
                                            data: result
                                        })
                                    }
                                }).catch((error) => {
                                    return error;
                                });
                        }

                    } else {
                        return res.json({
                            code: 404,
                            status: false,
                            message: MESSAGE.nameExists,
                            data: {}
                        })
                    }
                } else {
                    return res.json({
                        code: 403,
                        status: false,
                        message: MESSAGE.invalidID,
                        data: {}
                    })
                }
            }).catch((error) => {
                return error;
            })

        } else {
            /* if university found not found y existing name the else condition will execute */
            return await University.findById(query).then(async (result) => {
                if (result && result != null) {
                    let details = req.body;
                    if (req.body.image == null || req.body.image == 'undefined' || req.body.image == undefined) {
                        details.image = result.image;
                        return await University
                            .findOneAndUpdate(query, { $set: details })
                            .then(async (result) => {
                                if (result) {
                                    res.json({
                                        code: 200,
                                        status: true,
                                        message: MESSAGE.editSuccess,
                                        data: result
                                    })
                                }
                            }).catch((error) => {
                                return error;
                            });
                    } else {
                        return await University
                            .findOneAndUpdate(query, { $set: details })
                            .then(async (result) => {
                                if (result) {
                                    res.json({
                                        code: 200,
                                        status: true,
                                        message: MESSAGE.editSuccess,
                                        data: result
                                    })
                                }
                            }).catch((error) => {
                                return error;
                            });
                    }

                } else {
                    return res.json({
                        code: 403,
                        status: false,
                        message: MESSAGE.invalidID,
                        data: {}
                    })
                }
            }).catch((error) => {
                return res.json({
                    code: 403,
                    status: false,
                    message: error.message,
                    data: {}
                })
            });
        }
    }).catch((error) => {
        return error;
    });
};


/**
 * Delete Universiry by id
 * @param {ObjectId} universityId
 * @returns {Promise<University>}
 */
const deleteUniversity = async (req, res) => {
    try {
        const { id } = req.params;
        university = await University.findByIdAndRemove(id);
        if (!university) {
            return res.json({
                code: 404,
                status: false,
                message: MESSAGE.invalidID,
                data: {}
            })
        }
        return res.json({
            code: 200,
            status: true,
            message: MESSAGE.deleteSuccess,
            data: {}
        })
    } catch {
        return res.json({
            code: 404,
            status: false,
            message: MESSAGE.invalidID,
            data: {}
        })
    }
};

/**
* Get University by id
* @param {ObjectId} id
* @param {boolean} allFields - true|false true then return default schema
* @returns {Promise<University>}
*/
const getUniversityByID = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await University.findById(id);
        if (!data) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .send({ message: MESSAGE.invalidID });
        }
        return res.status(httpStatus.OK).send({ data });
    } catch (error) {
        return res.json({
            code: 404,
            status: false,
            message: MESSAGE.invalidID,
            data: {}
        })
    }
};

module.exports = {
    listUniversity,
    addUniversity,
    editUniversity,
    deleteUniversity,
    getUniversityByID
};