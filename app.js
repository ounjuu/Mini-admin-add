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

// 업로드 디렉터리가 없다면 생성 코드
const fs = require("fs");
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// set이 get 위에 와야 함
app.set("view engine", "ejs"); // ejs 파일 html로 변경해줌
app.set("views", "./views"); // ejs 파일 위치 설정
app.set("views", path.join(__dirname, "/views"));

// post 요청은 req.body
app.get("/", (req, res) => {
  res.render("admin");
});

app.post("/upload/local", upload.single("productImage"), (req, res) => {
  console.log(req.file, "파일 담겼어?");
  console.log(req.body, "전체 내용 잘 담겼니?");
  const { productName, price, productId, productContent } = req.body;
  const imagePath = req.file ? "/uploads/" + req.file.filename : null;
  res.json({ productName, price, productId, productContent, imagePath });
});

app.post("/idcheck", (req, res) => {
  const { id } = req.body;
  res.json({ id: Number(id) });
});

app.post("/nowimg", upload.single("productImage"), (req, res) => {
  console.log(req.file, "오긴 하나");
  const productImage = req.file ? "/uploads/" + req.file.filename : null;
  res.send({ productImage });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
