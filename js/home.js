//get the user cred and info from the sessionStorage
let UserCreds = JSON.parse(sessionStorage.getItem("user-creds"));
let UserInfo = JSON.parse(sessionStorage.getItem("user-info"));

let MsgHead = document.getElementById('msg');
let GreetHead = document.getElementById('greet');
let SignOutBtn= document.getElementById('signoutbutton');


let SignOut = ()=>{
    //remove the info and cred of the user
    sessionStorage.removeItem("user-creds");
    sessionStorage.removeItem("user-info");
    window.location.href='index.html';
}

let CheckCred = ()=>{
    if(!sessionStorage.getItem("user-creds"))
        window.location.href='index.html';
    else{
        MsgHead.innerText = `user with email "${UserCreds.email}" logged in`;
        GreetHead.innerText = `Welcome "${UserInfo.Name}" with "${UserInfo.DeviceId}" and "${UserInfo.CNP}" `;
    }
}

window.addEventListener('load',CheckCred);
SignOutBtn.addEventListener('click',SignOut);