interface CloudinaryUploadResult {
    imageUrl: string;
    publicId: string;
}

export async function uploadToCloudinary(
    file: File
): Promise<CloudinaryUploadResult> {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "mtedftib");

    const response = await fetch(
        "https://api.cloudinary.com/v1_1/dhozramhs/image/upload",
        {
            method: "POST",
            body: formData,
        }
    );

    if (!response.ok) {
        throw new Error("Cloudinary upload failed");
    }

    const data = await response.json();

    if (!data.secure_url || !data.public_id) {
        throw new Error("Cloudinary upload failed");
    }

    return {
        imageUrl: data.secure_url,
        publicId: data.public_id,
    };
}