import { event } from "jquery";

export default function () {
    document.getElementById('showPassword').onclick = function () {
        if (this.checked) {
            document.getElementById('password').type = "text";
        } else {
            document.getElementById('password').type = "password";
        }
    };

    const passwordElem = document.getElementById("password");
    passwordElem?.addEventListener('blur', passwordValidation);
    const passwordConfirmElem = document.getElementById("passwordConfirm");
    passwordConfirmElem?.addEventListener('blur', passwordConfirmValidation);
    const formElem = document.getElementById("testForm");
    formElem?.addEventListener('submit', formSubmitValidation);
    const usernameElem = document.getElementById("username");
    usernameElem?.addEventListener('blur', validateForm);
    const emailElem = document.getElementById("email");
    emailElem?.addEventListener('blur', validateForm);

}

function passwordValidationRegex(inputTextVal) {
    let regexPattern = /^(?=.*[-\#\$\.\%\&\@\!\+\=\\*])(?=.*[a-zA-Z])(?=.*\d).{8,16}$/;
    if (inputTextVal.match(regexPattern)) {
        return true;
    }
    else {
        return false;
    }
}

function setErrorMsj(pElem) {
    addInvalidClass(pElem);
    removeValidClass(pElem);
}

function removeErrorMsj(pElem) {
    addValidClass(pElem);
    removeInvalidClass(pElem);
}

function addValidClass(pElem) {
    if (!pElem.classList.contains("valid"))
        pElem.classList.add("valid");
}

function removeValidClass(pElem) {
    if (pElem.classList.contains("valid"))
        pElem.classList.remove("valid");
}

function addInvalidClass(pElem) {
    if (!pElem.classList.contains("invalid"))
        pElem.classList.add("invalid");
}

function removeInvalidClass(pElem) {
    if (pElem.classList.contains("invalid"))
        pElem.classList.remove("invalid");
}

function passwordValidation() {
    let pElem = document.getElementById("password");
    let passwordValue = pElem.value;
    let passwordHelpMessage = "";
    let passHelpMsjElem = document.getElementById("passwordHelpMsj");
    let minNumberofChars = 8;
    let maxNumberofChars = 16;

    if (passwordValue) {
        if (passwordValue.length < minNumberofChars || passwordValue.length > maxNumberofChars) {
            // Error
            setErrorMsj(pElem)
            passwordHelpMessage = "Password must be between 8 and 16 characters long"
        } else {
            // Sucess
            removeErrorMsj(pElem)
            if (!passwordValidationRegex(passwordValue)) {
                // Error
                setErrorMsj(pElem)
                passwordHelpMessage = "Password should contain at least one number and one special character"
            } else {
                // Sucess
                removeErrorMsj(pElem)

            }
        }
    } else {
        // Error
        setErrorMsj(pElem)
        passwordHelpMessage = "Password cannot be blank"

    }
    passHelpMsjElem?.setAttribute("data-error", passwordHelpMessage)

    validateForm();

}

function passwordConfirmValidation() {
    let pConfirmElem = document.getElementById("passwordConfirm");
    let passwordElem = document.getElementById("password");
    let passwordHelpMessage = "";
    let passwordConfirmValue = pConfirmElem.value;

    if (passwordElem.classList.contains("valid")) {
        if (passwordConfirmValue) {
            if (passwordElem.value != passwordConfirmValue) {
                // Error
                setErrorMsj(pConfirmElem)
                passwordHelpMessage = "Passwords don't match"
            } else {
                // success
                removeErrorMsj(pConfirmElem)
            }


        } else {
            // Error
            setErrorMsj(pConfirmElem)
            passwordHelpMessage = "Password Confirm cannot be blank"

        }
    } else {
        // Error
        setErrorMsj(pConfirmElem)
        passwordHelpMessage = "Your password is invalid"
    }
    let passHelpMsjElem = document.getElementById("passwordConfirmHelpMsj");
    passHelpMsjElem?.setAttribute("data-error", passwordHelpMessage)

    validateForm();
}

function validateForm() {
    let usernameElem = document.getElementById("username");
    let emailElem = document.getElementById("email");
    let confirmElem = document.getElementById("passwordConfirm");
    let passwordElem = document.getElementById("password");
    let validInformation = false;
    if (usernameElem.value && emailElem.classList.contains("valid") && passwordElem.classList.contains("valid") && confirmElem.classList.contains("valid")) {
        validInformation = true;
    }

    let submitButtonElem = document.getElementById("submitButtom");
    if (submitButtonElem.disabled) {
        if (validInformation) {
            submitButtonElem.disabled = false;
        }
    } else {
        if (!validInformation) {
            submitButtonElem.disabled = true;
        }
    }
}

function formSubmitValidation() {
    let confirmElem = document.getElementById("passwordConfirm");
    let passwordElem = document.getElementById("password");
    let sendForm = true;
    if (!passwordElem.classList.contains("valid")) {
        sendForm = false
    } else if (!confirmElem.classList.contains("valid")) {
        sendForm = false
    }

    if (!sendForm) {
        alert("Invalid information!")
    } else {
        alert("Send!")
    }

    return sendForm
}