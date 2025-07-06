

module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define("Task", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("To Do", "In Progress", "Done"),
      defaultValue: "To Do",
    },
  });
  Task.associate = (models) => {
    Task.belongsTo(models.User, { 
      foreignKey: "userId",
      onDelete: "CASCADE", // task will be deleted if the user is deleted
    });
  };
  return Task;
};
