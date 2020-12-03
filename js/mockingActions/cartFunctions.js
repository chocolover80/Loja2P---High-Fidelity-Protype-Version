/* 
    Structure for each item:
    id;
    name;
    price;
    quantity;
    total;
*/
let listOfItems = JSON.parse(localStorage.getItem("cartItems"));
listOfItems = returnitemList();

function returnitemList() {
  if (listOfItems) return listOfItems;
  return [];
}

function findCartItemByProductData(product) {
  console.log(product);
  const jsonProduct = product;
  const [itemToReturn] = listOfItems.filter(
    (item) => item.id === jsonProduct.id
  );
  return itemToReturn
    ? {
        ...itemToReturn,
        found: true,
      }
    : {
        ...jsonProduct,
        found: false,
      };
}

function updateItemQuantity(id) {
  let itemToUpdate = {
    id: id + "",
  };
  const [itemGot] = listOfItems.filter((item) => item.id === itemToUpdate.id);
  itemToUpdate = { ...itemGot };
  itemToUpdate.quantity = parseFloat(
    document.getElementById("txtQuantity").value
  );
  (itemToUpdate.total =
    parseFloat(itemToUpdate.price) * parseFloat(itemToUpdate.quantity)),
    (listOfItems = [
      ...listOfItems.filter((item) => item.id !== itemToUpdate.id),
      itemToUpdate,
    ]);
  localStorage.setItem("cartItems", JSON.stringify(listOfItems));
  window.location.reload();
}

function removeCouponFromCart(event) {
  const couponList = JSON.parse(localStorage.getItem("listOfCoupons")) || [];
  const newList = couponList.filter((item) => item.id !== event.target.id);
  localStorage.setItem("listOfCoupons", JSON.stringify(newList));
  window.location.href = "cart.html";
}

function loadCoupons() {
  const couponDiv = $("#couponListDiv");
  const couponList = JSON.parse(localStorage.getItem("listOfCoupons")) || [];
  couponList.forEach((each) => {
    couponDiv.append(
      "<div class='col-md-3 mb-2'>    <button type='button' class='coupon-btn pl-3 pr-3'>      " +
        each.id +
        "      <span        onclick='removeCouponFromCart(event)'        id='" +
        each.id +
        "'        class='badge'        style='cursor: pointer'        >X</span      >    </button>  </div>"
    );
  });
}

function applyCoupon() {
  const couponList = JSON.parse(localStorage.getItem("listOfCoupons")) || [];
  const txtValue = document.getElementById("txtCoupon").value;
  if (txtValue && txtValue !== "") {
    const couponValue = parseFloat(txtValue.replace(/\D/g, ""));
    const couponOBJ = {
      id: txtValue,
      amount: couponValue,
    };
    let alreadyAdded = false;
    couponList.forEach((each) => {
      if (each.id === couponOBJ.id) alreadyAdded = true;
    });
    if (!alreadyAdded) {
      couponList.push(couponOBJ);
      localStorage.setItem("listOfCoupons", JSON.stringify(couponList));
      window.location.reload();
    } else {
      hideErrorAlertCart();
      showErrorAlertCart("O cupom já foi adicionado");
    }
  } else {
    hideErrorAlertCart();
    showErrorAlertCart("Cupom inválido");
  }
}

function calculatePrices() {
  const listOfCoupons = JSON.parse(localStorage.getItem("listOfCoupons"));
  const listOfItems = JSON.parse(localStorage.getItem("cartItems"));
  let discountAmount = 0;
  let itemsAmount = 0;
  let deliveryCost = 0;
  if (listOfItems) {
    listOfItems.forEach((item) => {
      itemsAmount += parseFloat(item.total);
    });
  }
  if (listOfCoupons) {
    listOfCoupons.forEach((item) => {
      discountAmount += item.amount;
    });
  }
  $("#subtotal").text("R$ " + itemsAmount.toFixed(2));
  $("#discount").text("R$ " + discountAmount.toFixed(2));
  const deliveryCostLabel = document
    .getElementById("deliveryCost")
    .innerText.replace("R$ ", "");
  if (deliveryCostLabel && deliveryCostLabel !== "A consultar") {
    deliveryCost = parseFloat(deliveryCostLabel);
    $("#totalAmount").text(
      "R$ " + (itemsAmount - discountAmount + deliveryCost)
    );
  }
}

function calculateDelivery() {
  const country = document.getElementById("cmbCountry").value;
  const state = document.getElementById("cmbState").value;
  const cep = document.getElementById("txtCEP").value;
  if (
    !country ||
    country === "" ||
    !state ||
    state === "" ||
    !cep ||
    cep === ""
  ) {
    hideErrorAlertCart();
    showErrorAlertCart("Preencha todos os campos para calcular o frete");
  } else {
    hideErrorAlertCart();
    $("#deliveryEstimative").text("10 dias úteis.");
    if (state === "RJ") $("#deliveryCost").text("R$ 25.00");
    else if (state === "SP") $("#deliveryCost").text("R$ 15.00");
    else if (state === "PR") $("#deliveryCost").text("R$ 25.00");
    calculatePrices();
    setTimeout(() => {
      scrollTo(0, 520);
    }, 100);
  }
}

