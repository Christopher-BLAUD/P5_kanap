var idUrl = window.location.href;
var url = new URL(idUrl);
let showOrderId = url.searchParams.get("orderId");

document.querySelector("#orderId").innerHTML = showOrderId;