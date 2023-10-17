module.exports = (sequelize, Sequelize) => {
  const Survey = sequelize.define(
    "attack",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      sourceCountry: {
        type: Sequelize.STRING(20),
      },
      destinationCountry: {
        type: Sequelize.STRING(20),
      },
      millisecond: {
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.STRING(20),
      },
      weight: {
        type: Sequelize.INTEGER,
      },
      attackTime: {
        type: Sequelize.DATE,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    },
    { timestamps: false }
  );
  return Survey;
};
