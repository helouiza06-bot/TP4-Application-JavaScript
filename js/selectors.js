import { state } from './state.js';

// 1. Retrouver un client par son ID (find)
export function getCustomerById(customerId) {
  return state.customers.find(c => c.id === customerId);
}

// 2. Retrouver un produit par son ID (find)
export function getProductById(productId) {
  return state.products.find(p => p.id === productId);
}

// 3. Calculer le montant d'une ligne d'article (Prix x Quantité)
export function calculateItemTotal(item) {
  const product = getProductById(item.productId);
  return product ? product.price * item.quantity : 0;
}

// 4. Calculer le montant total d'une commande (forEach ou reduce)
export function calculateOrderTotal(order) {
  let total = 0;
  order.items.forEach(item => {
    total += calculateItemTotal(item);
  });
  return total;
}

// 5. Calculer le Chiffre d'Affaires total (Somme de toutes les commandes)
export function calculateTotalRevenue() {
  let grandTotal = 0;
  state.orders.forEach(order => {
    grandTotal += calculateOrderTotal(order);
  });
  return grandTotal;
}

// 6. Filtrer les commandes (Recherche + Statut + Catégorie)
export function getFilteredOrders() {
  return state.orders.filter(order => {
    // A. Filtrer par nom de client
    const customer = getCustomerById(order.customerId);
    const customerName = customer ? customer.name.toLowerCase() : '';
    const matchesSearch = customerName.includes(state.searchCustomerName.toLowerCase());

    // B. Filtrer par Statut
    const matchesStatus = state.selectedStatus === '' || order.status === state.selectedStatus;

    // C. Filtrer par Catégorie de produit (Check si au moins un produit appartient à la catégorie)
    const matchesCategory = state.selectedCategory === '' || order.items.some(item => {
      const product = getProductById(item.productId);
      return product && product.category === state.selectedCategory;
    });

    return matchesSearch && matchesStatus && matchesCategory;
  });
}