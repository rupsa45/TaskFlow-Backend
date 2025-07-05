const { Task } = require("../models");

exports.createTask = async (req, res) => {
  const { title, description, status = "To Do" } = req.body;
  if (!["To Do", "In Progress", "Done"].includes(status)) {
    return res.status(400).json({ error: "invalid status value" });
  }
  try {

    const task = await Task.create({
      title,
      description,
      status,
      userId: req.user.userId,
    });

    res.status(201).json({ message: "task created successfulyy!!", task });
  } catch (error) {
    console.log("Task creation failed", error);
    res.status(500).json({ error: "task creation failed" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.userId },
    });
    
    if(!task) return res.status(404).json({error:"task not found"});
    await task.destroy();
    res.json({message:"task deleted"});
    if (!task) return res.status(404).json({ error: "Task not found" });
  } catch (error) {
    console.log("error while deleting the task", error);
    res.status(500).json("Encountered error while deleting");
  }
};

exports.getTasks = async (req, res) => {
  const { status } = req.query;
  const where = { userId: req.user.userId };

  if (status) where.status = status;

  try {
    const tasks = await Task.findAll({ where });
    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

exports.getTaskByStatus = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.user.userId }
    });

    const grouped = {
      "To Do": [],
      "In Progress": [],
      "Done": []
    };

    tasks.forEach(task => grouped[task.status].push(task));

    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch grouped tasks' });
  }
};

exports.updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['To Do', 'In Progress', 'Done'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  try {
    const task = await Task.findOne({
      where: { id, userId: req.user.userId }
    });

    if (!task) return res.status(404).json({ error: 'Task not found' });

    task.status = status;
    await task.save();

    res.json({ message: 'Task status updated', task });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
};