import * as bootstrap from "bootstrap";
let currentToast: bootstrap.Toast;
function showToast(
  message: string,
  placeHolder: HTMLElement,
  type: "success" | "warning" | "error"
) {
  if (currentToast) {
    currentToast.hide();
  }

  const toastElement = document.createElement("div");
  const toast = new bootstrap.Toast(toastElement);
  currentToast = toast;
  toastElement.classList.add(
    "toast",
    "align-items-center",
    `text-bg-${type === "error" ? "danger" : type}`,
    "border-0",
    "position-fixed",
    "end-0",
    "bottom-0",
    "m-4",
    "p-2"
  );
  toastElement.setAttribute("role", "alert");
  toastElement.setAttribute("aria-live", "assertive");
  toastElement.setAttribute("aria-atomic", "true");

  const bodyContainer = document.createElement("div");
  bodyContainer.classList.add("d-flex");

  const toastBody = document.createElement("div");
  toastBody.classList.add("toast-body");
  toastBody.textContent = message;

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.classList.add("btn-close", "btn-close-white", "me-2", "m-auto");
  closeButton.setAttribute("data-dismiss", "toast");
  closeButton.setAttribute("aria-label", "Close");
  closeButton.addEventListener("click", () => toast.hide());
  bodyContainer.appendChild(toastBody);
  bodyContainer.appendChild(closeButton);

  toastElement.appendChild(bodyContainer);
  placeHolder.appendChild(toastElement);

  toast.show();
}

export { showToast };
