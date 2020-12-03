/*
    id;
    name;
    imgSrc;
    promoValue;
    pastValue;
    promoPrice;
*/
let listOfProducts = JSON.parse(localStorage.getItem("createdProducts"));
listOfProducts = returnProductList();

function findProductByID(productID) {
  const [productToReturn] = listOfProducts.filter(
    (product) => product.id === productID
  );
  return productToReturn;
}

function returnProductList() {
  if (listOfProducts) return listOfProducts;
  const listToSave = [
    {
      id: "1",
      name: "Kit Upgrade Ryzen 5",
      imgSrc: "images/product-1.jpg",
      highImgSrc: "images/product-1-high.jpg",
      description: "Os produtos Ryzen cresceram imensamente nos últimos anos\ncom a proposta de ser um competidor à altura aos modelos da intel\n com um preço ainda mais acessível. Vem conhecer esse monstro,\n agora no kit completo pro seu PC voar!",
      promoValue: "30%",
      pastValue: "2399.99",
      promoPrice: "1680.00",
    },
    {
      id: "2",
      name: "Sony Playstation 5",
      imgSrc: "images/product-2.jpg",
      description: "Um monstro da nova geração de consoles. Rode qualquer AAA\ncom a mais completa beleza visual e capacidade de processamento\n, com um preço muito mais acessível que a competição. Corre que ,\n tá acabando!",
      highImgSrc: "images/product-2-high.jpg",
      promoValue: "",
      pastValue: null,
      promoPrice: "5399.99",
    },
    {
      id: "3",
      name: "TV Box Beelink GT Pro",
      imgSrc: "images/product-3.jpg",
      description: "Esse pequeno monstrinho tem uma capacidade inacreditável\n, o único competidor que chega próximo à tão aclamada NVidia Shield\n, contando com funções exclusivas de igual grandeza. Um investimento\n recomendadíssimo!",
      highImgSrc: "images/product-3-high.jpg",
      promoValue: "",
      pastValue: null,
      promoPrice: "1199.99",
    },
    {
      id: "4",
      name: "Painéis LED Gamer",
      imgSrc: "images/product-4.jpg",
      description: "Se você já tem um setup monstruoso, não marque bobeira.\n A estética de um gamer não fica em segundo plano, ilumine seu quarto\n com os mais modernos LEDs RGB do mercado, mostre aos seus oponentes \n a luz!",
      highImgSrc: "images/product-4-high.jpg",
      promoValue: "10%",
      pastValue: "3200.00",
      promoPrice: "2880.00",
    },
  ];
  localStorage.setItem("createdProducts", JSON.stringify(listToSave));
  return listToSave;
}

function showDetails(pID) {
  alert("mostrando detalhes: " + pID);
}

function addProductToList() {
  try {
    const id = Math.random();
    const imgSrc = "images/mockProduct.jpg";
    const name = document.getElementById("txtProductName").value;
    const promoPrice = document.getElementById("txtPricingGroup").value;
    const productToAdd = {
      id: id,
      imgSrc: imgSrc,
      name: name,
      promoPrice: promoPrice,
    };
    listOfProducts.push(productToAdd);
    localStorage.setItem("createdProducts", JSON.stringify(listOfProducts));
  } catch (error) {
    console.log(error);
  }
}

function addToWishList(pID) {
  alert("adicionado à lista: " + pID);
}

function fillWishList() {}

function goToProductDetails(productId) {
  const [productToView] = listOfProducts.filter(
    (item) => item.id === productId + ""
  );
  localStorage.setItem("productHighlight", JSON.stringify(productToView));
  window.location.href = "product-single.html";
}

function fillProductSingleInfo() {
  const productData = JSON.parse(localStorage.getItem("productHighlight"));
  if (productData) {
    const divImage = $("#highLightProductImage");
    divImage.append(
      "<a href='"+productData.highImgSrc+"' class='image-popup'              ><img                src='"+productData.highImgSrc+"'                class='img-fluid'                alt='Colorlib Template'            /></a>");
    const productName = $("#highLightProductName");
    productName.text(productData.name)
    const productPrice = $("#highLightProductPrice");
    productPrice.append("<span> R$ "+productData.promoPrice+"</span>")
    const productDescription = $("#highLightProductDescription");
    productDescription.text(productData.description)
    const buttonToAddToCart = $("#highlightProductButtonToAddToCart");
    buttonToAddToCart.append("<a href='cart.html' onclick='addProductToCartViaDetails(findCartItemByProductData(" +
    JSON.stringify(productData) +
    "))' class='btn btn-black py-3 px-5'>Adicionar ao carrinho</a>")
    fillRelatedProducts(productData.id)
    
  }
};

