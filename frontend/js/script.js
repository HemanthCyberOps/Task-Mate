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

function validateSignUpForm(){
    const password = document.getElementById("signup-password").value;
    const confirm_password = document.getElementById("signup-confirm-password").value;

    if(password !== confirm_password){
        alert("Password does not match!")
        return false;
    }

    if(password.length < 6){
        alert("Password must be at least 6 characters!")
        return false;
    }

    return true;
}

function validateLoginForm(){
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    if(!email){
        alert("Please enter your email!");
        return false;
    }

    if(!password){
        alert("Please Enter your password!");
        return false;
    }

    return true;

}