function proceedToCheckout() {
  const totalAmount = document
    .getElementById("totalAmount")
    .innerText.toString();
  if (!totalAmount || totalAmount === "A CALCULAR") {
    hideErrorAlertCart();
    showErrorAlertCart("Calcule todos os valores antes de fazer o checkout");
  } else {
    hideErrorAlertCart();
    const subtotal = parseFloat(
      document.getElementById("subtotal").innerText.replace("R$ ", "")
    );
    const discount = parseFloat(
      document.getElementById("discount").innerText.replace("R$ ", "")
    );
    const deliveryCost = parseFloat(
      document.getElementById("deliveryCost").innerText.replace("R$ ", "")
    );
    const deliveryEstimative = document.getElementById("deliveryEstimative")
      .innerText;
    const valueToPay = parseFloat(
      document.getElementById("totalAmount").innerText.replace("R$ ", "")
    );
    const itemsInCart = JSON.parse(localStorage.getItem("cartItems"));
    const checkoutData = {
      subtotal: subtotal,
      discount: discount,
      deliveryCost: deliveryCost,
      deliveryEstimative: deliveryEstimative,
      valueToPay: valueToPay,
      cartItems: itemsInCart
    };
    localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
    window.location.href="checkout.html";
  }
}

function hideErrorAlertCart() {
  document.getElementById("cartErrorAlert").hidden = true;
}

function showErrorAlertCart(errorMsg) {
  $("#errorDescription").text(errorMsg);
  document.getElementById("cartErrorAlert").hidden = false;
}

function addProductToCart(product) {
  if (!product.found) {
    const itemToAdd = {
      id: product.id,
      name: product.name,
      price: product.promoPrice,
      quantity: 1,
      total: product.promoPrice,
      imgSrc: product.imgSrc,
    };
    listOfItems.push(itemToAdd);
  } else {
    const itemToUpdate = {
      ...product,
      quantity: product.quantity + 1.0,
      total: parseFloat(product.price) * (parseFloat(product.quantity) + 1.0),
      imgSrc: product.imgSrc,
    };

    listOfItems = [
      ...listOfItems.filter((item) => item.id !== itemToUpdate.id),
      itemToUpdate,
    ];

    listOfItems.forEach((each) => {
      if (each.id === itemToUpdate.id)
        each = {
          ...itemToUpdate,
        };
    });
  }
  localStorage.setItem("cartItems", JSON.stringify(listOfItems));
}

function addProductToCartViaDetails(product) {
  const plusQuantity = parseFloat(document.getElementById("txtQTYToAdd").value);
  if (!product.found) {
    const itemToAdd = {
      id: product.id,
      name: product.name,
      price: product.promoPrice,
      quantity: plusQuantity,
      total: product.promoPrice,
      imgSrc: product.imgSrc,
    };
    listOfItems.push(itemToAdd);
  } else {
    const itemToUpdate = {
      ...product,
      quantity: product.quantity + plusQuantity,
      total:
        parseFloat(product.price) *
        (parseFloat(product.quantity) + plusQuantity),
      imgSrc: product.imgSrc,
    };

    listOfItems = [
      ...listOfItems.filter((item) => item.id !== itemToUpdate.id),
      itemToUpdate,
    ];

    listOfItems.forEach((each) => {
      if (each.id === itemToUpdate.id)
        each = {
          ...itemToUpdate,
        };
    });
  }
  localStorage.setItem("cartItems", JSON.stringify(listOfItems));
}

function removeItemFromCart(productID) {
  listOfItems = listOfItems.filter((item) => item.id !== productID + "");
  localStorage.setItem("cartItems", JSON.stringify(listOfItems));
  window.location.reload();
}

function listCartItems() {
  const bodyToAppend = $("#itemsContent");
  if (!listOfItems || listOfItems.length === 0)
    bodyToAppend.append(
      "<td id='noneItemsCol' colspan='6'>Nenhum item adicionado.</td>"
    );
  else {
    $("#noneItemsCol").hide();
  }
  listOfItems.forEach((each) => {
    const newLine =
      "<tr class='text-center'>									<td class='product-remove'><a href='#' onclick='removeItemFromCart(" +
      each.id +
      ")'><span class='ion-ios-close'></span></a></td>									<td class='image-prod'>										<div class='img' style='background-image: url(" +
      each.imgSrc +
      ");'></div>									</td>									<td class='product-name'>										<h3>" +
      each.name +
      "</h3>										<p>Compre agora mesmo e se torne mais um cliente satisfeito!</p>									</td>									<td class='price'>RS " +
      each.price +
      "</td>									<td class='quantity'>										<div class='input-group mb-3'>											<input type='number' min='1' onchange='updateItemQuantity(" +
      each.id +
      ")' id='txtQuantity' name='quantity'												class='quantity form-control input-number' value='" +
      each.quantity +
      "' min='1' max='100'>										</div>									</td>									<td class='total'>R$ " +
      each.total +
      "</td>								</tr>";
    bodyToAppend.append(newLine);
  });
}
