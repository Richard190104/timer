fetch("https://timer-backend-24n3.vercel.app/api/hello").then(res => res.json()).then(data => {
    document.querySelector(".time").innerText = data.time;
});