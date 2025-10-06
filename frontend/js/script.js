const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const showSignup = document.getElementById("show-signup");
const showLogin = document.getElementById("show-login");

function showSignupForm(){
    loginForm.style.display = "none";
    signupForm.style.display = "block";
}

function showLoginForm(){
    signupForm.style.display = "none";
    loginForm.style.display = "block";
}

if(showSignup){
    showSignup.addEventListener("click", showSignupForm);
}

if(showLogin){
    showLogin.addEventListener("click", showLoginForm);
}

document.addEventListener("DOMContentLoaded", () =>{
    loginForm.style.display = "block";
    signupForm.style.display = "none";
});