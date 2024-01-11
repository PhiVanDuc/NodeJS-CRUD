const inputs = document.querySelectorAll('input');

inputs.forEach((input) => {
    input.addEventListener("input", function(event) {
        this.value = this.value.replace(/<[^>]*>?/gm, '');
    })
})