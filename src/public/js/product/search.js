console.log("This is hom page")

const roundCheck = document.getElementById('round');
const oneWay = document.getElementById('oneway');

const box = document.getElementById('return-date');
const returnDate = document.getElementById('return');

roundCheck.addEventListener('click', function handleClick() {
    console.log("This is hom page")

    if (roundCheck.checked) {
        box.style.visibility = 'visible';
        returnDate.required = 'true';
    } else {
        box.style.visibility = 'hidden';
        returnDate.required = 'false';

    }
});


oneWay.addEventListener('click', function handleClick() {
    console.log("This is hom page")

    if (roundCheck.checked) {
        box.style.visibility = 'visible';
        returnDate.required = 'true';

    } else {
        box.style.visibility = 'hidden';
        returnDate.required = 'false';

    }
});

