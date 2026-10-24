import { state } from './state.js';
import { fetchData } from './dataService.js';
import { render, renderOrderDetailModal, renderError } from './view.js';

async function init() {
  try {
    // 1. Chargement asynchrone des 3 fichiers JSON en parallèle
    const [customersData, productsData, ordersData] = await Promise.all([
      fetchData('data/customers.json'),
      fetchData('data/products.json'),
      fetchData('data/orders.json')
    ]);

    // 2. Stockage dans l'état central
    state.customers = customersData;
    state.products = productsData;
    state.orders = ordersData;

    // 3. Premier rendu de l'interface
    render();

    // 4. Initialisation des écouteurs d'événements
    setupEventListeners();

  } catch (error) {
    renderError("Une erreur est survenue lors du chargement des données. Veuillez vérifier vos fichiers JSON.");
  }
}

function setupEventListeners() {
  // Écouteur pour la barre de recherche par nom
  document.getElementById('search-customer').addEventListener('input', (e) => {
    state.searchCustomerName = e.target.value;
    render(); // Re-génère l'affichage instantanément
  });

  // Écouteur pour le filtre de statut
  document.getElementById('filter-status').addEventListener('change', (e) => {
    state.selectedStatus = e.target.value;
    render();
  });

  // Écouteur pour le filtre de catégorie
  document.getElementById('filter-category').addEventListener('change', (e) => {
    state.selectedCategory = e.target.value;
    render();
  });

  // Écouteur d'événement délégué sur le tableau pour capturer le clic sur "Détails"
  document.getElementById('orders-table-body').addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-detail')) {
      const orderId = e.target.getAttribute('data-id');
      renderOrderDetailModal(orderId);
    }
  });
}

// Lancement au chargement de la page
document.addEventListener('DOMContentLoaded', init);