/**
 * Created by Miguel on 11/1/2015.
 */
var bcrypt = require('bcryptjs');
var _ = require('underscore');
var cryptojs = require('crypto-js');
var jwt = require ('jsonwebtoken');


module.exports = function(sequelize, DataTypes) {

    var user = sequelize.define('user', {

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
                        var hashedPassword = bcrypt.hashSync(value, salt);
                       // console.log(hash);
                        this.setDataValue('password', value);
                        this.setDataValue('salt', salt);
                        this.setDataValue('password_hash', hashedPassword);
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


            classMethods: {
                authenticate: function(body){
                  return new Promise(function(resolve, reject){
                    //check for validation are they both strings  if not send 400
                    if (typeof body.email !== 'string' || typeof body.password !== 'string'){
                            //return response.status(400).send('Sorry, you need to enter an EMAIL and PASSWORD');
                            return reject();  //error message is wired up in calling function
                     }

                     //findOne(user where email = email passed in)
                     //db.user.findOne({ where: { email: body.email }  })
                     user.findOne({ where: { email: body.email }  })  //nodb variable to use

                     .then(function(user){
                              if (!user ) {
                                  //return response.status(401).send('No user match!');
                                  return reject();  //wired up in calling function
                              }
                              else if (!bcrypt.compareSync( body.password, user.get('password_hash') ) ) {
                                  //return response.status(401).send('Password invalid!');
                                  return reject();  //wired up in calling function
                              }

                            //response.json(user.toPublicJSON());  //call toPublicJSON so not to print salt n hash
                            resolve(user); //if successful send back user data

                      }, function (e) {
                        //response.status(500).json(e);
                        reject();
                      });

                  });

                }

            },


            instanceMethods: {

                    toPublicJSON: function(){
                        var json = this.toJSON();
                        return _.pick(json, 'id', 'email', 'updatedAt', 'createdAt');
                    },

                    generateToken: function(type){
                      if(!_.isString(type)){
                        return undefined;
                      }
                      try {
                        //we need a string as AES encrypt only can encrypt a string
                         var stringData = JSON.stringify({id: this.get('id'), type: type});
                         var encryptedData = cryptojs.AES.encrypt(stringData, 'abc123!@#!').toString();
                         var token = jwt.sign({ token: encryptedData }, 'qwerty098');

                         return token;

                      } catch(e){
                        console.error(e);
                        return undefined;
                      }
                    }
            }
        });

return user;

};
