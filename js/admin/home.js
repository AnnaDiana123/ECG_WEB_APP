import { signOut } from "../services/auth.js";

const checkCred = ()=>{
    if(!sessionStorage.getItem("user-creds"))
        window.location.href='index.html';
    else{
        const GreetHead = document.getElementById('greet');
        GreetHead.innerText = "Hello Admin! ";
    }
}

//event listener for DOMContentLoaded to ensure DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    //vheck creds from session storage
    checkCred();

    // get buttons
    const SignOutBtn= document.getElementById('signoutbutton');
    
    //add event listener to buttons
    SignOutBtn.addEventListener('click',signOut);

});