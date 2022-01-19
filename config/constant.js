const STATUS_CODE = {
  ERROR: 0,
  SUCCESS: 1,
};

const DEVICE_TYPE = {
  IOS: "ios",
  ANDROID: "android",
  WEB: "web",
};

const ACCOUNT_TYPE = {
  SUPERADMIN: "SUPERADMIN",
  ADMIN: "ADMIN",
  BUYER: "BUYER",
  SALES: "SALES",
  SELLER: "SELLER",
};

const ACCOUNT_LEVEL = {
  SUPERADMIN: 1,
  ADMIN: 2,
  BUYER: 3,
  SELLER: 4,
};

const ACTIVE_STATUS = {
  OFFLINE: 0,
  ONLINE: 1,
};

const STATUS = {
  INACTIVE: "INACTIVE",
  ACTIVE: "ACTIVE",
  PENDING: "PENDING",
};

const PER_PAGE_RECORD = 10;

const DB_MODEL_REF = {
  UNIVERSITY: "university",
  USER: "user"
};

const ROLE_TYPE = {
  ADMIN: 1,
  USER: 2
};

const DEFAULT_LANGUAGE = {
  ENGLISH: "en"
};

const DEFAULT_SELECTED_LANGUAGE = "en";

const USER_FIELDS = ["id", "isActive", "firstName", "lastName", "email"];

const GENDER = {
  MALE: "male",
  FEMALE: "female",
  OTHER: "other"
}



module.exports = {
  DB_MODEL_REF,
  STATUS_CODE,
  DEFAULT_LANGUAGE,
  PER_PAGE_RECORD,
  ACCOUNT_TYPE,
  ACCOUNT_LEVEL,
  ACTIVE_STATUS,
  STATUS,
  GENDER,
  DEVICE_TYPE,
  ROLE_TYPE,
  USER_FIELDS,
  DEFAULT_SELECTED_LANGUAGE
};
