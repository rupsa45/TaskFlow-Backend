const express = require('express');
const router = express.Router();
const verify= require('../middlewares/auth.middleware.js')
const taskController = require('../controllers/task.controllers.js')

router.post('/tasks',verify,taskController.createTask);
router.get('/tasks/grouped', verify, taskController.getTaskByStatus);
router.put('/tasks/:id/status', verify, taskController.updateTaskStatus);
router.get('/tasks',verify,taskController.getTasks)

module.exports = router;