// Permet de récupérer l'id du produit contenu dans l'url
var itemUrl = window.location.href;
var url = new URL(itemUrl);
let idItem = url.searchParams.get("id");

// Fonction pour récupérer les données de l'API grace à l'ID
function getItem (){

    // J'introduis l'id du produit directement dans la requète 
    fetch("http://localhost:3000/api/products/" + idItem)
    .then(function(response){
        return response.json();
    })

    // J'exporte les données et affiche les caractéristiques du produit grace à la fonction "showItem"  
    .then(function(data){
        showItem(data);
        getProductForCart(data);
    })
    .catch(function(error){
        alert("Erreur de la requête");
    })
    
};

// Permet d'afficher les caractéristiques du produit 
function showItem(article){

    // Affichage de l'image
    let imgItem = document.createElement("img");
    document.querySelector(".item__img").appendChild(imgItem);
    imgItem.src = article.imageUrl;
    imgItem.alt = article.altTxt;

    // Affichage du nom du produit
    document.querySelector("#title").innerHTML = article.name;
    
    // Affichage du prix

    document.querySelector("#price").innerHTML = article.price;
    
    // Affichage de la description

    document.querySelector("#description").innerHTML = article.description;

    // Affichage des couleurs disponibles

    for(let color of article.colors){
        let colorOfItem = document.createElement("option");
        document.querySelector("#colors").appendChild(colorOfItem),
        colorOfItem.value = color;
        colorOfItem.innerHTML = color;
    }
};

getItem();


// Fonction pour envoyer les infos du canapé au clic sur le bouton

function getProductForCart(product){
    const addBtn = document.querySelector("#addToCart");
    const colorChoice = document.querySelector("#colors");
    const productQuantity = document.querySelector("#quantity");
    addBtn.addEventListener("click", function(){
        const myProduct = {
            Name : product.name,
            ID: product._id,
            Picture: product.imageUrl,
            PictureTxt: product.altTxt,
            Price: product.price,
            Color: colorChoice.value,
            Quantity: parseInt(productQuantity.value, 10)
        };
        
        let cartSaved = JSON.parse(localStorage.getItem("myCart"));
        if(cartSaved){
            const productControl = cartSaved.find(sofa => sofa.ID == product._id && sofa.Color == colorChoice.value)
            if(productControl){
                let finalQuantity = myProduct.Quantity + productControl.Quantity;
                productControl.Quantity = finalQuantity;
                saveCart(cartSaved)
            }
            else {
                cartSaved.push(myProduct);
                saveCart(cartSaved);
            }
        }
        else{
            cartSaved = [];
            cartSaved.push(myProduct);
            saveCart(cartSaved);
        }
    })
}



// Sauvegarde le panier dans le localStorage et sérialise la variable
function saveCart(cart){
    localStorage.setItem("myCart", JSON.stringify(cart));
}

