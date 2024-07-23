import sinon from 'sinon';
import { expect } from 'chai';
import mongoose from 'mongoose';
import { mockReq, mockRes } from 'sinon-express-mock';
import User from '../models/User.js'; // Adjust path as per your project structure
import { updateRecordingsPastWeek } from '../controllers/profileController.js'; // Adjust path as per your project structure

describe('Profile Controller', () => {
  // Sinon sandbox to manage stubs
  let sandbox;

  before(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('updateRecordingsPastWeek', () => {
    it('should update recordings past week for a valid userId', async () => {
      const userId = mongoose.Types.ObjectId();
      const req = mockReq({
        params: { userId },
      });
      const res = mockRes();

      const userMock = {
        _id: userId,
        recordingsPastWeek: [1, 2, 3, 4, 5, 6, 7],
        save: sandbox.stub().resolves(),
      };

      // Stub User.findById only if it's not already stubbed
      sandbox.stub(User, 'findById').resolves(userMock);

      await updateRecordingsPastWeek(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(
        res.json.calledWith({ message: 'Recordings updated successfully' })
      ).to.be.true;
      expect(
        userMock.recordingsPastWeek[userMock.recordingsPastWeek.length - 1]
      ).to.equal(8);
    });

    it('should handle invalid userId format', async () => {
      const req = mockReq({
        params: { userId: 'invalid-id' },
      });
      const res = mockRes();

      await updateRecordingsPastWeek(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: 'Invalid userId format' })).to.be
        .true;
    });

    it('should handle user not found', async () => {
      const userId = mongoose.Types.ObjectId();
      const req = mockReq({
        params: { userId },
      });
      const res = mockRes();

      // Stub User.findById only if it's not already stubbed
      sandbox.stub(User, 'findById').resolves(null);

      await updateRecordingsPastWeek(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: `User with ID ${userId} not found` }))
        .to.be.true;
    });

    it('should handle internal server error', async () => {
      const userId = mongoose.Types.ObjectId();
      const req = mockReq({
        params: { userId },
      });
      const res = mockRes();

      const userMock = {
        _id: userId,
        recordingsPastWeek: [1, 2, 3, 4, 5, 6, 7],
        save: sandbox.stub().rejects(new Error('Database error')),
      };

      // Stub User.findById only if it's not already stubbed
      sandbox.stub(User, 'findById').resolves(userMock);

      await updateRecordingsPastWeek(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(
        res.json.calledWith({ error: 'Internal Server Error: Database error' })
      ).to.be.true;
    });
  });
});
