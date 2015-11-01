/**
 * Created by Miguel on 11/1/2015.
 */


module.exports = function(sequelize, DataTypes) {

    return sequelize.define('user', {

            email: {
                type: DataTypes.STRING,   //use DataTypes when being called by sequelize.import
                allowNull: false,
                unique: true, //no other record with same value in database
                validate: {	isEmail: true }
            },

            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {len: [7, 100]}
             }

        },

        {
            hooks: {
                beforeValidate: function (user, options) {
                    if(typeof user.email === 'string'){
                        user.email = user.email.toLowerCase();
                    }

                }

            }
        });


};

