const express = require('express');
const router = express.Router();
const { getBootcamps, getBootcamp, createBootcamps, 
        updateBootcamps, deleteBootcamps } = require('../controllers/bootcamps')

        
router.route('/').get(getBootcamps).post(createBootcamps);
router.route('/:id').get(getBootcamp).put(updateBootcamps).delete(deleteBootcamps);

module.exports = router;