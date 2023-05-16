const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");

const { auth } = require("./middleware/auth");
const { User } = require("./models/User");

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// application/json
app.use(bodyParser.json());
app.use(cookieParser());

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

app.post("/api/users/register", async (req, res) => {
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

app.post("/api/users/login", (req, res) => {
  // 요청된 이메일을 데이터베이스에서 찾아본다.
  User.findOne({ email: req.body.email })
    .then((user) => {
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
            message: "이메일 또는 비밀번호를 확인해 주세요.",
          });
        // 비밀번호까지 맞다면 토큰을 생성한다.
        // user.generateToken((err, user) => {
        //   if (err) return res.status(400).send(err);

        //   // 토큰을 저장한다. 어디에 ? 쿠키 or 로컬스토리지 ...
        //   res
        //     .cookie("x_auth", user.token)
        //     .status(200)
        //     .json({ loginSuccess: true, userId: user._id });
        // });
        user
          .generateToken()
          .then((user) => {
            res
              .cookie("x_auth", user.token)
              .status(200)
              .json({ loginSuccess: true, userId: user._id });
          })
          .catch((err) => {
            return res.status(400).send(err);
          });
      });
    })
    .catch((err) => {
      return res.status(400).send(err);
    });
});

app.get("/api/users/auth", auth, (req, res) => {
  // 여기까지 왔다는 것은 auth미들웨어를 통과해 왔다는 것이고
  // Authentication이 true라는 뜻이다.
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

// app.get("/api/users/logout", auth, (req, res) => {
//   User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
//     if (err) return res.json({ success: false, err });
//     return res.status(200).send({ success: true });
//   });
// });

app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" })
    .then((user) => {
      res.status(200).send({ success: true });
    })
    .catch((err) => {
      return res.json({ success: false, err });
    });
});

app.get("/api/hello", (req, res) => {
  res.send("안녕하세요.");
});

const port = 5000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
