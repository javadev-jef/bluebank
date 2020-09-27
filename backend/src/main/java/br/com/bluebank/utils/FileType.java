package br.com.bluebank.utils;

import org.springframework.util.MimeTypeUtils;

public enum FileType 
{
    PNG(MimeTypeUtils.IMAGE_PNG_VALUE, "png"),
    JPG(MimeTypeUtils.IMAGE_JPEG_VALUE, "jpg");

    String mimeType;
    String extension;

    FileType(String mimeType, String extension)
    {
        this.mimeType = mimeType;
        this.extension = extension;
    }
    
    public boolean sameOf(String mimeType)
    {
        return this.mimeType.equalsIgnoreCase(mimeType);
    }
}
