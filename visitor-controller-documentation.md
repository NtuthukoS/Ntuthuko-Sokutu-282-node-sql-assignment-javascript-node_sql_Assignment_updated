# Visitor Controller Documentation

## Create A Table

This function creates a table if it doesn't already exist.

To manually create a table use the code below:

```javascript
createTable()
  .then(message => console.log(message))
  .catch(error => console.error(error));
```



## Add New Visitor

This query adds a new visitor to the "Visitors" table with the provided information such as full name, age, date and time of visit, the staff member who assisted them, and any comments.

### Example of good data :
```javascript
const newVisitorData = {
  fullName: 'John Doe',       // Format: First Name Last Name (e.g., John Doe)
  age: 30,                    // Format: Integer
  dateOfVisit: '2024-05-06',  // Format: YYYY-MM-DD
  timeOfVisit: '12:00',    // Format: HH:MM (24 Hours)
  assistantName: 'Jane Smith',// Format: First Name Last Name (e.g., Jane Smith)
  comments: 'Regular visitor' // Format: Text
};
```

### To add a visitor to the database use the code below :
```javascript
addNewVisitor(newVisitorData)
  .then(response => console.log(response))
  .catch(error => console.error(error.message));
```
## List All Visitors

This query retrieves a list of all visitors from the "Visitors" table, returning their full names and IDs.

### To list all visitors in database use the code below :
```javascript
listAllVisitors()
  .then(visitors => console.log(visitors))
  .catch(error => console.error(error.message));
  ```

### Delete Visitor Query
This query deletes a visitor from the "Visitors" table based on their ID.

### To delete a visitor from the database, use the following code:

```javascript
visitorController.deleteVisitor(visitorIdToDelete)
  .then(response => console.log(response))
  .catch(error => console.error(error.message));
  ```

### Update Visitor Query
This query updates information about a visitor in the "Visitors" table, such as their age, date and time of visit, the staff member who assisted them, or any comments.

### To update a visitors information in the database use the code below :

```javascript
//Example Usage
const visitorIdToUpdate = 1; // Replace with the actual ID of the visitor
const columnToUpdate = 'age'; // Column to be updated
const newValue = 35; // New value for the specified column

```
```javascript
updateVisitor(visitorIdToUpdate, columnToUpdate, newValue)
  .then(response => console.log(response))
  .catch(error => console.error(error.message));
```

### View Visitor Query
This query retrieves all information about a specific visitor from the "Visitors" table based on their ID.

### To retrieve a visitor in the database use the code below :

```javascript
viewVisitor(visitorIdToView)
  .then(response => console.log(response))
  .catch(error => console.error(error.message));
```

### Delete All Visitors Query
This query deletes all visitors from the "Visitors" table, effectively clearing the table.

### To delete all visitors from the database use the code below :

```javascript
deleteAllVisitors()
  .then(response => console.log(response))
  .catch(error => console.error(error.message));
```

### View Last Visitor Query
This query retrieves the ID of the last visitor added to the "Visitors" table.

### To viewe the last visitor added to the database use the code below :
```javascript
viewLastVisitor()
  .then(response => console.log(response))
  .catch(error => console.error(error.message));
```

**Note:** Except for the primary key id, all other fields in the "Visitors" table do not accept null values.

These descriptions provide a quick overview of what each query does within the context of the Visitor Management System, along with information on whether each field accepts null values.
