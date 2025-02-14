let nameCheck = false;
let idCheck = false;
let priceCheck = false;
let contentCheck = false;
let imageAdd = false;
let firstidCheck = false;

// 이름 실시간 검사
const nameonInput = () => {
  let namedataup = document.querySelector("#productName").value;
  if (namedataup.length < 1) {
    document.querySelector(".nameText").innerText = "상품명을 입력하세요.";
    nameCheck = false;
  } else {
    document.querySelector(".nameText").innerText = "";
    nameCheck = true;
  }
  validCheck();
};

// 가격 실시간 검사
const priceonInput = () => {
  let pricedataup = document.querySelector("#price").value;
  if (pricedataup.length < 1) {
    document.querySelector(".priceText").innerText = "가격을 입력하세요.";
    priceCheck = false;
  } else {
    document.querySelector(".priceText").innerText = "";
    priceCheck = true;
  }
  validCheck();
};

// 상품 상세설명 실시간 검사
const contentonInput = () => {
  let contentdataup = document.querySelector("#productContent").value;
  if (contentdataup.length < 1) {
    document.querySelector(".contentText").innerText =
      "상품의 설명을 입력하세요.";
    contentCheck = false;
  } else {
    document.querySelector(".contentText").innerText = "";
    contentCheck = true;
  }
  validCheck();
};

// ID 실시간 검사
const idonInput = () => {
  let productId = document.querySelector("#productId").value;
  if (productId.length < 1) {
    document.querySelector(".idText").innerText =
      "등록할 상품의 코드를 숫자로 입력하세요.";
    idCheck = false;
  } else {
    document.querySelector(".idText").innerText = "";
    idCheck = true;
  }
  validCheck();
};

//
const imageonChange = () => {
  let productImage = document.querySelector("#productImage").value;
  if (productImage.length < 1) {
    document.querySelector(".imageupText").innerText = "이미지를 등록하세요.";
    imageAdd = false;
  } else {
    document.querySelector(".imageupText").innerText = "";
    imageAdd = true;
  }
  validCheck();
};

// 로컬스토리지 저장
document.getElementById("saveBtn").addEventListener("click", function (event) {
  event.preventDefault();

  const formName = document.forms["formName"];
  const formData = new FormData();
  formData.append("productName", formName.productName.value);
  formData.append("price", formName.price.value);
  formData.append("productId", formName.productId.value);
  formData.append("productContent", formName.productContent.value);
  formData.append("productImage", formName.productImage.files[0]);

  // FormData 내용 로그 출력
  formData.forEach((value, key) => {
    console.log(key, value, "??");
  });

  axios({
    method: "post",
    url: "/upload/local",
    data: formData, //폼데이터를 여기로 옮긴다.
    headers: {
      "Content-type": "multipart/form-data",
    },
  }).then((res) => {
    console.log(res.data); // object로 잘 들어옴.
    // 로컬스토리지에 넣어보자.
    let product_data = JSON.parse(localStorage.getItem("data")) || [];
    let filterdData = product_data.filter(
      (x) => Number(x.productId) === Number(res.data.id)
    );
    if (filterdData.length === 0) {
      product_data.push(res.data);
      localStorage.setItem("data", JSON.stringify(product_data));
      resetForm();
      validCheck();
      formName.reset();
    }
    // 중복 체크 해준 후 로컬에 넣고 상품 등록 > 테이블 나와야 함.
    // idCheckBtn(product_data);
  });
});

// 아이디 중복 검사 버튼 클릭 시 axios 서버 확인
const productId = document.querySelector("#productId");
const idCheckBtn = document.querySelector(".idCheckBtn"); // 버튼 선택
const idText = document.querySelector(".idText");
idCheckBtn.addEventListener("click", () => {
  console.log(productId.value, "productId.value???"); // ok
  let idData = { id: productId.value };
  axios({
    method: "post",
    url: "/idcheck",
    data: idData,
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    console.log(res.data, "res.id????"); // 확인
    // 로컬스토리지에서 찾아서 검사를 해보자. 검사 해서 없으면 innerHTML로 사용 가능한 아이디+버튼 활성화, 아니면 중복되었다고 하고 버튼 X
    let local_data = JSON.parse(localStorage.getItem("data")) || [];
    let id_checked = local_data.filter(
      (x) => Number(x.productId) === Number(res.data.id)
    );
    console.log(id_checked, " ???");
    if (id_checked.length > 0) {
      idText.innerHTML = "중복입니다. 다른 상품 코드를 입력해주세요.";
      firstidCheck = false;
      validCheck();
    } else {
      idText.innerHTML = "사용 가능한 상품 코드입니다.";
      firstidCheck = true;
      validCheck();
    }
  });
});

// 유효성 검사
let saveBtn = document.querySelector("#saveBtn");
function validCheck() {
  if (
    nameCheck === true &&
    idCheck === true &&
    priceCheck === true &&
    contentCheck === true &&
    imageAdd === true &&
    firstidCheck === true
  ) {
    saveBtn.disabled = false;
  } else {
    saveBtn.disabled = true;
  }
}

// 초기화 함수
function resetForm() {
  // 텍스트 초기화
  document.querySelector(".nameText").innerText = "";
  document.querySelector(".priceText").innerText = "";
  document.querySelector(".contentText").innerText = "";
  document.querySelector(".idText").innerText = "";
  document.querySelector(".imageupText").innerText = "";

  // 체크 변수 초기화
  nameCheck = false;
  priceCheck = false;
  contentCheck = false;
  idCheck = false;
  imageAdd = false;
  firstidCheck = false;
}
