function hideErrorAlertCheckout() {
  document.getElementById("checkoutErrorAlert").hidden = true;
}

function showErrorAlertCheckout(errorMsg) {
  $("#errorDescription").text(errorMsg);
  document.getElementById("checkoutErrorAlert").hidden = false;
}

function calculateCheckoutValues() {
  const checkoutData = JSON.parse(localStorage.getItem("checkoutData"));
  $("#subtotal").text("R$ " + checkoutData.subtotal.toFixed(2));
  $("#deliveryEstimative").text(checkoutData.deliveryEstimative);
  $("#deliveryCost").text("R$ " + checkoutData.deliveryCost.toFixed(2));
  $("#discount").text("R$ " + checkoutData.discount.toFixed(2));
  $("#totalAmount").text("R$ " + checkoutData.valueToPay.toFixed(2));
  hideErrorAlertCheckout();
  hideCreditCardFields();
}

function hideCreditCardFields() {
  document.getElementById("divFormNewCreditCard").hidden = true;
}

function showCreditCardFields() {
  document.getElementById("divFormNewCreditCard").hidden = false;
}

function setNewDeliveryInfo(event) {
  const value = event.target.value;
  const checkoutData = JSON.parse(localStorage.getItem("checkoutData"));
  checkoutData.valueToPay += checkoutData.deliveryCost;
  if (value === "SP") {
    checkoutData.deliveryCost = 15;
  } else if (value === "RJ") {
    checkoutData.deliveryCost = 25;
  } else if (value === "PR") {
    checkoutData.deliveryCost = 25;
  }
  checkoutData.valueToPay -= checkoutData.deliveryCost;
  localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
  $("#deliveryCost").text("R$ " + checkoutData.deliveryCost.toFixed(2));
  $("#totalAmount").text("R$ " + checkoutData.valueToPay.toFixed(2));
}

function proccessCheckout() {
  const name = document.getElementById("txtName").value;
  const lastName = document.getElementById("txtLastName").value;
  const country = document.getElementById("cmbCountry").value;
  const state = document.getElementById("cmbState").value;
  const streetAddress = document.getElementById("txtStreetAddress").value;
  const complement = document.getElementById("txtComplement").value;
  const city = document.getElementById("txtCity").value;
  const cep = document.getElementById("txtCEP").value;
  const phone = document.getElementById("txtPhone").value;
  const email = document.getElementById("txtEmail").value;

  //Credit Card Properties
  const cardOwnerName = document.getElementById("txtCardOwnerName").value;
  const cardNumber = document.getElementById("txtCardNumber").value;
  const cardBanner = document.getElementById("cmbCardBanner").value;
  const cvv = document.getElementById("txtCvv").value;

  if (
    !name ||
    name === "" ||
    !lastName ||
    lastName === "" ||
    !country ||
    country === "" ||
    !state ||
    state === "" ||
    !streetAddress ||
    streetAddress === "" ||
    !complement ||
    complement === "" ||
    !city ||
    city === "" ||
    !cep ||
    cep === "" ||
    !phone ||
    phone === "" ||
    !email ||
    email === ""
  ) {
    showErrorAlertCheckout("Preencha todos os campos para finalizar a compra");
  } else if (
    !document.getElementById("divFormNewCreditCard").hidden &&
    (!cardOwnerName ||
      cardOwnerName === "" ||
      !cardNumber ||
      cardNumber === "" ||
      !cardBanner ||
      cardBanner === "" ||
      !cvv ||
      cvv === "")
  ) {
    hideErrorAlertCheckout();
    showErrorAlertCheckout(
      "Preencha todos os dados do cartão de crédito para finalizar o pedido"
    );
  } else if (!document.getElementById("termsCheckBox").checked) {
    hideErrorAlertCheckout();
    showErrorAlertCheckout("Aceite os termos para finalizar o pedido");
  } else {
    const paidWithPaypal = document.getElementById("divFormNewCreditCard")
      .hidden
      ? true
      : false;
    const listOfOrders = JSON.parse(localStorage.getItem("listOfOrders")) || [];
    const checkoutData = JSON.parse(localStorage.getItem("checkoutData"));
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"))
    const order = {
      addressInfo: {
        name: name,
        lastName: lastName,
        country: country,
        state: state,
        streetAddress: streetAddress,
        complement: complement,
        city: city,
        cep: cep,
        phone: phone,
        email: email,
      },
      cardInfo: {
        cardOwnerName: cardOwnerName,
        cardNumber: cardNumber,
        cardBanner: cardBanner,
        cvv: cvv,
      },
      paidWithPaypal: paidWithPaypal,
      checkoutInfo: {
        checkoutOBJ: checkoutData,
      },
      customerData: {
          idCustomer: loggedUser.id
      },
      orderDate: new Date(),
      orderID: "OL2P#"+(listOfOrders.length+1),
      orderStatus: "EM PROCESSAMENTO"
    };
    listOfOrders.push(order);
    alert("Pedido realizado com sucesso!");
    localStorage.setItem("listOfOrders", JSON.stringify(listOfOrders));
    hideErrorAlertCheckout();
    localStorage.removeItem("cartItems");
    localStorage.removeItem("checkoutData");
    localStorage.removeItem("listOfCoupons");
    window.location.href="order.html"
  }
}
