export function showAlert(message) {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");

    toast.classList.add("toast");
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");

    }, 10);

    setTimeout(() => {
        toast.classList.remove("show");
        toast.addEventListener("transitionend", () => {
            if (toast.parentElement) {
                toast.remove();
            }
        })
    }, 2000)

}