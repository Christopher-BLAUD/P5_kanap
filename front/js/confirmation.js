// Récupère l'ID contenu dans l'URL
var idUrl = window.location.href;
var url = new URL(idUrl);
let showOrderId = url.searchParams.get("orderId");


// Affiche l'ID dans le html
document.querySelector("#orderId").innerHTML = showOrderId;