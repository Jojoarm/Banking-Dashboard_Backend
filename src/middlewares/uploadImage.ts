import cloudinary from 'cloudinary';

const uploadImage = async (file: Express.Multer.File) => {
  //creating image
  const image = file;
  const base64Image = Buffer.from(image.buffer).toString('base64');
  const dataURI = `data:${image.mimetype};base64,${base64Image}`;

  //uploading image to cloudinary
  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
  return uploadResponse.url;
};

export default uploadImage;
