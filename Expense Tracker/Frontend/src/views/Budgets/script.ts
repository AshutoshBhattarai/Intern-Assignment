import renderNavBar from "../../components/Navbar/navbar";
import "../../assets/scss/style.scss";
const navBar = document.getElementById("nav-placeholder") as HTMLElement;
window.onload = () => {
  renderNavBar(navBar, "nav-budgets");
};
