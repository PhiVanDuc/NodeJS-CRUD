const deletes_button = document.querySelectorAll(".button-delete");

if (deletes_button.length) {
    deletes_button.forEach((delete_button) => {
        delete_button.addEventListener("click", function() {
            const id = this.dataset.id;
            const input_id = document.querySelector(".confirm-box .input-id");
            input_id.value = id;
        })
    })
}