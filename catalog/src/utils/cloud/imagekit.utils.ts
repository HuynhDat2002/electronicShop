import ImageKit from '@imagekit/nodejs';
import fs from 'fs';
import { errorResponse } from '../error';
const client = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY, // This is the default and can be omitted
});

export const uploadImages = async (
  images: { image_url: string; image_name: string }[],
  folder: string
): Promise<{ image_id: string; image_url: string; image_name: string }[]> => {
  const resp = await Promise.all(
    images.map((file) =>
      client.files.upload({
        file: fs.createReadStream(file.image_url),
        fileName: file.image_name,
        folder: `/electronic/${folder}`,
      })
    )
  );
  if (resp.length <= 0) return [{ image_id: '', image_url: '', image_name: '' }];
  const results = resp.map((i) => ({
    image_id: i.fileId || '',
    image_url: i.url || '',
    image_name: i.name || '',
  }));
  console.log('Upload images successfully');
  console.log('images', results);
  for (let i of images) {
    fs.unlink(i.image_url, (err) => {
      if (err) console.error('Xoá file thất bại:', err);
      else console.log('Đã xoá file tạm:', i.image_url);
    });
  }
  return results;
};

export const uploadImage = async (
  image: { image_url: string; image_name: string },
  folder: string
): Promise<{ image_id: string; image_url: string; image_name: string }> => {
  const resp = await client.files.upload({
    file: fs.createReadStream(image.image_url),
    fileName: image.image_name,
    folder: `/electronic/${folder}`,
  });

  const results = {
    image_id: resp.fileId || '',
    image_url: resp.url || '',
    image_name: resp.name || '',
  };
  console.log('Upload image successfully');
  console.log('image', results);

  fs.unlink(image.image_url, (err) => {
      if (err) console.error('Xoá file thất bại:', err);
      else console.log('Đã xoá file tạm:', image.image_url);
    });
  return results;
};

export const deleteImage = (fieldId: string) => {
  console.log('fieldid to delete',fieldId)
  const resp = client.files.delete(fieldId)
  console.log('Delete image successfully');
  return resp;
};
