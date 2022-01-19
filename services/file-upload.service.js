const AWS = require("aws-sdk");
const fs = require("fs");
const CONFIG = require("../config/config");

async function uploadFileToS3(
  file,
  name = null,
  directory = null,
  bucketName = CONFIG.AWS.DEFAULT_BUCKET
) {
  try {
    let extension = file.split(";")[0].split("/")[1];
    const randomNumber = Math.floor(Math.random() * 100000);
    if (extension.includes("svg")) {
      extension = "svg";
    }
    const fileName = name
      ? `${name.replace(/\s/g, "-")}-${randomNumber}.${extension}`
      : `${randomNumber}.${extension}`;
    // console.log("fileName", fileName);
    const directoryPath = `${process.cwd()}\\static`;
    if (!fs.existsSync(`${directoryPath}`)) {
      fs.mkdirSync(directoryPath);
    }
    const filePath = `${directoryPath}\\${fileName}`;
    // console.log("filePath", filePath);
    fs.writeFileSync(
      filePath,
      new Buffer.from(file.split("base64,")[1], "base64")
    );
    // console.log(wasabiEndpoint);
    const S3 = new AWS.S3({
      accessKeyId: CONFIG.AWS.ACCESS_KEY,
      secretAccessKey: CONFIG.AWS.SECRET_KEY,
    });
    // console.log("S3", S3);
    const params = {
      Bucket: bucketName,
      Key: directory ? `${directory}/${fileName}` : fileName,
      Body: fs.createReadStream(filePath),
    };
    if (extension === "svg") {
      params.ContentType = "image/svg+xml";
    }
    try {
      // console.log("uploading file");
      const response = await S3.upload(params).promise();
      fs.unlinkSync(filePath);
      return response.Location;
    } catch (e) {
      // console.log("error in file upload", e);
    }
  } catch (e) {
    // console.log("error in file upload", e);
    return null;
  }
}

async function uploadMultipleFileS3(
  files,
  name = null,
  directory = null,
  bucketName = CONFIG.AWS.DEFAULT_BUCKET
) {
  try {
    // console.log(wasabiEndpoint);
    const S3 = new AWS.S3({
      accessKeyId: CONFIG.AWS.ACCESS_KEY,
      secretAccessKey: CONFIG.AWS.SECRET_KEY,
    });
    const returnFiles = [];
    for (let file of files) {
      const randomNumber = Math.floor(Math.random() * 100000);
      let extension = file.split(";")[0].split("/")[1];
      if (extension.includes("svg")) {
        extension = "svg";
      }
      // console.log("extension", extension);
      const fileName = name
        ? `${name.replace(/\s/g, "-")}-${randomNumber}.${extension}`
        : `${randomNumber}.${extension}`;
      const directoryPath = `${process.cwd()}\\static`;
      if (!fs.existsSync(`${directoryPath}`)) {
        fs.mkdirSync(directoryPath);
      }
      const filePath = `${directoryPath}\\${fileName}`;
      fs.writeFileSync(
        filePath,
        new Buffer.from(file.split("base64,")[1], "base64")
      );
      // console.log("S3", S3);
      const params = {
        Bucket: bucketName,
        Key: directory ? `${directory}/${fileName}` : fileName,
        Body: fs.createReadStream(filePath),
      };
      if (extension === "svg") {
        params.ContentType = "image/svg+xml";
      }
      try {
        // console.log("uploading file");
        const response = await S3.upload(params).promise();
        // console.log("response", response);
        fs.unlinkSync(filePath);
        returnFiles.push(response.Location);
      } catch (e) {
        // console.log("error in file upload", e);
      }
    }
    return returnFiles;
  } catch (e) {
    // console.log("error in file upload", e);
    return null;
  }
}

async function deleteFileFromS3(file, bucketName = CONFIG.AWS.DEFAULT_BUCKET) {
  // console.log("deleteFileFromS3", file);
  try {
    const fileName = file.split(`${bucketName}/`)[1];
    const params = { Bucket: bucketName, Key: fileName };
    // console.log("file", file);
    const S3 = new AWS.S3({
      accessKeyId: CONFIG.AWS.ACCESS_KEY,
      secretAccessKey: CONFIG.AWS.SECRET_KEY,
    });
    S3.deleteObject(params).promise();
    return true;
  } catch (e) {
    // console.log("error in file deleteFileFromS3", e);
    return null;
  }
}

async function deleteMultipleFilesFromS3(
  files,
  bucketName = CONFIG.AWS.DEFAULT_BUCKET
) {
  // console.log("deleteFileFromS3", files);
  try {
    const S3 = new AWS.S3({
      accessKeyId: CONFIG.AWS.ACCESS_KEY,
      secretAccessKey: CONFIG.AWS.SECRET_KEY,
    });
    for (const file of files) {
      const fileName = file.split(`${bucketName}/`)[1];
      // console.log("file", file);
      if (!fileName) continue;
      const params = { Bucket: bucketName, Key: fileName };
      S3.deleteObject(params).promise();
    }
    return true;
  } catch (e) {
    // console.log("error in file deleteFileFromS3", e);
    return null;
  }
}

module.exports = {
  uploadFileToS3,
  uploadMultipleFileS3,
  deleteFileFromS3,
  deleteMultipleFilesFromS3,
};
