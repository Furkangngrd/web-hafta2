/* =============================================
   BEUShareBox — Uygulama Mantığı (Vanilla JS)
   Tüm buglar fixlendi, temiz ve çalışır kod.
   ============================================= */

// ===== Sabitler =====
const STORAGE_KEY = 'beusharebox_products';

// Açık olan yorum panellerini takip et (render sonrası state kaybolmasın)
let openCommentPanels = new Set();

// ===== DOM Elemanları =====
// DOMContentLoaded içinde alınacak
let productForm, titleInput, descriptionInput, priceInput, categorySelect;
let productListEl, emptyStateEl, searchInput, filterCategorySelect;
let totalProductsEl, totalLikesEl;

// ===== Veri Yönetimi =====

/**
 * localStorage'dan ürünleri getirir
 * @returns {Array} Ürün dizisi
 */
function getProducts() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Veri okuma hatası:', e);
    return [];
  }
}

/**
 * Ürün dizisini localStorage'a kaydeder
 * @param {Array} products - Kaydedilecek ürün dizisi
 */
function saveProducts(products) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (e) {
    console.error('Veri kaydetme hatası:', e);
  }
}

/**
 * Benzersiz ID üretir
 * @returns {string} Benzersiz ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}

// ===== İstatistik Güncelleme =====

/**
 * Toplam ürün ve beğeni sayısını günceller
 */
function updateStats() {
  const products = getProducts();
  totalProductsEl.textContent = products.length;
  totalLikesEl.textContent = products.reduce(function (sum, p) { return sum + p.likes; }, 0);
}

// ===== Toast Bildirimi =====

/**
 * Ekranda kısa süreli bildirim gösterir
 * @param {string} message - Gösterilecek mesaj
 */
function showToast(message) {
  // Var olan toast'u kaldır
  var existingToast = document.querySelector('.toast');
  if (existingToast) existingToast.remove();

  var toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  // Çift requestAnimationFrame ile güvenli animasyon
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      toast.classList.add('show');
    });
  });

  // 2.5 saniye sonra kaldır
  setTimeout(function () {
    toast.classList.remove('show');
    setTimeout(function () {
      if (toast.parentNode) toast.remove();
    }, 350);
  }, 2500);
}

// ===== Tarih Formatlama =====

/**
 * ISO tarih stringini okunabilir formata çevirir
 * @param {string} dateStr - ISO tarih stringi
 * @returns {string} Formatlanmış tarih
 */
function formatDate(dateStr) {
  var date = new Date(dateStr);
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Fiyatı Türk Lirası formatında gösterir
 * @param {number} price - Fiyat değeri
 * @returns {string} Formatlanmış fiyat
 */
function formatPrice(price) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2
  }).format(price);
}

// ===== HTML Escape (XSS koruması) =====

/**
 * HTML karakterlerini escape eder
 * @param {string} str - Escape edilecek metin
 * @returns {string} Güvenli metin
 */
