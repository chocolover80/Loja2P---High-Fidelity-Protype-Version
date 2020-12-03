function listOrders() {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  let listOfOrders = JSON.parse(localStorage.getItem("listOfOrders")) || [];

  if (loggedUser && loggedUser.role == 2) {
    listOfOrders = listOfOrders.filter(
      (item) => item.customerData.idCustomer === loggedUser.id
    );
  }
  const tableToBindOrders = $("#ordersContent");
  listOfOrders.forEach((each) => {
    const orderDate = new Date(each.orderDate);
    const day =
      orderDate.getDate() > 9
        ? orderDate.getDate() + ""
        : "0" + orderDate.getDate();
    const month =
      orderDate.getMonth() > 9
        ? orderDate.getMonth() + ""
        : "0" + orderDate.getMonth();
    tableToBindOrders.append(
      "<td>" +
        each.orderID +
        "</td>                  <td> R$ " +
        each.checkoutInfo.checkoutOBJ.valueToPay.toFixed(2) +
        "</td>                  <td>" +
        (day + "/" + month + "/" + orderDate.getFullYear()) +
        "</td>                  <td>" +
        each.orderStatus +
        "</td>                  <td>                    <a href='#' >                      <span id='" +
        each.orderID +
        "' onclick='setOrderToView(event)' class='icon ion-ios-eye' data-toggle='modal' data-target='#orderDetailsModal'></span>                    </a>                  </td>"
    );
  });
}

function setOrderToView(event) {
  const listOfOrders = JSON.parse(localStorage.getItem("listOfOrders"));
  const [orderDataToView] = listOfOrders.filter(
    (item) => item.orderID + "" === event.target.id + ""
  );
  localStorage.setItem("orderDataToView", JSON.stringify(orderDataToView));
  setModalFields(orderDataToView);
}

function authorizeOrder() {
  const authorize = confirm("Deseja autorizar o pedido?");
  if (authorize) {
    const orderToAuthorize = JSON.parse(
      localStorage.getItem("orderDataToView")
    );
    let listOfOrders = JSON.parse(localStorage.getItem("listOfOrders"));
    orderToAuthorize.orderStatus = "AUTORIZADA";
    listOfOrders = listOfOrders.filter(item => item.orderID !==orderToAuthorize.orderID)
    localStorage.setItem("orderDataToView", JSON.stringify(orderToAuthorize))
    listOfOrders.push(orderToAuthorize)
    localStorage.setItem("listOfOrders", JSON.stringify(listOfOrders))
  }
  window.location.href="orderAdm.html"
}

function setModalFields(order) {
  const validUsers = JSON.parse(localStorage.getItem("validUsers"));
  const [user] = validUsers.filter(
    (item) => item.id + "" === order.customerData.idCustomer + ""
  );
  const data = new Date(order.orderDate);
  const dia = data.getDate() > 9 ? data.getDate() + "" : "0" + data.getDate();
  const mes =
    data.getMonth() > 9 ? data.getMonth() + "" : "0" + data.getMonth();
  const ano = data.getFullYear();
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  if (loggedUser.role === 1 && order.orderStatus!=="AUTORIZADA") {
    document.getElementById("btnAuthorizeOrder").hidden = false;
  } else {
    document.getElementById("btnAuthorizeOrder").hidden = true;
  }
  $("#exampleModalLabel").text("Detalhes do pedido ("+order.orderID+")")
  $("#orderStatusToFill").text(order.orderStatus);
  $("#customerToFill").text(user.login);
  $("#orderDateToFill").text(dia + "/" + mes + "/" + ano);
  $("#discountAmountToFill").text(
    "R$ " + order.checkoutInfo.checkoutOBJ.discount.toFixed(2)
  );
  $("#deliveryCostAmountToFill").text(
    "R$ " + order.checkoutInfo.checkoutOBJ.deliveryCost.toFixed(2)
  );
  $("#totalAmountToFill").text(
    "R$ " + order.checkoutInfo.checkoutOBJ.valueToPay.toFixed(2)
  );
  $("#streetNameToFill").text(order.addressInfo.streetAddress);
  $("#cepToFill").text(order.addressInfo.cep);
  $("#cityToFill").text(order.addressInfo.city);
  $("#stateToFill").text(order.addressInfo.state);
  $("#countryToFill").text(order.addressInfo.country);
  const itemsOnOrder = order.checkoutInfo.checkoutOBJ.cartItems;
  const tableBody = $("#productTableBody");
  itemsOnOrder.forEach((each) => {
    tableBody.append(
      "<tr class='text-center'>    <td class='product-name' style='width: 0%'>      " +
        each.name +
        "    </td>    <td class='product-name' style='width: 0%'>      " +
        each.quantity +
        "    </td>    <td class='product-name' style='width: 0%'>      " +
        each.price +
        "    </td>    <td class='product-name' style='width: 0%'>" +
        each.total +
        "</td>  </tr>    "
    );
  });
  if (order.paidWithPaypal) {
    document.getElementById("paidWithCard").hidden = true;
    document.getElementById("tableCards").hidden = true;
    document.getElementById("paidWithPaypal").hidden = false;
  } else {
    document.getElementById("paidWithPaypal").hidden = true;
    const tableCardsBody = $("#tableCardsBody");
    const card = order.cardInfo;
    tableCardsBody.append(
      "<tr class='text-center'>    <td class='product-name' style='width: 0%'>      " +
        card.cardOwnerName +
        "    </td>    <td class='product-name' style='width: 0%'>      XXXX XXXX XXXX +" +
        card.cardNumber.substring(card.cardNumber.length - 4) +
        "    </td>    <td class='product-name' style='width: 0%'>      " +
        card.cardBanner +
        "    </td>    <td class='product-name' style='width: 0%'>      R$ " +
        order.checkoutInfo.checkoutOBJ.valueToPay.toFixed(2) +
        "    </td>  </tr>    "
    );
    document.getElementById("paidWithCard").hidden = false;
    document.getElementById("tableCards").hidden = false;
  }
}
