// LOGOUT token
//store the hashed value of token for logout
// By storing token in database we can destroy token so that it can NOT
// be used again.

var cryptojs = require('crypto-js');  //module to encrypt data.

//define new model
module.exports = function(sequelize, dataTypes){
    return sequelize.define('token', {

            token: {
                 type: dataTypes.VIRTUAL,
                 allowNull: false,
                 validate: {len:[1] },
                 set: function(value){
                      var hash = cryptojs.MD5(value).toString(); //value passed in is token
                      this.setDataValue('token', value);  //value passed in is token
                      this.setDataValue('tokenHash', hash) // token after hashed
                  }

              }, //end of token:


              tokenHash: {
                    type: dataTypes.STRING  //end of tokenHash
              }

    });
};




























// EOF
