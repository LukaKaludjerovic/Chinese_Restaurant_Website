let users = [
    {
        name: "Luka", 
        email: "luka@gmail.com", 
        username: "luka", 
        password: "luka1234"
    }, 
    {
        name: "Anja", 
        email: "anja@gmail.com", 
        username: "anja", 
        password: "anja1234"
    }
]

function contact(){
    alert("Poruka uspešno poslata.");
}

function login(){
    let username = document.getElementById("username_login").value;
    let password = document.getElementById("password_login").value;
    let loggedin = false;

    for(let i = 0; i < users.length; i++){
        if(users[i].username == username && users[i].password == password){
            sessionStorage.setItem("username", username);
            sessionStorage.setItem("name", users[i].name);
            loggedin = true;
            break;
        }
    }
    if(!loggedin){
        alert("Pogrešni kredencijali!");
    }
    else{
        if(localStorage.getItem(`cart-${username}`) == null){
            localStorage.setItem(`cart-${username}`, JSON.stringify([]));
        }
        cart = JSON.parse(localStorage.getItem(`cart-${username}`));

        if(localStorage.getItem(`order-${username}`) == null){
            localStorage.setItem(`order-${username}`, JSON.stringify([]));
        }
        cart = JSON.parse(localStorage.getItem(`order-${username}`));
        window.location.href = "index-sr.html";
    }
}

function register(){
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let repeat_password = document.getElementById("repeat_password").value;

    if(password != repeat_password){
        alert("Lozinke se ne poklapaju!");
        return;
    }

    for(let i = 0; i < users.length; i++){
        if(users[i].email == email || users[i].username == username){
            alert("Nalog već postoji!");
            return;
        }
    }

    users.push({name: name, email: email, username: username, password: password});
    localStorage.setItem("users", JSON.stringify(users));

    console.log("User registered successfully. Redirecting to home page...");
    window.location.href = "index-sr.html";
}

document.addEventListener("DOMContentLoaded", function(){
    if(localStorage.getItem("users") == null){
        localStorage.setItem("users", JSON.stringify(users));
    }
    users = JSON.parse(localStorage.getItem("users"));

    loadAccountButton();
    loadLogoutButton();

    if(document.title == "Korpa & Profil - Kung Fu Panda"){
        loadCart();
        loadOrders();
    }
})

function loadAccountButton(){
    let a = document.createElement("a");
    a.className = "book-a-table-btn scrollto d-none d-lg-flex";
    
    if(sessionStorage.getItem("username") != null){
        a.innerText = sessionStorage.getItem("name");
        a.href = "account-logged-sr.html";
    }
    else{
        a.innerText = "Log in";
        a.href = "account-sr.html";
    }
    document.getElementById("navbar").appendChild(a);
}

function loadLogoutButton(){
    if(sessionStorage.getItem("username") == null){
        return;
    }

    let a = document.createElement("a");
    a.className = "book-a-table-btn scrollto d-none d-lg-flex";
    a.innerText = "Log out";
    a.href = "index-sr.html";
    document.getElementById("navbar").appendChild(a);
    a.addEventListener("click", function(){
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("name");
    })
}

function addToCart(meal) {
    if(sessionStorage.getItem("username") == null){
        alert("Morate biti ulogovani kako biste dodali jelo u korpu!");
        return;
    }
    let quantity = document.getElementById(`quantity-${meal}`).value;
    let size = document.getElementById(`size-${meal}`).value;
    let price = document.getElementById(`price-${size}-${meal}`).innerText;

    //alert("Meal: " + meal + " | Quantity: " + quantity + " | Size: " + size + " | Price: " + price);
    let username = sessionStorage.getItem("username");
    let cart = JSON.parse(localStorage.getItem(`cart-${username}`));
    cart.push({
        "meal": meal, 
        "quantity": quantity, 
        "size": size, 
        "price": price, 
        "lang": "srb"
    });
    localStorage.setItem(`cart-${username}`, JSON.stringify(cart));
    alert('Dodato u korpu!');
}

function formatString(str){
    let words = str.split('-');
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    return words.join(' ');
}

function loadCart(){
    let username = sessionStorage.getItem("username");
    let cart = JSON.parse(localStorage.getItem(`cart-${username}`));

    let price = 0;

    let div = document.getElementById('cart');
    let count = 0;
    cart.forEach(item => {
        if(item.lang == "srb"){
            count++;
        }
    })
    if(count == 0){
        div.innerHTML += 'Korpa je prazna :(';
        return;
    }
    cart.forEach(item => {
        if(`${item.lang}` == "srb"){
            div.innerHTML += `Jelo: &emsp;${formatString(item.meal)}`;
            div.innerHTML += '<br>';
            div.innerHTML += `Količina: &emsp;${item.quantity}`;
            div.innerHTML += '<br>';
            div.innerHTML += `Veličina: &emsp;${formatString(item.size)}`;
            div.innerHTML += '<br>';
            div.innerHTML += `Cena: &emsp;${item.price}`;
            div.innerHTML += '<br>';
            div.innerHTML += '<hr>';

            price += parseFloat(`${item.price}`.replace('RSD', ''));
        }
    })
    div.innerHTML += `Ukupna cena: &emsp;RSD${price}`;
    div.innerHTML += '<br><br>';
    div.innerHTML += `<button onclick="order(${price})">Poruči</button>`;
}

function loadOrders(){
    let username = sessionStorage.getItem("username");
    let orders = JSON.parse(localStorage.getItem(`order-${username}`));

    let div = document.getElementById('previous-orders');
    let total_spent = 0;
    orders.forEach(item => {
        if(`${item.lang}` == 'srb'){
            div.innerHTML += `Vreme: &emsp;${item.time}`;
            div.innerHTML += '<br>';
            div.innerHTML += `Cena: &emsp;RSD${item.price}`;
            div.innerHTML += '<br>';
            div.innerHTML += '<hr>';

            total_spent += parseFloat(`${item.price}`);
        }
    })
    div.innerHTML += `Ukupno potrošeno: &emsp;RSD${total_spent}`;
}

function order(price){
    let username = sessionStorage.getItem("username");
    localStorage.setItem(`cart-${username}`, JSON.stringify([]));
    let orders = JSON.parse(localStorage.getItem(`order-${username}`));

    orders.push({
        "time": new Date(), 
        "price": price, 
        "lang": "srb"
    });
    localStorage.setItem(`order-${username}`, JSON.stringify(orders));
    location.reload(true);
}