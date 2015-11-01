/**
 * Created by Miguel on 11/1/2015.
 */

var bcrypt = require('bcryptjs');
var _ = require('underscore');

module.exports = function(sequelize, DataTypes) {

    return sequelize.define('user', {

            email: {
                type: DataTypes.STRING,   //use DataTypes when being called by sequelize.import
                allowNull: false,
                unique: true, //no other record with same value in database
                validate: {	isEmail: true }
            },

            salt:  {
                type: DataTypes.STRING
            },

            password_hash: {
                type: DataTypes.STRING
            },

            password: {
                type: DataTypes.VIRTUAL,
                allowNull: false,
                validate: {len: [7, 100]},
                set: function (value){
                        var salt = bcrypt.genSaltSync(10);
                       // console.log(salt);
                        var hash = bcrypt.hashSync("mike32716", salt);
                       // console.log(hash);
                        this.setDataValue('password', value);
                        this.setDataValue('salt', salt);
                        this.setDataValue('password_hash', hash);
                        }
            }

        },

        {
            hooks: {
                beforeValidate: function (user, options) {
                    if(typeof user.email === 'string'){
                        user.email = user.email.toLowerCase();
                    }

                }

            },
            instanceMethods: {

                    toPublicJSON: function(){
                        var json = this.toJSON();
                        return _.pick(json, 'id', 'email', 'updatedAt', 'createdAt');
                    }
            }
        });


};

