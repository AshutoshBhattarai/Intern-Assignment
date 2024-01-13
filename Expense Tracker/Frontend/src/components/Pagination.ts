const createPagination = (
  totalPages: number,
  currentPage: number,
  onClickCallback: (buttonClicked: string | number) => void
) => {
  const pagesToShow = 3;
  const startPage = Math.max(1, currentPage - 1);
  const endPage = Math.min(totalPages, startPage + pagesToShow - 1);

  const paginationNav = document.createElement("nav");
  paginationNav.setAttribute("aria-label", "...");

  const navList = document.createElement("ul");
  navList.classList.add("pagination");
  const previousList = document.createElement("li");
  previousList.classList.add(
    "page-item",
    currentPage === 1 ? "disabled" : "enabled"
  );

  const previousButton = document.createElement("button");
  previousButton.classList.add("page-link");
  previousButton.setAttribute("tabindex", "-1");
  previousButton.innerHTML = "<i class='fa-solid fa-angles-left'></i>";
  previousButton.onclick = () => onClickCallback("previous");

  previousList.appendChild(previousButton);
  navList.appendChild(previousList);

  for (let i = startPage; i <= endPage; i++) {
    const numList = document.createElement("li");
    numList.classList.add(
      "page-item",
      i === currentPage ? "active" : "notactive"
    );

    const numberBtn = document.createElement("button");
    numberBtn.classList.add("page-link");
    numberBtn.textContent = `${i}`;
    numberBtn.onclick = () => onClickCallback(i);

    numList.appendChild(numberBtn);
    navList.appendChild(numList);
  }
  const nextList = document.createElement("li");
  nextList.classList.add(
    "page-item",
    currentPage === totalPages ? "disabled" : "notdisabled"
  );

  const nextButton = document.createElement("button");
  nextButton.classList.add("page-link");
  nextButton.innerHTML = "<i class='fa-solid fa-angles-right'></i>";
  nextButton.onclick = () => onClickCallback("next");

  nextList.appendChild(nextButton);
  navList.appendChild(nextList);

  paginationNav.appendChild(navList);

  return paginationNav;
};
export default createPagination;
