const EventsModel = (sequelize, Sequelize) => {
    const EventsSchema = sequelize.define('Events', {
      Id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      Name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Location: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      StartDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      EndDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      FilePath: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      IsActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      IsDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    });
    return EventsSchema;
  };
  module.exports = EventsModel;
  