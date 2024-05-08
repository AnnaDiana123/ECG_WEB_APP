//get the user cred and info from the sessionStorage
let MsgHead = document.getElementById('msg');
let GreetHead = document.getElementById('greet');
let SignOutBtn= document.getElementById('signoutbutton');


let SignOut = ()=>{
    //remove the info and cred of the user
    sessionStorage.removeItem("user-creds");
    window.location.href='index.html';
}

let CheckCred = ()=>{
    if(!sessionStorage.getItem("user-creds"))
        window.location.href='index.html';
    else{
        GreetHead.innerText = "Hello Admin! ";
    }
}

window.addEventListener('load',CheckCred);
SignOutBtn.addEventListener('click',SignOut);