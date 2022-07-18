const roundCheck = document.getElementById('round');
const oneWay = document.getElementById('oneway');

const box = document.getElementById('return-date');
const returnDate = document.getElementById('return');

roundCheck.addEventListener('click', function handleClick() {

    if (roundCheck.checked) {
        box.style.visibility = 'visible';
        returnDate.required = 'true';
    } else {
        box.style.visibility = 'hidden';
        returnDate.required = 'false';

    }
});


oneWay.addEventListener('click', function handleClick() {

    if (roundCheck.checked) {
        box.style.visibility = 'visible';
        returnDate.required = 'true';

    } else {
        box.style.visibility = 'hidden';
        returnDate.required = 'false';

    }
});


function saveForm(divClass, thisElement) {
    let formInput = document.querySelectorAll(`#${divClass} input`);
    let formSelect = document.querySelector(`#${divClass} select`);
    let formOptions = document.querySelectorAll(`#${divClass} option`);
    let flag = true;
    for (let i = 0; i < formInput.length; i++) {
        if (!formInput[i].value) {
            flag = false;
            break;
        }
    }


    if (flag) {
        formOptions.forEach(option => {
            if (option.value !== formSelect.value) {
                option.disabled = true;
            }
        })

        for (let i = 0; i < formInput.length; i++) {
            formInput[i].readOnly = true;
        }
        thisElement.onclick = function () {
            editForm(divClass, thisElement);
        };
        thisElement.innerText = "Edit";
        return;
    }
    alert("Please fill all input fields");

}

function editForm(divClass, thisElement) {
    let formInput = document.querySelectorAll(`#${divClass} input`);
    let formOptions = document.querySelectorAll(`#${divClass} option`);

    formOptions.forEach(option => {
        option.disabled = false;
    })

    for (let i = 0; i < formInput.length; i++) {
        formInput[i].readOnly = false;
    }
    thisElement.onclick = function () {
        saveForm(divClass, thisElement);
    };
    thisElement.innerText = "Save";
}


function saveLastPax(passengersSearch) {
    localStorage.setItem("lastPaxSelect", passengersSearch);
}


function validateForm() {
    let formAll = document.querySelector("#form-all-data");
    let allInput = document.querySelectorAll("#form-all-data input, #form-all-data select");
    for (let i = 0; i < allInput.length; i++) {
        if (!allInput[i][`value`]) {
            return false;
        }
    }
    return true;
}


function sendForm(id, pax) {
    console.log(validateForm())
    if (!validateForm()) {
        alert("Please fill full form");
        return;
    }
    let paxData = getData();
    const bookingData = {}
    bookingData.paxData = paxData;
    bookingData.flightId = id;
    bookingData.paxQuantity = pax;

    axios.post('/home/payment', bookingData)
        .then(function (response) {
            console.log(response);
            window.location = "/home/payment/" + id + "-" + pax
        })
        .catch(function (error) {
            console.log(error);
        });


}


function getData() {

    let formsData = document.querySelectorAll(".form-data");
    let data = {}
    let fileds = ["contact", "adult", "child", "infant"];
    fileds.forEach(filed => {
        data[filed] = [];
    })

    formsData.forEach(formData => {
        // console.log(formData.id);
        // console.log(formData.className);
        let inputs = document.querySelectorAll(`#${formData.id} input, #${formData.id} select`);
        fileds.forEach(filed => {
            if (formData.className.includes(filed)) {
                let pax = {};
                inputs.forEach(input => {
                    // console.log(input.name + ":" + input.value)
                    pax[`${input.name}`] = input.value;
                })
                data[filed].push(pax);
            }
        })

    });

    return data
}
// let form = document.getElementById("form-submit")
// form.addEventListener("submit", function(evt) {
//     evt.preventDefault();
//     window.history.back();
// }, true);
//
// function sendToForm() {
//     alert("Hello")
//     let form = document.getElementById("form-submit")
//     form.addEventListener("submit", function(evt) {
//         evt.preventDefault();
//         window.history.back();
//     }, true);
//
// }

