const express = require('express');
const router = express.Router();
const {eventsModel} = require('../models');

/** GET one events by Id */
router.get('/getEventsById/:id', (req, res) => {
  return eventsModel.getEventsById(req, res);
});

/** POST events */
router.post('/addEvents', (req, res) => {
  return eventsModel.addEvents(req, res);
});

/** PATCH events */
router.patch('/updateEvents', (req, res) => {
  return eventsModel.updateEvents(req, res);
});

/**  Get All events  */
router.get('/getAllEvents', (req, res) => {
  return eventsModel.getAllEvents(req, res);
});

/**  Delete events */
router.delete('/deleteEvents/:id', (req, res) => {
  return eventsModel.deleteEvents(req, res);
});

router.post('/deleteMultipleEvents', (req, res) => {
  return eventsModel.deleteMultipleEvents(req, res);
});

/**  Upload Documents */
router.post('/uploadDocuments/:id', (req, res) => {
  return eventsModel.uploadDocuments(req, res);
});

module.exports = router;
