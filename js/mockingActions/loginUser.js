const mockedUsers = [
  {
    id: 1,
    login: "Adm",
    email: "adm@comiccompras.com.br",
    password:
      "094ec63135685925477b74dafc35b0923f4c68645562c842c76ab43fc738237343d3dc769b95cfd9b1906499fc6fabac92a11181b5d585aa95a151df605ca062",
    role: 1,
  },
  {
    id: 2,
    login: "Cliente",
    email: "cliente@comiccompras.com.br",
    password:
      "094ec63135685925477b74dafc35b0923f4c68645562c842c76ab43fc738237343d3dc769b95cfd9b1906499fc6fabac92a11181b5d585aa95a151df605ca062",
    role: 2,
  },
];

function setListOfValidUsers() {
  localStorage.setItem("validUsers", JSON.stringify(mockedUsers));
}

function hideErrorAlert() {
  document.getElementById("loginErrorAlert").hidden = true;
}

function verifyLoggedUser() {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  if (!loggedUser) return false;
  else {
    const accessRole = document.getElementById("accessRole");
    if (accessRole && accessRole.value) {
      if (parseInt(accessRole.value) === parseInt(loggedUser.role)) return true;
      else {
        localStorage.removeItem("loggedUser");
        window.location.reload();
        return false;
      }
    } else {
      return true;
    }
  }
}

function findUserByLoginAndPassword(login = "", password = "") {
  const [user] = mockedUsers.filter(
    (item) =>
      (item.email === login || item.login === login) &&
      item.password === password
  );
  return user;
}

async function loginUser(event = undefined) {
  
  if (event) event.preventDefault();
  const login = document.getElementById("txtLogin").value;
  let password = document.getElementById("txtPassword").value;
  password = password !== "" ? await sha512(password) : "";
  const userFound = findUserByLoginAndPassword(login, password);
  if (userFound) {
    hideErrorAlert();
    window.location = "index.html";
    localStorage.setItem("loggedUser", JSON.stringify(userFound));
    setListOfValidUsers();
    return true;
  } else {
    if (login && login !== "" && password && password !== "")
      document.getElementById("loginErrorAlert").hidden = false;
    return false;
  }
}

async function sha512(str) {
  return crypto.subtle
    .digest("SHA-512", new TextEncoder("utf-8").encode(str))
    .then((buf) => {
      return Array.prototype.map
        .call(new Uint8Array(buf), (x) => ("00" + x.toString(16)).slice(-2))
        .join("");
    });
}
