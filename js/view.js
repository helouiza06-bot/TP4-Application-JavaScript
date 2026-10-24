import { state } from './state.js';
import { 
  getCustomerById, 
  getProductById, 
  calculateOrderTotal, 
  calculateItemTotal, 
  calculateTotalRevenue, 
  getFilteredOrders 
} from './selectors.js';

// Rendu principal (Appelé à chaque changement)
export function render() {
  renderKPIs();
  renderOrdersTable();
}

// Mettre à jour les 4 cartes d'indicateurs
function renderKPIs() {
  document.getElementById('kpi-customers').textContent = state.customers.length;
  document.getElementById('kpi-products').textContent = state.products.length;
  document.getElementById('kpi-orders').textContent = state.orders.length;
  document.getElementById('kpi-revenue').textContent = `${calculateTotalRevenue()} MAD`;
}

// Mettre à jour le tableau des commandes
function renderOrdersTable() {
  const tbody = document.getElementById('orders-table-body');
  const filteredOrders = getFilteredOrders();

  if (filteredOrders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">Aucune commande trouvée.</td></tr>`;
    return;
  }

  tbody.innerHTML = filteredOrders.map(order => {
    const customer = getCustomerById(order.customerId);
    const total = calculateOrderTotal(order);

    // Couleur des badges Bootstrap
    let badgeClass = 'bg-secondary';
    if (order.status === 'Livree') badgeClass = 'bg-success';
    if (order.status === 'En attente') badgeClass = 'bg-warning text-dark';
    if (order.status === 'Annulee') badgeClass = 'bg-danger';

    return `
      <tr>
        <td><strong>#${order.id}</strong></td>
        <td>${customer ? customer.name : 'Inconnu'}</td>
        <td>${order.date}</td>
        <td><span class="badge ${badgeClass}">${order.status}</span></td>
        <td><strong>${total} MAD</strong></td>
        <td>
          <button class="btn btn-sm btn-outline-primary btn-detail" data-id="${order.id}">
            📄 Détails
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// Rendu du Modal (Détails d'une commande)
export function renderOrderDetailModal(orderId) {
  const order = state.orders.find(o => o.id === parseInt(orderId));
  if (!order) return;

  const customer = getCustomerById(order.customerId);
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');

  modalTitle.textContent = `Commande #${order.id} - ${customer ? customer.name : ''}`;

  const itemsHTML = order.items.map(item => {
    const product = getProductById(item.productId);
    const itemTotal = calculateItemTotal(item);
    return `
      <tr>
        <td>${product ? product.name : 'Produit inconnu'}</td>
        <td>${product ? product.price : 0} MAD</td>
        <td>${item.quantity}</td>
        <td><strong>${itemTotal} MAD</strong></td>
      </tr>
    `;
  }).join('');

  modalBody.innerHTML = `
    <div class="mb-3">
      <p class="mb-1"><strong>Client :</strong> ${customer ? customer.name : 'N/A'} (${customer ? customer.city : 'N/A'})</p>
      <p class="mb-1"><strong>Date :</strong> ${order.date}</p>
      <p class="mb-1"><strong>Statut :</strong> ${order.status}</p>
    </div>
    <h6>Produits commandés :</h6>
    <table class="table table-bordered table-sm">
      <thead class="table-light">
        <tr>
          <th>Produit</th>
          <th>Prix U.</th>
          <th>Qté</th>
          <th>Sous-total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHTML}
      </tbody>
    </table>
    <div class="text-end mt-3">
      <h4>Total : <span class="text-success">${calculateOrderTotal(order)} MAD</span></h4>
    </div>
  `;

  // Ouvrir le Modal via l'API JavaScript de Bootstrap
  const modalElement = document.getElementById('orderModal');
  const bsModal = new bootstrap.Modal(modalElement);
  bsModal.show();
}

// Affichage d'erreur en cas de problème de chargement JSON
export function renderError(message) {
  const errorDiv = document.getElementById('error-message');
  errorDiv.textContent = message;
  errorDiv.classList.remove('d-none');
}