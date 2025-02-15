let nameCheck = false;
let idCheck = false;
let priceCheck = false;
let contentCheck = false;
let imageAdd = false;
let firstidCheck = false;
let product_data = [];
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
    document.querySelector(".idText").style.color = "red";
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
    document.querySelector("#preview").src = "";
    document.querySelector("#preview").style.display = "none";
    document.getElementById("imgpreviewbox").style.border = "solid 1px #ccc";
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
    product_data = JSON.parse(localStorage.getItem("data")) || [];
    let filterdData = product_data.filter(
      (x) => Number(x.productId) === Number(res.data.id)
    );
    if (filterdData.length === 0) {
      product_data.push(res.data);
      localStorage.setItem("data", JSON.stringify(product_data));
      resetForm();
      validCheck();
      formName.reset();
      dataAll();
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
    if (res.data.id === 0) {
      idText.innerHTML = "상품 코드를 입력해주세요.";
      idText.style.color = "red";
      firstidCheck = false;
      validCheck();
    } else if (id_checked.length > 0) {
      idText.innerHTML = "중복입니다. 다른 상품 코드를 입력해주세요.";
      idText.style.color = "red";
      firstidCheck = false;
      validCheck();
    } else {
      idText.innerHTML = "사용 가능한 상품 코드입니다.";
      firstidCheck = true;
      idText.style.color = "green";
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
  document.getElementById("preview").src = "";
  document.querySelector("#preview").style.display = "none";
  document.getElementById("imgpreviewbox").style.border = "solid 1px #ccc";

  // 체크 변수 초기화
  nameCheck = false;
  priceCheck = false;
  contentCheck = false;
  idCheck = false;
  imageAdd = false;
  firstidCheck = false;
}

// 하단 테이블 생성
// 테이블 th 생성
const tableWrap = document.querySelector(".mainTableWrap");
tableWrap.innerHTML = `
                  <table>        
                    <thead>
                      <tr>
                        <th>이미지</th>
                        <th>상품명</th>
                        <th>판매가</th>
                        <th>상품코드</th>
                        <th>상품상세</th>
                        <th>관리</th>
                      </tr>
                    </thead>
                    <tbody class="tablebody">
                    </tbody>
                  </table>
                  `;

// 데이터 전역변수
const dataAll = () => {
  const tablebody = document.querySelector(".tablebody");
  tablebody.innerHTML = product_data
    .map((x, i) => {
      return `
            <tr id="tr${x.productId}">
            <td class="img${x.productId} tdsize">
                <div class="imgWrap${x.productId} tbimgWrap"><img src="${x.imagePath}" alt="productimg" /></div>
                <span></span>
                </td>
              <td class="name${x.productId} tdsize">
                <div>${x.productName}</div>
                <span></span>
                </td>
              <td class="price${x.productId} tdsize">
                <div>${x.price}</div>
                <span></span>
                </td>
              <td class="content${x.productId} tdsize">
                <div>${x.productContent}</div>
                <span></span>
              </td>
              <td class="id${x.productId} tdsize">
                <div>${x.productId}</div>
                <span></span>
              </td>

              <td class="buttons">
                <button class="deletebtn${x.productId}" onclick="deleteData(${x.productId})">
                  삭제
                </button>
              </td>
            </tr>
            `;
    })
    .join("");

  resetForm();
  saveBtn.disabled = true;
};

//onload
window.onload = function () {
  const getData = JSON.parse(localStorage.getItem("data"));
  if (getData) {
    product_data.push(...getData);
  } else if (!getData) {
  }

  //테이블 생성
  dataAll();
};

const deleteData = (id) => {
  const deleteTr = document.querySelector(`#tr${id}`);
  deleteTr.remove();
  const delete_data = product_data.filter(
    (item) => Number(item.productId) !== id
  );
  product_data = delete_data;
  localStorage.setItem("data", JSON.stringify(product_data));
};

// 이미지 불러오기 버튼 클릭 시 파일 선택 창 열기
document.getElementById("uploadDiv").addEventListener("click", function () {
  document.getElementById("productImage").click();
});

// 파일 선택 시 파일명을 표시하는 이벤트 리스너 추가
document.getElementById("productImage").addEventListener("change", function () {
  const fileName =
    this.files.length > 0 ? this.files[0].name : "선택된 파일 없음";
  document.getElementById("fileName").innerText = fileName;

  const file = this.files[0];
  if (!file) return;
  const formData2 = new FormData();
  formData2.append("productImage", file);

  axios({
    method: "post",
    url: "/nowimg",
    data: formData2,
    headers: {
      "Content-type": "multipart/form-data",
    },
  }).then((res) => {
    console.log("업로드된 이미지 URL:", res.data);
    if (res.data) {
      document.getElementById("preview").style.display = "block";
      document.getElementById("imgpreviewbox").style.border = "solid 1px #ccc";
      document.getElementById("preview").src = res.data.productImage;
    }
  });
});
