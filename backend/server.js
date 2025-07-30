import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(process.env.CLOUDINARY_API_KEY);
  console.log(process.env.CLOUDINARY_API_SECRET);
  console.log(process.env.CLOUDINARY_CLOUD_NAME);
});
