const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const { User } = require("./models/User");

const config = require("./config/key");

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// application/json
app.use(bodyParser.json());

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {
    // mongoose 6.0이상일 경우 아래의 코드가 필요없음
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/register", async (req, res) => {
  // 회원가입시 필요한 정보를 client에서 가져오면
  // 이를 데이터베이스에 넣어주어야 함.
  const user = new User(req.body);

  // legacy 코드
  // user.save((err, userInfo) => {
  //   if (err) return res.json({ success: false, err });
  //   return res.status(200).json({
  //     success: true,
  //   });
  // });

  const result = await user
    .save()
    .then(() => {
      res.status(200).json({
        success: true,
      });
    })
    .catch((err) => {
      res.json({ success: false, err });
    });
});

app.post("/login", (req, res) => {
  // 요청된 이메일을 데이터베이스에서 찾아본다.
  User.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "해당 이메일에 일치하는 유저가 없습니다.",
      });
    }
    // 요청한 이메일이 있다면 비밀번호가 맞는지 확인한다.
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "이메일이나 비밀번호를 다시 한 번 확인해 주세요.",
        });
      // 비밀번호까지 맞다면 토큰을 생성한다.
      user.generateToken((err, user) => {});
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
