const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
var jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

userSchema.pre("save", function (next) {
  let user = this;

  if (user.isModified("password")) {
    // 비밀번호를 암호화시킨다.
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  // plainPassword 1234567, 암호화된 비밀번호 서로 확인
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function () {
  let user = this;
  // jsonwebtoken이용해 token생성하기
  let token = jwt.sign(user._id.toHexString(), "secretToken");
  user.token = token;
  return user.save().then((user) => user);
};

userSchema.statics.findByToken = function (token, cb) {
  let user = this;

  // 가져온 토큰을 decode(복호화)
  jwt.verify(token, "secretToken", function (err, decoded) {
    // 유저 아이디를 이용해 유저를 찾은 후
    // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지를 확인
    user
      .findOne({ _id: decoded, token: token })
      .then((user) => {
        return cb(null, user);
      })
      .catch((err) => {
        return cb(err);
      });
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
