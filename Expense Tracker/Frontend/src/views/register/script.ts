/* eslint-disable @typescript-eslint/no-unused-vars */
import "../../assets/scss/style.scss";
import * as bootstrap from "bootstrap";
import http from "../../service/HttpClient";
import { HttpStatusCode } from "axios";

const registerForm = document.getElementById(
  "form-register"
) as HTMLFormElement;
const validationError = document.getElementById("error-message") as HTMLElement;
const successMessage = document.getElementById(
  "success-message"
) as HTMLElement;
const usernameInput = document.getElementById(
  "register-username"
) as HTMLInputElement;
const emailInput = document.getElementById(
  "register-email"
) as HTMLInputElement;
const passwordInput = document.getElementById(
  "register-password"
) as HTMLInputElement;
const repasswordInput = document.getElementById(
  "register-repassword"
) as HTMLInputElement;

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  // Clear previous error messages
  usernameInput.classList.remove("is-invalid");
  emailInput.classList.remove("is-invalid");
  passwordInput.classList.remove("is-invalid");
  repasswordInput.classList.remove("is-invalid");
  if (!validationError.classList.contains("d-none")) {
    validationError.classList.add("d-none");
  }
  const username = usernameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;
  const repassword = repasswordInput.value;
  // Validate input
  if (
    !validateInput(
      username.trim(),
      email.trim(),
      password.trim(),
      repassword.trim()
    )
  ) {
    validationError.classList.remove("d-none");
  }
  // Submit form
  else {
    await sendPostRequest(username, email, password);
  }
});
const validateInput = (
  username: string,
  email: string,
  password: string,
  repassword: string
) => {
  if (username === "") {
    validationError.innerHTML = "Please enter your username";
    usernameInput.classList.add("is-invalid");
    return false;
  }
  if (email === "") {
    validationError.innerHTML = "Please enter your email";
    emailInput.classList.add("is-invalid");
    return false;
  }
  if (password === "") {
    validationError.innerHTML = "Please enter your password";
    passwordInput.classList.add("is-invalid");
    return false;
  }
  if (repassword === "") {
    validationError.innerHTML = "Please re-enter your password";
    repasswordInput.classList.add("is-invalid");
    return false;
  }
  if (password !== repassword) {
    validationError.innerHTML =
      "Password does not match. Please check your passwords";
    repasswordInput.classList.add("is-invalid");
    return false;
  }
  return true;
};

const sendPostRequest = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const response = await http.post("/register", {
      username,
      email,
      password,
    });

    if (response.status === HttpStatusCode.Accepted) {
      successMessage.classList.remove("d-none");
      successMessage.innerHTML = "User Registered successfully";
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response.status == HttpStatusCode.BadRequest) {
      validationError.classList.remove("d-none");
      validationError.innerHTML = error.response.data.message;
    }
  }
};
