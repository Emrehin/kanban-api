export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Geçersiz JSON formatı gönderildi.' });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Sunucu içi bir hata oluştu.',
  });
};