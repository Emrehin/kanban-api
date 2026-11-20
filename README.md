# Real-Time Kanban API

Node.js, Express, SQLite, JWT ve Socket.io kullanılarak geliştirilmiş; kimlik doğrulama, veri doğrulama ve gerçek zamanlı olay yayını sunan RESTful Kanban backend servisi.

## Mimari ve Özellikler

- **Katmanlı Yapı:** `routes`, `middlewares`, `schemas` ve `db` modüllerine ayrılmış sorumluluk dağılımı.
- **Kimlik Doğrulama ve Yetkilendirme:** `bcryptjs` ile parola özetleme, `jsonwebtoken` (JWT) ile oturum yönetimi ve kullanıcı bazlı kaynak izolasyonu (IDOR koruması).
- **Veri Doğrulama ve Hata Yönetimi:** `Zod` şemaları ile istek gövdesi (request body) doğrulaması ve merkezi hata yakalama ara katmanı.
- **Gerçek Zamanlı İletişim:** Görev oluşturma, durum güncelleme ve silme işlemlerinde `Socket.io` üzerinden istemcilere anlık olay yayını (`task:created`, `task:updated`, `task:deleted`).
- **İlişkisel Veritabanı:** `better-sqlite3` ile WAL modunda çalışan ve yabancı anahtar (Foreign Key) kısıtlamaları aktif veritabanı şeması.

## Kurulum ve Çalıştırma

### Docker ile Çalıştırma (Önerilen)
```bash
docker compose up --build -d