import express from 'express';
import {
  startTrip,
  updateTrip,
  endTrip,
  getTripHistory,
  getTripDetails,
  addTripNotes,
  filterTripHistory,
} from '../controllers/tripController.js';

const router = express.Router();

router.post('/start', startTrip);

router.put('/:tripId/update', updateTrip);

router.post('/end', endTrip);

router.post('/:tripId/notes', addTripNotes);

router.get('/history/:userId', getTripHistory);

router.get('/history/filter/:userId', filterTripHistory);

router.get('/:tripId', getTripDetails);

export default router;
