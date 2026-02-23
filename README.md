# 📦 BEUShareBox — Ürün Paylaşım Platformu

> Ürünlerini paylaş, keşfet, beğen!

**BEUShareBox**, kullanıcıların ürünlerini kolayca paylaşabildiği, beğenebildiği ve yorum yapabildiği modern bir Tek Sayfa Uygulamasıdır (SPA). Tamamen **saf HTML, CSS ve JavaScript** ile geliştirilmiştir — hiçbir framework veya kütüphane kullanılmamıştır.

---

## 🎯 Proje Hakkında

Bu proje, **Bitlis Eren Üniversitesi** sınıf projesi kapsamında geliştirilmiştir. Kullanıcılar platforma ürün ekleyebilir, ürünleri beğenebilir, yorum yapabilir, kategoriye göre filtreleyebilir ve arama yapabilir. Tüm veriler tarayıcının `localStorage` özelliği ile saklanır.

---

## ✨ Özellikler

| Özellik | Açıklama |
|---------|----------|
| ➕ **Ürün Ekleme** | Başlık, açıklama, fiyat ve kategori ile yeni ürün ekleme |
| ❤️ **Beğeni Sistemi** | Ürünleri beğenme ve beğeni sayacı |
| 💬 **Yorum Sistemi** | Her ürüne bağımsız yorum ekleme |
| 🔍 **Canlı Arama** | Başlık ve açıklamada anlık arama |
| 📂 **Kategori Filtresi** | Kategoriye göre ürün filtreleme |
| 🗑️ **Ürün Silme** | Onaylı ürün silme |
| 💾 **Kalıcı Veri** | localStorage ile veriler tarayıcıda saklanır |
| 📊 **İstatistikler** | Toplam ürün ve beğeni sayısı |
| ✅ **Form Doğrulama** | Boş alan kontrolü ve hata mesajları |
| 📱 **Responsive Tasarım** | Mobil, tablet ve masaüstü uyumlu |

---

## 🛠️ Kullanılan Teknolojiler

- **HTML5** — Semantik yapı (`header`, `main`, `footer`, `article`, `section`)
- **CSS3** — CSS değişkenleri, Grid, Flexbox, animasyonlar, media queries
- **Vanilla JavaScript** — DOM manipülasyonu, localStorage, olay yönetimi

> ⚠️ Hiçbir kütüphane, framework veya harici bağımlılık kullanılmamıştır.

---

## 📁 Proje Yapısı

```
BEUShareBox/
├── index.html    → Ana HTML dosyası (semantik yapı)
├── style.css     → Tüm stiller (responsive, dark tema)
├── app.js        → Uygulama mantığı (CRUD, beğeni, yorum, arama)
└── README.md     → Proje dokümantasyonu
```

---

## 🚀 Kurulum ve Çalıştırma

1. **Projeyi klonlayın:**
   ```bash
   git clone https://github.com/Furkangngrd/BEUShareBox.git
   ```

2. **Proje klasörüne girin:**
   ```bash
   cd BEUShareBox
   ```

3. **`index.html` dosyasını tarayıcınızda açın:**
   - Dosyaya çift tıklayın, veya
   - VS Code'da **Live Server** eklentisi ile açın

> Herhangi bir sunucu veya yükleme gerekmez — doğrudan tarayıcıda çalışır!

---

## 📋 Veri Modeli

Her ürün aşağıdaki yapıda saklanır:

```json
{
  "id": "benzersiz_id",
  "title": "Ürün Başlığı",
  "description": "Ürün açıklaması",
  "price": 1500,
  "category": "Elektronik",
  "likes": 5,
  "comments": [
    {
      "id": "yorum_id",
      "text": "Harika ürün!",
      "createdAt": "2026-02-23T12:00:00.000Z"
    }
  ],
  "createdAt": "2026-02-23T12:00:00.000Z"
}
```

---

## 🎨 Tasarım Özellikleri

- 🌙 **Dark Tema** — Göz yormayan modern koyu renk paleti
- 🎆 **Hover Efektleri** — Kartlarda ve butonlarda animasyonlu geçişler
- 📐 **Responsive Grid** — Mobil: 1 sütun · Tablet: 2 sütun · Masaüstü: 3 sütun
- 🔔 **Toast Bildirimleri** — Ekleme, silme ve yorum işlemlerinde anlık geri bildirim
- ✨ **CSS Değişkenleri** — `:root` ile merkezi renk ve boyut yönetimi

---

## 📂 Kategoriler

- Elektronik
- Giyim
- Kitap
- Spor
- Ev & Yaşam
- Diğer

---

## 👨‍💻 Geliştirici

**Furkan Güngördü**

---

## 📄 Lisans

Bu proje eğitim amaçlı geliştirilmiştir. Tüm hakları saklıdır.

---

<p align="center">
  <b>📦 BEUShareBox</b> — Bitlis Eren Üniversitesi Sınıf Projesi · 2026
</p>
