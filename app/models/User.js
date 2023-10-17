module.exports = (sequelize, Sequelize) => {
  const Users = sequelize.define(
    "users",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      digits: {
        type: Sequelize.STRING(155),
      },
      fotoUrl: {
        type: Sequelize.STRING(255),
      },
      workType: {
        type: Sequelize.STRING(100),
      },
      positionTitle: {
        type: Sequelize.STRING(100),
      },
      lat: {
        type: Sequelize.STRING(155),
      },
      lon: {
        type: Sequelize.STRING(155),
      },
      company: {
        type: Sequelize.STRING(155),
      },
      isLogin: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      dovote: {
        type: Sequelize.BOOLEAN,
      },
      dosurvey: {
        type: Sequelize.BOOLEAN,
      },
      dofeedback: {
        type: Sequelize.BOOLEAN,
      },
      fullname: {
        type: Sequelize.STRING(255),
      },
      cuurentLeave: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
    },
    { timestamps: false }
  );
  return Users;
};
