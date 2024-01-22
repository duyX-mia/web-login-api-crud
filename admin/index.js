$(function(){
    $('#header').load("./header.html");
    $('#content').load("./content.html");
    checkLogin();
});

const checkLogin = () => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
        window.location.href = "../login.html";
    }
}

setTimeout(() => {
    const signOutBtn = document.getElementById("signOutBtn");
    signOutBtn.addEventListener("click", () => {
        localStorage.removeItem("userInfo");
        window.location.href = "../login.html";
    })
},500);