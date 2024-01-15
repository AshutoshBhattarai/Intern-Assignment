/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */
import { HttpStatusCode } from "axios";
import "../../assets/scss/style.scss";
import User from "../../interfaces/User";
import createPostRequest from "../../service/PostRequest";

/* -------------------------------------------------------------------------- */
/*                          Getting elements from DOM                         */
/* -------------------------------------------------------------------------- */
// Register form
const registerForm = document.getElementById(
  "form-register"
) as HTMLFormElement;
// Error message container
const validationError = document.getElementById("error-message") as HTMLElement;
// Success message container
const successMessage = document.getElementById(
  "success-message"
) as HTMLElement;
// Username input
const usernameInput = document.getElementById(
  "register-username"
) as HTMLInputElement;
// Email input
const emailInput = document.getElementById(
  "register-email"
) as HTMLInputElement;
// Password input
const passwordInput = document.getElementById(
  "register-password"
) as HTMLInputElement;
// Repeat password input
const repasswordInput = document.getElementById(
  "register-repassword"
) as HTMLInputElement;

// Register form submit handler
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  // Clear previous error messages
  usernameInput.classList.remove("is-invalid");
  emailInput.classList.remove("is-invalid");
  passwordInput.classList.remove("is-invalid");
  repasswordInput.classList.remove("is-invalid");
  // Remove previous error message
  if (!validationError.classList.contains("d-none")) {
    validationError.classList.add("d-none");
  }
  // Get data from form inputs
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
    // Show error message
    validationError.classList.remove("d-none");
  }
  // Submit form
  else {
    const user: User = { username, email, password };
    await sendPostRequest(user);
  }
});

// Validate input
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

const sendPostRequest = async (user: User) => {
  try {
    const response = await createPostRequest("/register", user);
    // if response is ok then show success message
    if (response.status === HttpStatusCode.Accepted) {
      successMessage.classList.remove("d-none");
      successMessage.innerHTML = "User Registered successfully";
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // if response is not ok then show error message
    // validation error, email already exists etc.
    if (error.response.status == HttpStatusCode.BadRequest) {
      validationError.classList.remove("d-none");
      validationError.innerHTML = error.response.data.message;
    }
  }
};
