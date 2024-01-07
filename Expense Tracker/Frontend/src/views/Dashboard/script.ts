/* eslint-disable @typescript-eslint/no-unused-vars */
import "../../assets/scss/style.scss";
import renderNavBar from "../../components/Navbar/navbar";
const navBar = document.getElementById("navbar-placeholder") as HTMLElement;
window.onload = () => {
  renderNavBar(navBar, "nav-dashboard");
};
