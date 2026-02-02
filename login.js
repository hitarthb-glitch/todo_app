document.addEventListener("DOMContentLoaded",()=>{

    const allUsersData = {
    "hitarth": [
        { task: "Learn HTML", completed: true },
        { task: "Learn CSS", completed: false }
    ],
    "mukul": [
        { task: "Go grocery shopping", completed: false }
    ]
    };


    const form = document.getElementById('login-form');

    form.addEventListener('submit',function(event) {

        event.preventDefault();

        const formData= { 
            userName:document.getElementById('name').value.trim(),
            userPassword:document.getElementById('password').value.trim()
        };
        
        localStorage.setItem('userCredentials', JSON.stringify(formData));

        if (allUsersData[formData.userName]) {
            console.log(allUsersData[formData.userName]);
        }
        }
    )


});