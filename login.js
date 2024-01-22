const BASE_URL = "https://65ae36d11dfbae409a744273.mockapi.io/users";
const username = document.getElementById("username");
const password = document.getElementById("password");
const signUpBtn = document.getElementById("signUpBtn");

const usernameSignin = document.getElementById("usernameSignin");
const passwordSignin = document.getElementById("passwordSignin");
const signInBtn = document.getElementById("signInBtn");

//đăng ký-signup
const handleSignUp = () => {
    const userInfo = {
        username: username.value,
        password: password.value,
    };
    console.log(userInfo);
    event.preventDefault();
    
    fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
    }).then((response) => {
        console.log("response", response);
        alert("Sign up successfull!");
        username.value ="";
        password.value ="";
        
    }).catch((error) => {
        console.log(error);
    });
};
//đăng nhập-signin
const handleSignIn = () => {
    const userInfo = {
        username: usernameSignin.value,
        password: passwordSignin.value,
    };
    console.log(userInfo);
    event.preventDefault();
    
    fetch(BASE_URL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((res) => {
        return res.json();
    }).then((userList) => {
        const correctUser = userList.find((user) => {
            return (
                user.username === userInfo.username &&
                user.password === userInfo.password
            );
        })
        if (correctUser) {
            alert("Log in successfull!");
            //localStorage -> move to admin page
            localStorage.setItem("userInfo", JSON.stringify(correctUser));
            window.location.href = "../admin/admin.html";
        } else {
            alert("Wrong username or password!");
        }        
    }).catch((error) => {
        console.log(error);
    });
};

signUpBtn.addEventListener("click", handleSignUp);
signInBtn.addEventListener("click", handleSignIn);