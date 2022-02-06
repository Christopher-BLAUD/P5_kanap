const myCart = JSON.parse(localStorage.getItem("myCart"));

// Fonction permettant d'afficher tous les élements du panier contenu dans le localStorage

function getCart(){
    let cart = JSON.parse(localStorage.getItem("myCart"));
    for(let i in cart){
    document.querySelector("#cart__items").innerHTML += showCart(cart[i]);
    }
}

function showCart(product){
    return `<article class="cart__item" data-id="${product.ID}" data-color="${product.Color}">
    <div class="cart__item__img">
      <img src="${product.Picture}" alt="${product.PictureTxt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${product.Name}</h2>
        <p>${product.Color}</p>
        <p>${product.Price} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.Quantity}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
  </article>`
}

getCart();
 
// Gestion Bouton "Supprimer"

const deleteBtn = document.querySelectorAll(".deleteItem");

// Pour itérer sur tous les boutons supprimés. A la selection dans le DOM, le résultat est rendu sous forme d'un array
for(let b = 0; b < deleteBtn.length; b++){
  deleteBtn[b].addEventListener("click", function(event){
    let removeProductId = myCart[b].ID;
    let removeProductColor = myCart[b].Color

    // Ici filter() sert a garder uniquement les produits qui n'ont pas été sélectionnés 
    const myNewCart = myCart.filter(element => element.ID !== removeProductId || element.Color !== removeProductColor);

    localStorage.setItem("myCart", JSON.stringify(myNewCart));

    alert("Ce produit a bien été supprimé du panier");

    location.reload();
  })
}


// Affiche le nombre total de produit dans le panier (en tenant compte de la quantité de chacun)



let totalQuantity = 0;

for(let p in myCart){
  totalQuantity += myCart[p].Quantity;
}

document.querySelector("#totalQuantity").innerHTML = totalQuantity;



// Affiche le prix total



let totalPrice = 0;

for(let k in myCart){
  totalPrice += (myCart[k].Price * myCart[k].Quantity);
}

document.querySelector("#totalPrice").innerHTML = totalPrice;

// Modifier la quantité directement dans le panier 

function changeQuantity() {
  const quantitySelecter = document.querySelectorAll(".itemQuantity");

  for (let p = 0; p < quantitySelecter.length; p++){
      quantitySelecter[p].addEventListener("change" , function(event){
 
          const oldQuantity = myCart[p].Quantity;
          const quantityChanged = quantitySelecter[p].valueAsNumber;
          
          const quantityControl = myCart.find(element => element.quantityChanged !== oldQuantity);
        if(quantityChanged >= 1){
          quantityControl.Quantity = quantityChanged;
          myCart[p].Quantity = quantityControl.Quantity;
        }
        else{
          myCart.filter(element => element.Quantity >= 1)
        }
          localStorage.setItem("myCart", JSON.stringify(myCart));
      
          location.reload();
      })
  }
}

changeQuantity();


//  Controle des informations user


const submitBtn = document.querySelector("#order");
const firstName = document.querySelector("#firstName");
const lastName = document.querySelector("#lastName");
const address = document.querySelector("#address");
const city = document.querySelector("#city");
const email = document.querySelector("#email");

function datasUserControl(){

 
  // Controle du prenom
  const firstNameValidation = document.querySelector("#firstNameErrorMsg");
  firstName.addEventListener("change", function(e){
    if(/^[A-Z][A-Za-z\é\è\ê\-]+$/.test(e.target.value)){
      firstNameValidation.innerHTML = "";
      disableSubmit(false);
    }
    else{
      firstNameValidation.innerHTML = "Le prénom doit commencer par une majuscule";
      disableSubmit(true);
    }
  })

  // Controle du nom

  const lastNameValidation = document.querySelector("#lastNameErrorMsg");
  lastName.addEventListener("change", function(e){
    if(/^[A-Z][A-Za-z\é\è\ê\-]+$/.test(e.target.value)){
      lastNameValidation.innerHTML = "";
      disableSubmit(false);
    }
    else{
      lastNameValidation.innerHTML = "Nom incorrect"
      disableSubmit(true);
    }
  })

  // Controle de l'adresse postale (du type "1 rue de maréchal leclerc")

  /*const addressValidation = document.querySelector("#addressErrorMsg");
  address.addEventListener("change", function(e){
    if(/^[a-zA-Z0-9\s,.'-]{3,}$/.test(e.target.value)){
      addressValidation.innerHTML = "";
      disableSubmit(false);
    }
    else{
      addressValidation.innerHTML = "Adresse incorrect"
      disableSubmit(true);
    }
  })*/

  // Controle de la ville 

  const cityValidation = document.querySelector("#cityErrorMsg");
  city.addEventListener("change", function(e){
    if(/^[a-zA-Z][A-Za-z\é\è\ê\-]+$/.test(e.target.value)){
      cityValidation.innerHTML = "";
      disableSubmit(false);
    }
    else{
      cityValidation.innerHTML = "Veuillez renseigner une ville existante"
      disableSubmit(true);
    }
  })

  // Controle de l'adresse mail

  
  const emailValidation = document.querySelector("#emailErrorMsg");
  email.addEventListener("change", function(e){
    if(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(e.target.value)){
      emailValidation.innerHTML = "";
      disableSubmit(false);
    }
    else{
      emailValidation.innerHTML = "Adresse email incorrect !"
      disableSubmit(true);
    }
  })
}


datasUserControl();

function disableSubmit(disabled) {
  if (disabled) {
    submitBtn.setAttribute("disabled", true);
  } else {
    submitBtn.removeAttribute("disabled");
  }
}




// Rassemblement des données user et du panier dans un objet pour la requête

function getUserInfo(){
  submitBtn.addEventListener("click", function(e){
    
    let productsInfo = [];

    for(let i = 0; i < myCart.length; i++){
      productsInfo.push(myCart[i].ID);
    }
    
    const userInfo = {
      contact: {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value,
      },
      products: productsInfo 
    }

      fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      body: JSON.stringify(userInfo),
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/json"
      }
    })
    .then(function(response){
      return response.json()
    })
    .then(function(data){
      // Passe le "orderId" en paramètre de l'url
      window.location.href = "confirmation.html" + `?orderId=${data.orderId}` /*+ data.orderId*/;
    })
    .catch(function(err){
      alert("Erreur lors de la requête API")
    })
    localStorage.clear();
  })
  
}
getUserInfo();
