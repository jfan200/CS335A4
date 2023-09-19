//global variables
let encode = "";




//Pages setting
function showDefault() {
    document.getElementById("Home").style.display = "none";
    document.getElementById("Guest_Book").style.display = "none";
    document.getElementById("Shop").style.display = "none";
    document.getElementById("User_Registration").style.display = "none";
    document.getElementById("Login").style.display = "none";
    document.getElementById("Event").style.display = "none";
    document.getElementById("Learning").style.display = "none";
    document.getElementById("version").style.display = "none";
    getVersion();
}

function showHome() {
    showDefault();
    document.getElementById("Home").style.display = "block";
    document.getElementById("version").style.display = "block";
}

function showGuest() {
    showDefault();
    document.getElementById("Guest_Book").style.display = "block";
    document.getElementById("username_content").value = "";
    document.getElementById("user_content").value = "";
    GetComments();
}

function showShop(){
    showDefault();
    document.getElementById("Shop").style.display = "block";
    getAllProducts();
}

function showRegister() {
    showDefault();
    document.getElementById("User_Registration").style.display = "block";
}

function showLogin() {
    showDefault();
    document.getElementById("Login").style.display = "block";
}

function showEvent() {
    showDefault();
    document.getElementById("Event").style.display = "block";
    getAllEvents();
}

function showLearning() {
    showDefault();
    document.getElementById("Learning").style.display = "block";
    getQuiz();
}

function showUser(){
    showDefault();
    document.getElementById("User_Registration").style.display = "block";
}



//Get Version
function getVersion(){
    fetch("https://cws.auckland.ac.nz/ako/api/Version")
        .then((response) => response.text())
        .then((data) => document.getElementById("version").innerHTML = data);
}


//Comments
function GetComments(){
    fetch("https://cws.auckland.ac.nz/ako/api/Comments")
        .then((response) => response.text())
        .then( (data) => document.getElementById("Comments").innerHTML = data);
}


function CommentSubmit() {
    const name = document.getElementById("username_content").value;
    const comment = document.getElementById("user_content").value;
    if (name == "" || comment == "") {
        document.getElementById("openPopup").click();
        document.getElementById("popup_content").innerHTML = "<h3>Please enter you username and comment before you submit the comment! Thanks!"
    } else {
        const Comment = {'comment': comment, "name": name}
        fetch("https://cws.auckland.ac.nz/ako/api/Comment\n", {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(Comment)
        });
        document.getElementById("openPopup").click();
        document.getElementById("popup_content").innerHTML = "<h3>You have successfully submitted a comment!</h3>"
    }
    showGuest();
    GetComments();
    GetComments();
}



//Shop page
function getAllProducts() {
    fetch( "https://cws.auckland.ac.nz/ako/api/AllItems")
        .then( (response) => response.json())
        .then( (data) => showProducts(data))
}



function showProducts(products) {
    let htmlStr = "";

    function showProduct(product){
        htmlStr += `
                 <div class="product-card">
                    <img src="https://cws.auckland.ac.nz/ako/api/ItemImage/${product.id}" alt="Product ${product.id}">
                    <h3 id="${product.id}name">Name: ${product.name}</h3>
                    <p> Item ID: ${product.id}</p>
                    <p> ${product.description}</p>
                    <span>$${product.price}</span><br>
                    <button type="button" onclick="PurchaseItem( '${product.id}');" > Purchase item </button>
                </div>
`
        document.getElementById("product_table").innerHTML = htmlStr;
    }
    products.forEach( (product) => showProduct(product));
}


//Product Search
function ProductSearch() {
    const search_content = document.getElementById("mySearch").value;
    if (search_content == "") {
        getAllProducts();
    } else {
        fetch( `https://cws.auckland.ac.nz/ako/api/Items/${search_content}`)
            .then( (response) => response.json())
            .then( (data) => showProducts(data))
    }

}




//Purchase
const PurchaseItem = (id) => {
    if (encode != "") {
        const feedback = fetch(`https://cws.auckland.ac.nz/ako/api/PurchaseItem/${id}$`)
            .then((response) => response.status.toString());
        feedback.then((data) => {
            const productName = document.getElementById(`${id}name`).innerText.split(":")[1];
            document.getElementById("openPopup").click();
            document.getElementById("popup_content").innerHTML = `<h3>You have purchased a(an) ${productName}</h3>`;
        });
    } else if (encode == "") {
        showLogin();
    }
}




//User Register
function UserRegister() {
    const UserName = document.getElementById("UserNameInput").value;
    const UserPassword = document.getElementById("UserPasswordInput").value;
    const UserAddress = document.getElementById("AddressInput").value;
    const user = {'userName': UserName, 'password': UserPassword, 'address': UserAddress};
    if (UserName != "" && UserPassword != ""){
        const feedback = fetch("https://cws.auckland.ac.nz/ako/api/Register", {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(user)
        }).then((response) => response.text());

        feedback.then((data) => {
            document.getElementById("openPopup").click();
            document.getElementById("popup_content").innerHTML = `<h3>${data}</h3>`;
        });
    } else {
        document.getElementById("openPopup").click();
        document.getElementById("popup_content").innerHTML = "<h3>Please fill the username and password!</h3>";
    }

    document.getElementById("UserNameInput").value = "";
    document.getElementById("UserPasswordInput").value = "";
    document.getElementById("AddressInput").value = "";
}



