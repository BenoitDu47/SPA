//  tableau des produits à acheter
const cart = [];
// total actuel des produits dans le panier
let total = 0;

let buttonaddToCart = "";

let categorySmartPhone = [
  { id: 1, name: "S8", brand: "Samsung", price: 200, quantite: 9 },
  { id: 2, name: "S9", brand: "Samsung", price: 250, quantite: 2 },
  { id: 3, name: "iPhone 10", brand: "Apple", price: 500, quantite: 5 },
];

let categoryTablet = [
  { id: 4, name: "Galaxy Tab S8", brand: "Samsung", price: 400, quantite: 10 },
  {
    id: 5,
    name: "Galaxy Tab S9",
    brand: "Samsung",
    price: 350,
    quantite: 5000,
  },
  {
    id: 6,
    name: "iPad Pro 6e génération 12",
    brand: "Apple",
    price: 900,
    quantite: 3,
  },
];

let categoryPc = [
  { id: 7, name: "PC1", brand: "Dell", price: 600, quantite: 8 },
  { id: 8, name: "PC2", brand: "HP", price: 800, quantite: 6589 },
  { id: 9, name: "PC3", brand: "Asus", price: 1000, quantite: 1 },
];

function loadProducts(category) {
  let products;
  let productsId;
  if (category === "categorySmartPhone") {
    products = categorySmartPhone;
  } else if (category === "categoryTablet") {
    products = categoryTablet;
  } else {
    products = categoryPc;
  }
  let count = 0;
  let html = "<tr>";
  for (let i = 0; i < products.length; i++) {
    count++;
    if (products[i].quantite >= 1) {
      buttonaddToCart =
        "<button type='button' class='btn btn-primary' onclick='addToCart(" +
        products[i].id +
        ")'><i class='bi bi-basket2-fill'></i>Ajouter un article<span id='product-status-" +
        products[i].id +
        "'></span></button>";
    } else {
      buttonaddToCart =
        "<div class='text-danger'>Le produit est en rupture de stock.</div>";
    }

    html +=
      "<td>" +
      count +
      "</td>" +
      "<td>" +
      products[i].name +
      "</td>" +
      "<td>" +
      products[i].brand +
      "</td>" +
      "<td>" +
      products[i].price +
      "</td>" +
      "<td>" +
      buttonaddToCart +
      "</td>";
    html += "</tr>";
    console.log(products[i].quantite);
  }

  document.getElementById("product-list").innerHTML = html;
  // Afficher la fiche de la liste des produits
  document.getElementById("product-list-card").style.display = "block";
}

let idSeclet;
let result = categorySmartPhone.find((article) => article.id === 2);

function addToCart(id) {
    let products = categorySmartPhone.concat(categoryTablet, categoryPc);
    let product = products.find((article) => article.id === id);
    if (product) {
      if (product.quantite > 0) {
        cart.push(product);
        total += product.price;
        product.quantite -= 1; // Décrémente la quantité du produit de 1
        
        // Mise à jour de la quantité dans le tableau de catégories
        let category;
        if (categorySmartPhone.find((article) => article.id === id)) {
          category = categorySmartPhone;
        } else if (categoryTablet.find((article) => article.id === id)) {
          category = categoryTablet;
        } else {
          category = categoryPc;
        }
        let productIndex = category.findIndex((article) => article.id === id);
        category[productIndex].quantite -= 1;
        
        console.log("Produit ajouté au panier: ", product);
        console.log("Panier:", cart);
        console.log("Total:", total);
  
        // Mettre à jour le contenu du span avec le message "Le produit est en rupture de stock." lorsque la quantité du produit est épuisée
        if (product.quantite === 0) {
          document.getElementById("product-status-" + product.id).innerHTML =
            "<div class='text-danger'>Le produit est en rupture de stock.</div>";
        }
      } else {
        console.log("Le produit est en rupture de stock.");
        document.getElementById("product-status-" + product.id).innerHTML =
          "<div class='text-danger'>Le produit est en rupture de stock.</div>";
      }
    }
    document.getElementById("cart-contents").style.display = "block";
    viewCart();
  }

function viewCart() {
  let html =
    "<tr><th >Nom</th><th>Marque</th><th>Quantité</th><th>Prix</th></tr>";
  let cartItems = {}; // Utiliser un objet pour regrouper les produits identiques
  for (let i = 0; i < cart.length; i++) {
    let productId = cart[i].id;
    if (cartItems.hasOwnProperty(productId)) {
      // Si le produit est déjà dans cartItems, incrémenter la quantité
      cartItems[productId].quantite++;
    } else {
      // Sinon, ajouter le produit à cartItems
      cartItems[productId] = {
        product: cart[i],
        quantite: 1,
      };
    }
  }

  // Parcourir les produits regroupés dans cartItems pour générer les lignes du tableau
  for (let productId in cartItems) {
    let product = cartItems[productId].product;
    let quantite = cartItems[productId].quantite;
    html +=
      "<tr><td>" +
      product.name +
      "</td>" +
      "<td>" +
      product.brand +
      "</td>" +
      "<td>" +
      quantite +
      "</td>" +
      "<td>" +
      product.price +
      "</td>" +
      "<td><button type='button' class='btn btn-danger' onclick='removeFromCart(" +
      productId +
      ")'>Supprimer</button></td>" +
      "</tr></tbody>";
  }
  html +=
    "<tfoot><td colspan='3'>Total:</td><td>" +
    total +
    "</td>" +
    "<td><button type='button' id='buyButton' class='btn btn-success'>Acheter</button></td>" +
    "</tfoot>";
  document.getElementById("cart-contents-list").innerHTML = html;
  // La addEventListener() méthode attache un gestionnaire d'événements à un élément.
  document.getElementById("buyButton").addEventListener("click", buy);
}

function removeFromCart(id) {
    let productIndex = -1;
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].id === id) {
        productIndex = i;
        break;
      }
    }
  
    if (productIndex !== -1) {
      let product = cart[productIndex];
      if (product.quantite > 0) {
        cart.splice(productIndex, 1); // Supprimer le produit du panier
        total -= product.price; // Soustraire le prix du produit du total
        product.quantite += 1; // Incrémenter la quantité du produit de 1
        console.log("Produit supprimé du panier: ", product);
        console.log("Panier:", cart);
        console.log("Total:", total);
      }
    }
    viewCart();
  }

function buy() {
  document.getElementById("end-form").style.display = "block";
}