function fillRelatedProducts(notToShow = "") {
  const rowProducts = $("#relatedProducts");
  listOfProducts
    .filter((item) => item.id !== notToShow)
    .forEach((product) => {
      const promoValue = product.promoValue
        ? "<span class='status'>" + product.promoValue + "</span>"
        : "";
      const pastValue =
        product.pastValue && product.pastValue !== product.promoPrice
          ? "<span class='mr-2 price-dc'>R$ " + product.pastValue + "</span>"
          : "";
      const promoPrice = product.promoPrice
        ? "<span class='price-sale'>R$ " + product.promoPrice + "</span>"
        : "";
      rowProducts.append(
        "<div class='col-md-6 col-lg-3'><div class='product'><a href='#' class='img-prod'><img class='img-fluid' src='" +
          product.imgSrc +
          "' alt='Colorlib Template'>" +
          promoValue +
          "<div class='overlay'></div></a><div class='text py-3 pb-4 px-3 text-center'><h3><a href='#'>" +
          product.name +
          "</a></h3><div class='d-flex'><div class='pricing'><p class='price'>" +
          pastValue +
          promoPrice +
          "</p></div></div><div class='bottom-area d-flex px-3'><div class='m-auto d-flex'><a href='#' onclick='showDetails(" +
          product.id +
          ")' class='add-to-cart d-flex justify-content-center align-items-center text-center'><span><i class='ion-ios-menu'></i></span></a> <a href='cart.html' onclick='addProductToCart(findCartItemByProductData(" +
          JSON.stringify(product) +
          "))' class='buy-now d-flex justify-content-center align-items-center mx-1'><span><i class='ion-ios-cart'></i></span></a><a href='#' onclick='addToWishList(" +
          product.id +
          ")' class='heart d-flex justify-content-center align-items-center '><span><i class='ion-ios-heart'></i></span></a></div></div></div></div></div>"
      );
    });
}

function fillProduct(products = listOfProducts) {
  const rowProducts = $("#productRow");
  products.forEach((product) => {
    const promoValue = product.promoValue
      ? "<span class='status'>" + product.promoValue + "</span>"
      : "";
    const pastValue =
      product.pastValue && product.pastValue !== product.promoPrice
        ? "<span class='mr-2 price-dc'>R$ " + product.pastValue + "</span>"
        : "";
    const promoPrice = product.promoPrice
      ? "<span class='price-sale'>R$ " + product.promoPrice + "</span>"
      : "";
    rowProducts.append(
      "<div onclick='goToProductDetails(" +
        product.id +
        ")' class='col-md-6 col-lg-3'><div class='product'><a href='#' class='img-prod'><img class='img-fluid' src='" +
        product.imgSrc +
        "' alt='Colorlib Template'>" +
        promoValue +
        "<div class='overlay'></div></a><div class='text py-3 pb-4 px-3 text-center'><h3><a href='#'>" +
        product.name +
        "</a></h3><div class='d-flex'><div class='pricing'><p class='price'>" +
        pastValue +
        promoPrice +
        "</p></div></div><div class='bottom-area d-flex px-3'><div class='m-auto d-flex'><a href='#' onclick='showDetails(" +
        product.id +
        ")' class='add-to-cart d-flex justify-content-center align-items-center text-center'><span><i class='ion-ios-menu'></i></span></a> <a href='cart.html' onclick='addProductToCart(findCartItemByProductData(" +
        JSON.stringify(product) +
        "))' class='buy-now d-flex justify-content-center align-items-center mx-1'><span><i class='ion-ios-cart'></i></span></a><a href='#' onclick='addToWishList(" +
        product.id +
        ")' class='heart d-flex justify-content-center align-items-center '><span><i class='ion-ios-heart'></i></span></a></div></div></div></div></div>"
    );
  });
}
