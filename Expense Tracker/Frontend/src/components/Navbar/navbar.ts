import * as bootstrap from "bootstrap";
const renderNavBar = (placeholder: HTMLElement, active: string) => {
  fetch("../../components/Navbar/navbar.html")
    .then((response) => response.text())
    .then((data) => {
      placeholder.innerHTML = data;
      const navLinks = document.querySelectorAll(".nav-link");
      const logout = document.getElementById("btn-logout");
      const profileDropDownContainer = document.getElementById(
        "dropdown-container"
      ) as HTMLElement;
      const dropDown = new bootstrap.Dropdown(profileDropDownContainer);
      logout?.addEventListener("click", () => {
        localStorage.removeItem("jwt");
        window.location.href = "/views/login";
      });

      const profileDropDown = document.getElementById(
        "profile-dropdown"
      ) as HTMLElement;
      profileDropDown.addEventListener("click", () => {
        dropDown.show();
      });
      profileDropDown.addEventListener("mouseenter", () => {
        dropDown.show();
      });
      profileDropDown.addEventListener("mouseleave", () => {
        dropDown.hide();
      });

      for (const navLink of navLinks) {
        navLink.classList.remove("active");
      }
      const currentPage = document.getElementById(active);
      currentPage!.classList.add("active");
    });
};
export default renderNavBar;