function escapeHTML(str) {
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ===== Form Doğrulama =====

/**
 * Bir alandaki hata mesajını temizler
 * @param {HTMLElement} field - Temizlenecek alan
 */
function clearFieldError(field) {
  field.classList.remove('invalid');
  var existingError = field.parentElement.querySelector('.error-msg');
  if (existingError) existingError.remove();
}

/**
 * Hata mesajını alan altında gösterir
 * @param {HTMLElement} field - Hata olan alan
 * @param {string} message - Hata mesajı
 */
function showFieldError(field, message) {
  field.classList.add('invalid');
  var errorEl = document.createElement('span');
  errorEl.className = 'error-msg show';
  errorEl.textContent = message;
  field.parentElement.appendChild(errorEl);
}

/**
 * Form alanlarını doğrular
 * @returns {boolean} Geçerli ise true
 */
function validateForm() {
  var isValid = true;

  // Önceki hataları temizle
  [titleInput, descriptionInput, priceInput, categorySelect].forEach(clearFieldError);

  // Başlık kontrolü
  if (!titleInput.value.trim()) {
    showFieldError(titleInput, 'Başlık zorunludur');
    isValid = false;
  }

  // Açıklama kontrolü
  if (!descriptionInput.value.trim()) {
    showFieldError(descriptionInput, 'Açıklama zorunludur');
    isValid = false;
  }

  // Fiyat kontrolü
  if (!priceInput.value || parseFloat(priceInput.value) < 0) {
    showFieldError(priceInput, 'Geçerli bir fiyat girin');
    isValid = false;
  }

  // Kategori kontrolü
  if (!categorySelect.value) {
    showFieldError(categorySelect, 'Kategori seçiniz');
    isValid = false;
  }

  return isValid;
}

// ===== Ürün Ekleme =====

/**
 * Form verilerinden yeni ürün oluşturur ve kaydeder
 * @param {Event} e - Form submit eventi
 */
function handleAddProduct(e) {
  e.preventDefault();

  // Form doğrulama
  if (!validateForm()) return;

  // Yeni ürün nesnesi
  var newProduct = {
    id: generateId(),
    title: titleInput.value.trim(),
    description: descriptionInput.value.trim(),
    price: parseFloat(priceInput.value),
    category: categorySelect.value,
    likes: 0,
    comments: [],
    createdAt: new Date().toISOString()
  };

  // Kaydet
  var products = getProducts();
  products.unshift(newProduct); // En başa ekle
  saveProducts(products);

  // Formu temizle
  productForm.reset();
  [titleInput, descriptionInput, priceInput, categorySelect].forEach(clearFieldError);

  // Yeniden render ve istatistik güncelle
  renderProducts();
  updateStats();
  showToast('✅ Ürün başarıyla eklendi!');
}

// ===== Ürün Silme =====

/**
 * Onay alarak ürünü siler
 * @param {string} productId - Silinecek ürünün ID'si
 */
function deleteProduct(productId) {
  if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;

  var products = getProducts();
  products = products.filter(function (p) { return p.id !== productId; });
  saveProducts(products);

  // Açık yorum panelinden sil
  openCommentPanels.delete(productId);

  renderProducts();
  updateStats();
  showToast('🗑️ Ürün silindi');
}

// ===== Beğeni Sistemi =====

/**
 * Ürünün beğeni sayısını artırır
 * @param {string} productId - Beğenilecek ürünün ID'si
 */
function toggleLike(productId) {
  var products = getProducts();
  var product = products.find(function (p) { return p.id === productId; });
  if (!product) return;

  product.likes += 1;
  saveProducts(products);

  // Sadece ilgili kartı güncelle (tüm DOM'u yeniden render etme)
  var card = document.querySelector('[data-id="' + productId + '"]');
  if (card) {
    var likeBtn = card.querySelector('.like-btn');
    if (likeBtn) {
      likeBtn.classList.add('liked');
      likeBtn.querySelector('span').textContent = product.likes;

      // Beğeni animasyonu
      likeBtn.style.transform = 'scale(1.2)';
      setTimeout(function () { likeBtn.style.transform = ''; }, 200);
    }
  }
  updateStats();
}

// ===== Yorum Sistemi =====

/**
 * Yorum alanının açık/kapalı durumunu değiştirir
 * @param {string} productId - Ürün ID'si
 */
function toggleComments(productId) {
  var commentsSection = document.querySelector('[data-comments-id="' + productId + '"]');
  if (!commentsSection) return;

  if (openCommentPanels.has(productId)) {
    openCommentPanels.delete(productId);
    commentsSection.classList.remove('open');
  } else {
    openCommentPanels.add(productId);
    commentsSection.classList.add('open');
    // Açıldığında input'a odaklan
    var input = commentsSection.querySelector('input');
    if (input) {
      setTimeout(function () { input.focus(); }, 100);
    }
  }
}

/**
 * Ürüne yorum ekler
 * @param {string} productId - Yorum eklenecek ürünün ID'si
 * @param {string} commentText - Yorum metni
 */
function addComment(productId, commentText) {
  if (!commentText || !commentText.trim()) return;

  var products = getProducts();
  var product = products.find(function (p) { return p.id === productId; });
  if (!product) return;

  var comment = {
    id: generateId(),
    text: commentText.trim(),
    createdAt: new Date().toISOString()
  };

  product.comments.push(comment);
  saveProducts(products);

  // Yorum panelinin açık kalmasını sağla
  openCommentPanels.add(productId);

  // Sadece yorum kısmını güncelle, tüm DOM'u yeniden çizme
  updateCommentSection(productId, product.comments);

  // Yorum sayacını güncelle
  var card = document.querySelector('[data-id="' + productId + '"]');
  if (card) {
    var commentBtn = card.querySelector('.comment-btn span');
    if (commentBtn) {
      commentBtn.textContent = product.comments.length;
    }
  }

  showToast('💬 Yorum eklendi!');
}

/**
 * Bir ürünün yorum bölümünü günceller (tüm sayfayı yeniden render etmeden)
 * @param {string} productId - Ürün ID'si
 * @param {Array} comments - Yorum dizisi
 */
function updateCommentSection(productId, comments) {
  var commentsSection = document.querySelector('[data-comments-id="' + productId + '"]');
  if (!commentsSection) return;

  // Yorum listesini yeniden oluştur
  var commentListContainer = commentsSection.querySelector('.comment-list-container');
  if (commentListContainer) {
    if (comments.length > 0) {
      commentListContainer.innerHTML = '<ul class="comment-list">' +
        comments.map(function (c) {
          return '<li class="comment-item">' +
            '<div>' + escapeHTML(c.text) + '</div>' +
            '<div class="comment-date">' + formatDate(c.createdAt) + '</div>' +
            '</li>';
        }).join('') + '</ul>';
    } else {
      commentListContainer.innerHTML = '<p style="color: var(--color-text-muted); font-size: 0.85rem; text-align:center;">Henüz yorum yok</p>';
    }
  }

  // Input'u temizle ve odakla
  var input = document.getElementById('commentInput-' + productId);
  if (input) {
    input.value = '';
    input.focus();
  }

  // Yorum listesini en aşağı kaydır
  var commentList = commentsSection.querySelector('.comment-list');
  if (commentList) {
    commentList.scrollTop = commentList.scrollHeight;
  }
}

/**
 * Yorum input'unda Enter tuşuyla gönderim
 * @param {KeyboardEvent} e - Klavye eventi
 * @param {string} productId - Ürün ID'si
 */
function handleCommentKeydown(e, productId) {
  if (e.key === 'Enter') {
    e.preventDefault();
    submitComment(productId);
  }
}

/**
 * Yorum gönderir
 * @param {string} productId - Ürün ID'si
 */
function submitComment(productId) {
  var input = document.getElementById('commentInput-' + productId);
  if (input && input.value.trim()) {
    addComment(productId, input.value);
  }
}

// ===== Filtreleme & Arama =====

/**
 * Arama ve kategori filtresine göre ürünleri döndürür
 * @returns {Array} Filtrelenmiş ürün dizisi
 */
function getFilteredProducts() {
  var products = getProducts();
  var searchTerm = searchInput.value.trim().toLowerCase();
  var filterCategory = filterCategorySelect.value;

  return products.filter(function (product) {
    // Kategori filtresi
    var matchesCategory = filterCategory === 'all' || product.category === filterCategory;

    // Arama filtresi (başlık ve açıklamada ara)
    var matchesSearch = !searchTerm ||
      product.title.toLowerCase().indexOf(searchTerm) !== -1 ||
      product.description.toLowerCase().indexOf(searchTerm) !== -1;

    return matchesCategory && matchesSearch;
  });
}

// ===== Ürün Kartı Oluşturma =====

/**
 * Tek bir ürün kartı HTML'i oluşturur
 * @param {Object} product - Ürün verisi
 * @returns {string} HTML stringi
 */
function createProductCard(product) {
  var isCommentOpen = openCommentPanels.has(product.id);

  var commentsHTML = product.comments.map(function (c) {
    return '<li class="comment-item">' +
      '<div>' + escapeHTML(c.text) + '</div>' +
      '<div class="comment-date">' + formatDate(c.createdAt) + '</div>' +
      '</li>';
  }).join('');

  var commentListHTML = product.comments.length > 0
    ? '<ul class="comment-list">' + commentsHTML + '</ul>'
    : '<p style="color: var(--color-text-muted); font-size: 0.85rem; text-align:center;">Henüz yorum yok</p>';

  return '<article class="product-card" data-id="' + product.id + '">' +
    '<div class="card-header">' +
    '<h3 class="card-title">' + escapeHTML(product.title) + '</h3>' +
    '<span class="card-category">' + escapeHTML(product.category) + '</span>' +
    '</div>' +
    '<div class="card-body">' +
    '<p class="card-description">' + escapeHTML(product.description) + '</p>' +
    '</div>' +
    '<div class="card-price">' + formatPrice(product.price) + '</div>' +
    '<div class="card-date">📅 ' + formatDate(product.createdAt) + '</div>' +
    '<div class="card-actions">' +
    '<button class="action-btn like-btn ' + (product.likes > 0 ? 'liked' : '') + '" ' +
    'onclick="toggleLike(\'' + product.id + '\')" title="Beğen">' +
    '❤️ <span>' + product.likes + '</span>' +
    '</button>' +
    '<button class="action-btn comment-btn" ' +
    'onclick="toggleComments(\'' + product.id + '\')" title="Yorumlar">' +
    '💬 <span>' + product.comments.length + '</span>' +
    '</button>' +
    '<button class="action-btn delete-btn" ' +
    'onclick="deleteProduct(\'' + product.id + '\')" title="Sil">' +
    '🗑️ Sil' +
    '</button>' +
    '</div>' +
    '<div class="comments-section ' + (isCommentOpen ? 'open' : '') + '" data-comments-id="' + product.id + '">' +
    '<div class="comment-form">' +
    '<input type="text" placeholder="Yorum yazın..." ' +
    'id="commentInput-' + product.id + '" ' +
    'onkeydown="handleCommentKeydown(event, \'' + product.id + '\')" />' +
    '<button onclick="submitComment(\'' + product.id + '\')">Gönder</button>' +
    '</div>' +
    '<div class="comment-list-container">' + commentListHTML + '</div>' +
    '</div>' +
    '</article>';
}

// ===== Render =====

/**
 * Filtrelenmiş ürünleri DOM'a render eder
 */
function renderProducts() {
  var filteredProducts = getFilteredProducts();

  if (filteredProducts.length === 0) {
    productListEl.innerHTML = '';
    emptyStateEl.style.display = 'block';

    // Arama/filtre sonucu boşsa farklı mesaj göster
    var allProducts = getProducts();
    if (allProducts.length > 0) {
      emptyStateEl.innerHTML =
        '<span class="empty-icon">🔍</span>' +
        '<p>Aramanızla eşleşen ürün bulunamadı.</p>' +
        '<p class="empty-hint">Farklı bir arama terimi veya kategori deneyin.</p>';
    } else {
      emptyStateEl.innerHTML =
        '<span class="empty-icon">📭</span>' +
        '<p>Henüz ürün eklenmedi.</p>' +
        '<p class="empty-hint">Yukarıdaki formu kullanarak ilk ürünü ekleyin!</p>';
    }
  } else {
    emptyStateEl.style.display = 'none';
    productListEl.innerHTML = filteredProducts.map(createProductCard).join('');
  }
}

// ===== Olay Dinleyicileri Kurulumu =====

/**
 * Tüm olay dinleyicilerini kurar
 */
function setupEventListeners() {
  // Form gönderme
  productForm.addEventListener('submit', handleAddProduct);

  // Canlı arama
  searchInput.addEventListener('input', function () {
    renderProducts();
  });

  // Kategori filtresi değişimi
  filterCategorySelect.addEventListener('change', function () {
    renderProducts();
  });

  // Form alanlarından hata görselini temizle (odaklandığında)
  [titleInput, descriptionInput, priceInput, categorySelect].forEach(function (field) {
    field.addEventListener('focus', function () {
      clearFieldError(field);
    });
  });
}

// ===== Uygulama Başlatma =====

/**
 * Uygulamayı ilk yüklemede başlatır - DOM hazır olduğunda çağrılır
 */
function init() {
  // DOM elemanlarını al
  productForm = document.getElementById('productForm');
  titleInput = document.getElementById('title');
  descriptionInput = document.getElementById('description');
  priceInput = document.getElementById('price');
  categorySelect = document.getElementById('category');
  productListEl = document.getElementById('productList');
  emptyStateEl = document.getElementById('emptyState');
  searchInput = document.getElementById('searchInput');
  filterCategorySelect = document.getElementById('filterCategory');
  totalProductsEl = document.getElementById('totalProducts');
  totalLikesEl = document.getElementById('totalLikes');

  // Olay dinleyicilerini kur
  setupEventListeners();

  // İlk render ve istatistik
  renderProducts();
  updateStats();
}

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', init);
