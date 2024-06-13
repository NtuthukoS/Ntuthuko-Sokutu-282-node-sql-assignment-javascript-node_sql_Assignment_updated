const { DatabaseError } = require("pg");

const queries = {
  createTable: `
    CREATE TABLE IF NOT EXISTS Visitors (
      id SERIAL PRIMARY KEY,
      visitor_full_name VARCHAR(255) NOT NULL,
      visitor_age INTEGER NOT NULL,
      date_of_visit DATE NOT NULL,
      time_of_visit TIME NOT NULL,
      assisted_by VARCHAR(255) NOT NULL,
      comments TEXT
    )
  `,
  addNewVisitor: `
    INSERT INTO visitors (visitor_full_name, visitor_age, date_of_visit, time_of_visit, assisted_by, comments)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `,
  listAllVisitors: `
    SELECT visitor_full_name as fullName, id FROM visitors;
  `,
  deleteVisitor: `
    DELETE FROM visitors WHERE id = $1;
  `,
  updateVisitor: `
    UPDATE visitors
    SET $1 = $2 
    WHERE id = $3
    RETURNING *;
  `,
  viewVisitor: `
    SELECT * FROM visitors WHERE id = $1;
  `,
  deleteAllVisitors: `
    DELETE FROM visitors;
  `,
  viewLastVisitor: `
    SELECT id FROM visitors ORDER BY id DESC LIMIT 1;
  `,
};

const generalMessages = {
  tableCreated: "The table has been successfully created.",
  newVisitorCreated: "New visitor added.",
  listedAllVisitors: "Listed all visitors above.",
  deletedAllVisitors: "All visitors have been deleted.",
  vistorUpdated: "Visitor information updated",
  visitorFound: "Visitor Found",
  visitorDeleted: "The visitor has been deleted",
};

const errorMessages = {
  invalidVisitorData:
    "The visitor data provided is invalid. Please provide valid visitor data.",
  invalidVisitorName: "Invalid visitor name. Please provide a valid name.",
  dataNotFound: (name) => `No data found for the visitor named ${name}.`,
  ageError: "Age must be a non-negative number.",
  dateOfVisitError:
    "Invalid date of visit. Please provide a valid date in the format YYYY-MM-DD, as a string.",
  timeOfVisitError:
    "Time of visit must be in the 24 hour format. Eg. 11 at night should be 23:00.",
  fullNameError:
    "Your name must only consist of your name and surname only separated by a space.",
  invalidCommentError: "Comment must be a string.",
  invalidAssistantName:
    "Assistant name must only consist of name and surname separated by a space.",
  invalidColumnName: (name) =>
    `${name} is not a valid column name. Please provide a valid column name.`,
  unexpectedDatabaseError:
    "An unexpected error occurred while accessing the database.",
  detailedErrorMessage: (func) =>
    `${errorMessages.invalidVisitorData} Details: ${func}`,
  addingVisitorError: (message) => `Failed to add new visitor: ${message}.`,
  listingVisitorsError: (message) => `Failed to list visitors: ${message}.`,
  deletingVisitorError: (message) => `Failed to delete visitor: ${message}.`,
  updatingVisitorError: (message) => `Failed to update visitor: ${message}.`,
  detailedUpdateErrorMessage: (func) =>
    `${errorMessages.updatingVisitorError("")} Details: ${func}`,
  visitorNotFoundError: (id) => `Visitor with ID ${id} not found.`,
  noVisitorsFound: "No visitors found.",
  databaseError : "Database error."
};

const regexPatterns = {
  dateOfVisit: /^\d{4}-\d{2}-\d{2}$/,
  timeOfVisit: /^(0?[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
  fullName: /^[a-zA-Z]+\s[a-zA-Z]+$/,
};

const columnMapping = {
  fullName: "visitor_full_name",
  age: "visitor_age",
  dateOfVisit: "date_of_visit",
  timeOfVisit: "time_of_visit",
  assistantName: "assisted_by",
  comments: "comments",
};

module.exports = { queries, regexPatterns, errorMessages, generalMessages,columnMapping };
