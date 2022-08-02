module.exports = function (sequelize, Sequelize) {
  const Plan = sequelize.define('Plan', {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    uuid: {
      type: Sequelize.UUID,
      notEmpty: true,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    },

    accountId: {
      type: Sequelize.BIGINT,
      notEmpty: true,
      allowNull: false,
      unqiue: true,
    },

    allowedSeats: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },

    seats: {
      type: Sequelize.INTEGER,
    },

    plan: {
      type: Sequelize.STRING,
    },

    trialStart: {
      type: Sequelize.DATE,
    },

    trialLength: {
      type: Sequelize.INTEGER,
    },

    customer: {
      type: Sequelize.STRING,
    },

    subscription: {
      type: Sequelize.STRING,
    },

    billingEmail: {
      type: Sequelize.STRING,
    },


    addressLineOne: Sequelize.STRING,
    addressLineTwo: Sequelize.STRING,
    city: Sequelize.STRING,
    region: Sequelize.STRING,
    postalCode: Sequelize.STRING,

    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
    deletedAt: Sequelize.DATE,
  }, {
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ['accountId'],
      },
    ],
  });

  Plan.cleanAttributes = [
    'uuid',
    'seats',
    'allowedSeats',
    'plan',

    'addressLineOne',
    'addressLineTwo',
    'city',
    'region',
    'postalCode',
  ];

  return Plan;
};

