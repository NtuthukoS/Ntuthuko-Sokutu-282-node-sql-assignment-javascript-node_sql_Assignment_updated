const moment = require("moment");
const { errorMessages, regexPatterns } = require("./helper_objects");

function isValidDate(dateString) {
  return moment(dateString, "YYYY-MM-DD", true).isValid();
}

function isValidAge(age) {
  return typeof age === "number" && !isNaN(age) && age >= 0;
}

function isValidDateOfVisit(dateOfVisit) {
  return (
    typeof dateOfVisit === "string" &&
    regexPatterns.dateOfVisit.test(dateOfVisit) &&
    isValidDate(dateOfVisit)
  );
}

function isValidTimeOfVisit(timeOfVisit) {
  return (
    typeof timeOfVisit === "string" &&
    regexPatterns.timeOfVisit.test(timeOfVisit)
  );
}

function isValidFullName(fullName) {
  return typeof fullName === "string" && regexPatterns.fullName.test(fullName);
}

function isValidComments(comments) {
  return typeof comments === "string" && comments.length > 1;
}

function isValidAssistantName(assistantName) {
  return (
    typeof assistantName === "string" &&
    regexPatterns.fullName.test(assistantName)
  );
}

function isValidVisitorData(visitor) {
  const { age, dateOfVisit, timeOfVisit, fullName, comments, assistantName } =
    visitor;
  return (
    isValidAge(age) &&
    isValidDateOfVisit(dateOfVisit) &&
    isValidTimeOfVisit(timeOfVisit) &&
    isValidFullName(fullName) &&
    isValidComments(comments) &&
    isValidAssistantName(assistantName)
  );
}

function validateVisitorData(visitor) {
  if (!isValidVisitorData(visitor)) {
    throw new Error(
      errorMessages.detailedErrorMessage(getValidationErrors(visitor))
    );
  }
}

function getValidationErrors(visitor) {
  const errors = [];

  if (!isValidAge(visitor.age)) {
    errors.push(errorMessages.ageError);
  }

  if (!isValidDateOfVisit(visitor.dateOfVisit)) {
    errors.push(errorMessages.dateOfVisitError);
  }

  if (!isValidTimeOfVisit(visitor.timeOfVisit)) {
    errors.push(errorMessages.timeOfVisitError);
  }

  if (!isValidFullName(visitor.fullName)) {
    errors.push(errorMessages.fullNameError);
  }

  if (!isValidComments(visitor.comments)) {
    errors.push(errorMessages.invalidCommentError);
  }

  if (!isValidAssistantName(visitor.assistantName)) {
    errors.push(errorMessages.invalidAssistantName);
  }

  return errors.join(" ");
}

function handleDatabaseError(error) {
  throw new Error(errorMessages.unexpectedDatabaseError);
}

function validateUpdateInputs(column, newValue) {
  const columns = [
    "fullName",
    "age",
    "dateOfVisit",
    "timeOfVisit",
    "assistantName",
    "comments",
  ];

  if (!columns.includes(column)) {
    throw new Error(errorMessages.invalidColumnName(column));
  }

  switch (column) {
    case columns[0]:
      if (!isValidFullName(newValue)) {
        throw new Error(errorMessages.invalidVisitorName);
      }
      break;
    case columns[1]:
      if (isNaN(newValue) || newValue < 0 || newValue > 120) {
        throw new Error(errorMessages.invalidAge);
      }
      break;
    case columns[2]:
      const extractedDate = newValue.split("T")[0];
      if (!isValidDate(newValue)) {
        throw new Error(errorMessages.invalidDate);
      }
      break;
    case columns[3]:
      if (!isValidTimeOfVisit(newValue)) {
        throw new Error(errorMessages.invalidTime);
      }
      break;
    case columns[4]:
      if (!isValidFullName(newValue)) {
        throw new Error(errorMessages.invalidAssistantName);
      }
      break;
    case columns[5]:
      if (typeof newValue !== "string") {
        throw new Error(errorMessages.invalidComments);
      }
      break;
    default:
      break;
  }
}

module.exports = {
  isValidDate,
  isValidAge,
  isValidDateOfVisit,
  isValidTimeOfVisit,
  isValidFullName,
  isValidComments,
  isValidAssistantName,
  isValidVisitorData,
  validateVisitorData,
  getValidationErrors,
  handleDatabaseError,
  validateUpdateInputs,
};
