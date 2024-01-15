/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */
import * as bootstrap from "bootstrap";
import UserService from "../../service/UserService";

// Render navbar in placeholder and set active class
const renderNavBar = (placeholder: HTMLElement, active: string) => {
  fetch("../../components/Navbar/navbar.html")
    .then((response) => response.text())
    .then((data) => {
      // get nav bar from html file and render it
      placeholder.innerHTML = data;
      // get all nav links
      const navLinks = document.querySelectorAll(".nav-link");
      // get logout button
      const logout = document.getElementById("btn-logout");
      // configure dropdown for navbar
      new bootstrap.Dropdown(
        document.getElementById("nav-dropdown") as HTMLElement
      );

      // configure logout button 
      logout?.addEventListener("click", async () => {
        // call logout function from UserService
        await UserService.logout();
        // redirect to login
        window.location.href = "/views/login/";
      });
      // Remove active class from all nav links
      for (const navLink of navLinks) {
        navLink.classList.remove("active");
      }
      // Add active class to current page
      const currentPage = document.getElementById(active);
      currentPage!.classList.add("active");
    });
};
export default renderNavBar;
