const visitorController = require("../src/visitor_controller");
const {
  addNewVisitor,
  listAllVisitors,
  deleteVisitor,
  updateVisitor,
  viewVisitor,
  deleteAllVisitors,
  viewLastVisitor,
  createTable,
} = visitorController;
const pool = require("../src/config_pool");
const { createResolvedPromise } = require("./test_helpers");
const {
  generalMessages,
  queries,
  errorMessages,
} = require("../src/helper_objects");

describe("Visitor Functions", () => {
  let querySpy;

  beforeEach(() => {
    querySpy = spyOn(pool, "query");
  });

  afterEach(() => {
    querySpy.calls.reset();
  });

  describe("createTable", () => {
    it("should create a new table", async () => {
      querySpy.and.returnValue(createResolvedPromise());

      const result = await createTable();

      expect(result).toEqual(generalMessages.tableCreated);
      expect(querySpy).toHaveBeenCalledOnceWith(queries.createTable);
    });
  });

  describe("addNewVisitor", () => {
    let mockVisitorData;

    beforeEach(() => {
      mockVisitorData = {
        fullName: "Ntuthuko Sokutu",
        age: 30,
        dateOfVisit: "2023-12-13",
        timeOfVisit: "02:30",
        assistantName: "Assistant Smith",
        comments: "Updated information for the visitor.",
      };
    });

    afterEach(() => {
      querySpy.calls.reset();
    });

    it("should add a new visitor", async () => {
      const mockReturnValue = { id: 1 };
      querySpy.and.returnValue(
        createResolvedPromise({ rows: [mockReturnValue] })
      );

      const result = await addNewVisitor(mockVisitorData);

      expect(result).toBe(generalMessages.newVisitorCreated);

      const expectedQuery = queries.addNewVisitor;
      const expectedValues = [
        mockVisitorData.fullName,
        mockVisitorData.age,
        mockVisitorData.dateOfVisit,
        mockVisitorData.timeOfVisit,
        mockVisitorData.assistantName,
        mockVisitorData.comments,
      ];
      expect(querySpy).toHaveBeenCalledOnceWith(expectedQuery, expectedValues);
    });

    it("should throw an error when adding a new visitor fails", async () => {
      querySpy.and.callFake(() =>
        createResolvedPromise(
          Promise.reject(
            new Error(
              errorMessages.addingVisitorError(errorMessages.databaseError)
            )
          )
        )
      );

      await expectAsync(addNewVisitor(mockVisitorData)).toBeRejectedWithError(
        errorMessages.addingVisitorError(errorMessages.databaseError)
      );
    });
  });

  describe("listAllVisitors", () => {
    it("should return a list of visitors", async () => {
      const mockVisitors = [
        { id: 1, fullName: "John Doe" },
        { id: 2, fullName: "Jane Smith" },
      ];
      querySpy.and.returnValue(createResolvedPromise({ rows: mockVisitors }));

      const result = await listAllVisitors();

      expect(result).toEqual(mockVisitors);
    });

    it("should throw an error when no visitors are found", async () => {
      querySpy.and.returnValue(createResolvedPromise({ rows: [] }));

      await expectAsync(listAllVisitors()).toBeRejectedWithError(
        errorMessages.noVisitorsFound
      );
    });
  });

  describe("deleteVisitor", () => {
    it("should delete a visitor by ID", async () => {
      const mockVisitorId = 1;
      const mockVisitorData = {
        id: mockVisitorId,
        fullName: "John Doe",
        age: 30,
        dateOfVisit: "2023-01-01",
        timeOfVisit: "10:00",
        assistantName: "Jane Smith",
        comments: "No comments",
      };

      querySpy
        .withArgs(queries.viewVisitor, [mockVisitorId])
        .and.returnValue(createResolvedPromise({ rows: [mockVisitorData] }));

      querySpy
        .withArgs(queries.deleteVisitor, [mockVisitorId])
        .and.returnValue(createResolvedPromise({ rowCount: 1 }));

      const result = await deleteVisitor(mockVisitorId);
      expect(result).toEqual({
        message: generalMessages.visitorDeleted,
        visitor: mockVisitorData,
      });

      expect(querySpy).toHaveBeenCalledWith(queries.viewVisitor, [
        mockVisitorId,
      ]);
      expect(querySpy).toHaveBeenCalledWith(queries.deleteVisitor, [
        mockVisitorId,
      ]);
    });

    it("should throw an error when deleting a visitor fails", async () => {
      const mockVisitorId = 1;

      querySpy.and.callFake(() =>
        createResolvedPromise(
          Promise.reject(
            new Error(
              errorMessages.deletingVisitorError(errorMessages.databaseError)
            )
          )
        )
      );
      await expectAsync(deleteVisitor(mockVisitorId)).toBeRejectedWithError(
        errorMessages.deletingVisitorError(errorMessages.databaseError)
      );
    });

    it("should throw an error when the ID is a string", async () => {
      const visitorId = "1";
      await expectAsync(deleteVisitor(visitorId)).toBeRejectedWithError(
        errorMessages.invalidVisitorID
      );
    });
  });

  describe("updateVisitor", () => {
    it("should update a visitor's information", async () => {
      const mockVisitorId = 1;
      const mockVisitorData = {
        column: "fullName",
        newValue: "John Doe",
      };

      querySpy.and.returnValue(
        createResolvedPromise({ rows: [{ id: mockVisitorId }] })
      );

      const result = await updateVisitor(
        mockVisitorId,
        mockVisitorData.column,
        mockVisitorData.newValue
      );

      expect(result.visitor.id).toBe(mockVisitorId);
    });

    it("should throw an error when updating a visitor fails", async () => {
      const mockVisitorId = 1;
      const mockColumn = "fullName";
      const mockNewValue = "John Updated";
      querySpy.and.callFake(() =>
        createResolvedPromise(
          Promise.reject(
            new Error(
              errorMessages.updatingVisitorError(errorMessages.databaseError)
            )
          )
        )
      );
      await expectAsync(
        updateVisitor(mockVisitorId, mockColumn, mockNewValue)
      ).toBeRejectedWithError(
        errorMessages.updatingVisitorError(errorMessages.databaseError)
      );
    });
  });

  describe("viewVisitor", () => {
    it("should view a visitor's information by ID", async () => {
      const visitorId = 1;
      const mockVisitor = {
        id: 1,
        fullName: "John Doe",
        age: 30,
        dateOfVisit: new Date(),
      };
      querySpy.and.returnValue(createResolvedPromise({ rows: [mockVisitor] }));

      const result = await viewVisitor(visitorId);

      expect(result.message).toEqual(generalMessages.visitorFound);
    });

    it("should throw an error when the visitor is not found", async () => {
      const mockVisitorId = 1;
      querySpy.and.returnValue(createResolvedPromise({ rows: [] }));

      await expectAsync(viewVisitor(mockVisitorId)).toBeRejectedWithError(
        errorMessages.visitorNotFoundError(mockVisitorId)
      );
    });

    it("should throw an error when the ID is a string", async () => {
      const visitorId = "1";
      await expectAsync(viewVisitor(visitorId)).toBeRejectedWithError(
        errorMessages.invalidVisitorID
      );
    });
  });

  describe("deleteAllVisitors", () => {
    it("should delete all visitors", async () => {
      querySpy.and.returnValue(createResolvedPromise({ rowCount: 1 }));

      const result = await deleteAllVisitors();
      expect(result).toBe(generalMessages.deletedAllVisitors);
      expect(querySpy).toHaveBeenCalledWith(queries.deleteAllVisitors);
    });

    it("should throw an error when no visitors found to delete", async () => {
      querySpy.and.returnValue(createResolvedPromise({ rowCount: 0 }));

      await expectAsync(deleteAllVisitors()).toBeRejectedWithError(
        errorMessages.noVisitorsFound
      );
    });
  });

  describe("viewLastVisitor", () => {
    it("should view the last visitor", async () => {
      const mockVisitor = {
        id: 1,
        fullName: "John Doe",
        age: 30,
        date_of_visit: new Date("2023-01-01"),
        time_of_visit: "10:00",
        assistantName: "Jane Smith",
        comments: "No comments",
      };

      querySpy.and.returnValue(createResolvedPromise({ rows: [mockVisitor] }));

      const result = await viewLastVisitor();
      expect(result).toBe(mockVisitor.id);
      expect(querySpy).toHaveBeenCalledWith(queries.viewLastVisitor);
    });

    it("should throw an error when no visitors are found", async () => {
      querySpy.and.returnValue(createResolvedPromise({ rows: [] }));

      await expectAsync(viewLastVisitor()).toBeRejectedWithError(
        errorMessages.noVisitorsFound
      );
    });
  });
});
