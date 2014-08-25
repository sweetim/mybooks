'use strict';

module.exports = function(code, msg){
	var err = new Error(msg);
	err.code = code;
	return err;
};