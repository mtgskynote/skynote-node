import { expect } from "chai";
import sinon from "sinon";
import User from "../models/User.js";
import { updateRecordings } from "../utils/recordingUpdater.js";

describe("updateRecordings", () => {
  let findStub;
  let saveStub1;
  let saveStub2;

  beforeEach(() => {
    // Stub the User.find method
    findStub = sinon.stub(User, "find");

    // Create new stubs for user.save for each test
    saveStub1 = sinon.stub();
    saveStub2 = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should update recordingsPastWeek for all users", async () => {
    const mockUsers = [
      { recordingsPastWeek: [1, 1, 1, 1, 1, 1, 1], save: saveStub1.resolves() },
      { recordingsPastWeek: [0, 0, 0, 0, 0, 0, 0], save: saveStub2.resolves() },
    ];

    // Mock the return value of User.find
    findStub.resolves(mockUsers);

    await updateRecordings();

    expect(findStub.calledOnce).to.be.true;

    // Check the updated recordingsPastWeek and save call
    expect(mockUsers[0].recordingsPastWeek).to.deep.equal([
      1, 1, 1, 1, 1, 1, 0,
    ]);
    expect(saveStub1.calledOnce).to.be.true;

    expect(mockUsers[1].recordingsPastWeek).to.deep.equal([
      0, 0, 0, 0, 0, 0, 0,
    ]);
    expect(saveStub2.calledOnce).to.be.true;
  });

  it("should log an error if updating recordings fails", async () => {
    const error = new Error("Database error");
    const consoleErrorStub = sinon.stub(console, "error");

    // Mock User.find to reject
    findStub.rejects(error);

    await updateRecordings();

    expect(
      consoleErrorStub.calledWith("Error updating daily recordings:", error)
    ).to.be.true;

    consoleErrorStub.restore();
  });
});