//Login
const UserLogin = () => {
    const UserName = document.getElementById("LoginNameInput").value;
    const UserPassword = document.getElementById("LoginPasswordInput").value;
    encode = btoa(`${UserName}:${UserPassword}`);
    const fetchPromise = fetch("https://cws.auckland.ac.nz/ako/api/TestAuth",{
        headers:{
            "Authorization": "Basic " + encode,
        }
    });
    fetchPromise.then( (response) => response.text()).then((data) => check(data));


    const check = (data) => {
        if(data == ""){
            document.getElementById("openPopup").click();
            document.getElementById("popup_content").innerHTML = "<h3>Your username or password is incorrect!</h3>";
            encode = "";
        } else {
            document.getElementById("logout_button").style.display = "block";
            document.getElementById("login_button").style.display = "none";
            document.getElementById("register_button").style.display = "none";
            document.getElementById("user_status").innerText = `User: ${UserName}`

            document.getElementById("openPopup").click();
            document.getElementById("popup_content").innerHTML = `<h3>Hello ${UserName}, Welcome to our website of ${data}</h3>`;
            showHome();
        }
        document.getElementById("LoginNameInput").value = "";
        document.getElementById("LoginPasswordInput").value = "";
    }
}


//User Logout
function UserLogout() {
    document.getElementById("logout_button").style.display = "none";
    document.getElementById("login_button").style.display = "block";
    document.getElementById("register_button").style.display = "block";
    document.getElementById("user_status").innerText = "";

    document.getElementById("openPopup").click();
    document.getElementById("popup_content").innerHTML = `<h3>You have successfully logout!</h3>`;

    encode = "";
}




//Event page
function getAllEvents() {
    fetch( "https://cws.auckland.ac.nz/ako/api/EventCount")
    .then( (response) => response.text())
    .then( (count) => {
        let htmlStr = "";
        for (let i = 0; i < count; i++){
            fetch(`https://cws.auckland.ac.nz/ako/api/Event/${i}`,{
                headers: {"content-type": "text/calendar"}, method: "Get",
            }).then(res => res.text()).then( (data) => {
                let event_content = data.split("\n")
                htmlStr += `
                <div class="product-card" style="text-align: left">
                    <h3>${event_content[9]}</h3>
                    <h4>${event_content[10]}</h4>
                    <p>Start time: ${event_content[6].split(':')[1]}</p>
                    <p>End time: ${event_content[7].split(':')[1]}</p>
                    <p>Location: ${event_content[11].split(':')[1]}</p>
                    <a href="https://cws.auckland.ac.nz/ako/api/Event/${i}"><p>Download Event</p></a>
                </div>`
                document.getElementById("events_table").innerHTML = htmlStr;
            })
        }
    })
}


//Learning
function getQuiz() {
    document.getElementById("closePopup").click();
    fetch("https://cws.auckland.ac.nz/ako/api/MatchingPair")
        .then(res => res.json())
        .then(data => {
            let answer = getRandomInt(0, data["pairs"].split("|").length)
            if (data["type"] == "string:string") {
                let pairs = data["pairs"].split("|");
                let question = pairs[answer].split("@")
                document.getElementById("Question:").innerText = question[0]

                let options = '';
                for (let i in pairs){
                    let content = pairs[i].split("@")
                    options += `<button onclick="check('${question[0]}', '${content[0]}')" id="${content[0]}">${content[1]}</button>`
                }
                document.getElementById("Options").innerHTML = options
            }

            else if(data["type"] == "image:string"){
                let pairs = data["pairs"].split("|");
                let question = pairs[answer].split("@")
                document.getElementById("Question:").innerHTML = `<img src="${question[0]}"></img>`

                let options = '';
                for (let i in pairs){
                    let content = pairs[i].split("@")
                    options += `<button onclick="check('${question[1]}', '${content[1]}')">${content[1]}</button>`
                }
                document.getElementById("Options").innerHTML = options;
            }

            else if (data["type"] == "string:image"){
                let pairs = data["pairs"].split("|")
                let question = pairs[answer].split("@")
                document.getElementById("Question:").innerText = question[0]

                let options = '';
                for (let i in pairs){
                    let content = pairs[i].split("@")
                    options += `<img onclick="check('${question[0]}', '${content[0]}')" src="${content[1]}"></img>`
                }
                document.getElementById("Options").innerHTML = options
            }else {
                console.log(data)
            }
        })
}

//Random question
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


function check(question, answer) {
    if (answer == question){
        document.getElementById("openPopup").click();
        document.getElementById("popup_content").innerHTML = `<h3>Correct answer!</h3>`;
    } else {
        document.getElementById("openPopup").click();
        document.getElementById("popup_content").innerHTML = `<h3>Wrong answer!</h3>`;
    }
}





















//pop up window
document.addEventListener("DOMContentLoaded", function () {
    const openButton = document.getElementById("openPopup");
    const closeButton = document.getElementById("closePopup");
    const popup = document.getElementById("popup");

    openButton.addEventListener("click", function () {
        popup.style.display = "block";
    });

    closeButton.addEventListener("click", function () {
        popup.style.display = "none";
    });
});












