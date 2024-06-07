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
    alert("Message successfully sent.");
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
        alert("Wrong credentials!");
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
        window.location.href = "index.html";
    }
}

function register(){
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let repeat_password = document.getElementById("repeat_password").value;

    if(password != repeat_password){
        alert("Passwords must match!");
        return;
    }

    for(let i = 0; i < users.length; i++){
        if(users[i].email == email || users[i].username == username){
            alert("Account already exists!");
            return;
        }
    }

    users.push({name: name, email: email, username: username, password: password});
    localStorage.setItem("users", JSON.stringify(users));

    console.log("User registered successfully. Redirecting to home page...");
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", function(){
    if(localStorage.getItem("users") == null){
        localStorage.setItem("users", JSON.stringify(users));
    }
    users = JSON.parse(localStorage.getItem("users"));

    loadAccountButton();
    loadLogoutButton();

    if(document.title == "Cart & Profile - Kung Fu Panda"){
        loadCart();
        loadOrders();
    }
})

function loadAccountButton(){
    let a = document.createElement("a");
    a.className = "book-a-table-btn scrollto d-none d-lg-flex";
    
    if(sessionStorage.getItem("username") != null){
        a.innerText = sessionStorage.getItem("name");
        a.href = "account-logged.html";
    }
    else{
        a.innerText = "Log in";
        a.href = "account.html";
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
    a.href = "index.html";
    document.getElementById("navbar").appendChild(a);
    a.addEventListener("click", function(){
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("name");
    })
}

function addToCart(meal) {
    if(sessionStorage.getItem("username") == null){
        alert("You must be logged in in order to add meals to the cart!");
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
        "lang": "en"
    });
    localStorage.setItem(`cart-${username}`, JSON.stringify(cart));
    alert('Added to the cart!');
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
        if(item.lang == "en"){
            count++;
        }
    })
    if(count == 0){
        div.innerHTML += 'Cart is empty :(';
        return;
    }
    cart.forEach(item => {
        if(`${item.lang}` == "en"){
            div.innerHTML += `Meal: &emsp;${formatString(item.meal)}`;
            div.innerHTML += '<br>';
            div.innerHTML += `Quantity: &emsp;${item.quantity}`;
            div.innerHTML += '<br>';
            div.innerHTML += `Size: &emsp;${formatString(item.size)}`;
            div.innerHTML += '<br>';
            div.innerHTML += `Price: &emsp;${item.price}`;
            div.innerHTML += '<br>';
            div.innerHTML += '<hr>';

            price += parseFloat(`${item.price}`.replace('$', ''));
        }
    })
    div.innerHTML += `Total price: &emsp;$${price}`;
    div.innerHTML += '<br><br>';
    div.innerHTML += `<button onclick="order(${price})">Place an order</button>`;
}

function loadOrders(){
    let username = sessionStorage.getItem("username");
    let orders = JSON.parse(localStorage.getItem(`order-${username}`));

    let div = document.getElementById('previous-orders');
    let total_spent = 0;
    orders.forEach(item => {
        if(`${item.lang}` == 'en'){
            div.innerHTML += `Time: &emsp;${item.time}`;
            div.innerHTML += '<br>';
            div.innerHTML += `Price: &emsp;$${item.price}`;
            div.innerHTML += '<br>';
            div.innerHTML += '<hr>';

            total_spent += parseFloat(`${item.price}`);
        }
    })
    div.innerHTML += `Total spent: &emsp;$${total_spent}`;
}

function order(price){
    let username = sessionStorage.getItem("username");
    localStorage.setItem(`cart-${username}`, JSON.stringify([]));
    let orders = JSON.parse(localStorage.getItem(`order-${username}`));

    orders.push({
        "time": new Date(), 
        "price": price, 
        "lang": "en"
    });
    localStorage.setItem(`order-${username}`, JSON.stringify(orders));
    location.reload(true);
}