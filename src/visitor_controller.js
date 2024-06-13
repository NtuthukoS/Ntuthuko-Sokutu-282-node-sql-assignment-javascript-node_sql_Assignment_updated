const pool = require("./config_pool.js");
const { queries, generalMessages, errorMessages, columnMapping } = require("./helper_objects");
const { validateVisitorData, validateUpdateInputs } = require("./helper_functions");

const createTable = async () => {
  await pool.query(queries.createTable);
  return generalMessages.tableCreated;
};

async function executeQuery(queryText, values = []) {
  const result = await pool.query(queryText, values);
  return result.rows;
}

async function addNewVisitor(visitor) {
  validateVisitorData(visitor);
  const { fullName, age, dateOfVisit, timeOfVisit, assistantName, comments } = visitor;
  const values = [fullName, age, dateOfVisit, timeOfVisit, assistantName, comments];
  await executeQuery(queries.addNewVisitor, values);
  return generalMessages.newVisitorCreated;
}

async function listAllVisitors() {
  const visitors = await executeQuery(queries.listAllVisitors);
  if (visitors.length === 0) {
    throw new Error(errorMessages.noVisitorsFound);
  }
  return visitors;
}

async function deleteVisitor(id) {
  if (isNaN(parseInt(id))) {
    throw new Error(errorMessages.invalidVisitorID);
  }
  const visitorExists = await executeQuery(queries.viewVisitor, [id]);
  if (visitorExists.length === 0) {
    throw new Error(errorMessages.visitorNotFoundError(id));
  }
  await executeQuery(queries.deleteVisitor, [id]);
  return { message: generalMessages.visitorDeleted, visitor: visitorExists[0] };
}

async function updateVisitor(id, column, newValue) {
  const mappedColumn = columnMapping[column] || column;
  if (isNaN(parseInt(id))) {
    throw new Error(errorMessages.invalidVisitorID);
  }
  const queryText = `UPDATE visitors SET ${mappedColumn} = $1 WHERE id = $2 RETURNING *;`;
  const values = [newValue, id];
  validateUpdateInputs(column, newValue);
  const updatedVisitor = await executeQuery(queryText, values);
  if (updatedVisitor.length === 0) {
    throw new Error(errorMessages.visitorNotFoundError(id));
  }
  const visitor = updatedVisitor[0];
  return { message: generalMessages.visitorUpdated, visitor };
}

async function viewVisitor(id) {
  if (isNaN(parseInt(id))) {
    throw new Error(errorMessages.invalidVisitorID);
  }
  const visitor = await executeQuery(queries.viewVisitor, [id]);
  if (visitor.length === 0) {
    throw new Error(errorMessages.visitorNotFoundError(id));
  }
  const visitorData = visitor[0];
  for (const column in visitor[0]) {
    if (columnMapping[column]) {
      visitorData[columnMapping[column]] = visitor[0][column];
    }
  }
  if (visitorData.date_of_visit) {
    visitorData.dateOfVisit = visitorData.date_of_visit.toISOString().split("T")[0];
    delete visitorData.date_of_visit;
  }
  return { message: generalMessages.visitorFound, visitor: visitorData };
}

async function deleteAllVisitors() {
  const result = await pool.query(queries.deleteAllVisitors);
  if (!result || result.rowCount === 0) {
    throw new Error(errorMessages.noVisitorsFound);
  }
  return generalMessages.deletedAllVisitors;
}

async function viewLastVisitor() {
  const result = await pool.query(queries.viewLastVisitor);
  if (result.rows.length === 0) {
    throw new Error(errorMessages.noVisitorsFound);
  }
  return result.rows[0].id;
}

module.exports = {
  addNewVisitor,
  listAllVisitors,
  deleteVisitor,
  updateVisitor,
  viewVisitor,
  deleteAllVisitors,
  viewLastVisitor,
  createTable,
};
