const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.status(200).json({ success: true, msg : `show all bootcamps` })
})
router.get('/:id', (req, res) => {
    res.status(200).json({ success: true, msg : `show bootcamp ${req.params.id}` })
})
router.post('/', (req, res) => {
    res.status(200).json({ success: true, msg : `create a bootcamp` })
})
router.put('/:id', (req, res) => {
    res.status(200).json({ success: true, msg : `update bootcamp ${req.params.id}` })
})
router.delete('/:id', (req, res) => {
    res.status(200).json({ success: true, msg : `delete bootcamp ${req.params.id}` })
})

module.exports = router;