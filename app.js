const express = require("express");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    //원본 파일에서 확장자 추출
    const ext = path.extname(file.originalname);

    //파일명에 타임스탬프와 확장자를 포함시켜서 저장함
    cb(null, Date.now() + ext); //타임스탬프 + 확장자
  },
});
// 가져오는 것 최상단에 있어야 함. > use > get

const upload = multer({ storage: storage });

const app = express();
const port = 3000;
// body-parser
// x-www-form-urlencoded 방식, 객체 형태로 결과가 나옴
app.use(express.urlencoded({ extended: true }));
// json 형식으로 받을 것임
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// set이 get 위에 와야 함
app.set("view engine", "ejs"); // ejs 파일 html로 변경해줌
app.set("views", "./views"); // ejs 파일 위치 설정
app.set("views", path.join(__dirname, "/views"));

// post 요청은 req.body
app.get("/", (req, res) => {
  res.render("admin");
});
// app.get("/main", (req, res) => {
//   res.render("main");
// });

// app.get("/upload", (req, res) => {
//   res.render("page1");
// });

app.post("/upload/dynamic", upload.single("files"), (req, res) => {
  console.log(req.file, "파일");
  console.log(req.body, "잘 담겼니?");
  res.send({ src: req.file.path });
});

let imagePaths;
app.post("/upload/array", upload.array("userfiles"), (req, res) => {
  console.log("요청 받음");
  console.log("업로드된 파일들:", req.files);
  imagePaths = req.files.map((file) => `/uploads/${file.filename}`);
  res.send({ imagePaths });
});

app.post("/upload", upload.array("image", 5), (req, res) => {
  const imagePaths2 = req.files.map((file) => "/uploads/" + file.filename);
  res.render("check", { imagePaths2 });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
