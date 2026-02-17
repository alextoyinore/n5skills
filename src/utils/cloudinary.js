/**
 * Cloudinary utility for handling media uploads
 */

const CLOUDINARY_BASE_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}`;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Uploads a file to Cloudinary
 * @param {File} file - The file object to upload
 * @param {string} type - The resource type ('image', 'raw', 'video') - defaults to 'auto'
 * @returns {Promise<Object>} - The Cloudinary upload response
 */
export const uploadFile = async (file, type = 'auto') => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);

        const response = await fetch(`${CLOUDINARY_BASE_URL}/${type}/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to upload file');
        }

        const data = await response.json();
        return {
            url: data.secure_url,
            publicId: data.public_id,
            format: data.format,
            resource_type: data.resource_type,
            bytes: data.bytes,
            original_filename: data.original_filename
        };
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        throw error;
    }
};

/**
 * Uploads an image to Cloudinary (Legacy wrapper)
 */
export const uploadImage = (file) => uploadFile(file, 'image');

/**
 * Multiple image uploads helper
 * @param {FileList|Array} files - List of files
 * @returns {Promise<Array>} - Array of upload results
 */
export const uploadMultipleImages = async (files) => {
    const uploadPromises = Array.from(files).map(file => uploadImage(file));
    return Promise.all(uploadPromises);
};
