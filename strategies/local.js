const User = require('../models/user');

module.exports = function localAuth(req, res, next){
  const { username, password } = req.body;
  if(!username || !password){
    const err = new Error('Missing username or password');
    err.status = 422;
    return next(err);
  }

  let user;
  User.query().where({ username })
    .then(users => {
      user = users[0];
      if(!users.length){
        const err = new Error('Username does not exist');
        err.status = 401;
        return Promise.reject(err);
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if(!isValid){
        const err = new Error('Password is invalid');
        err.status = 401;
        return Promise.reject(err);
      }
      req.user = user.serialize();
      return next();
    })
    .catch(next);
};