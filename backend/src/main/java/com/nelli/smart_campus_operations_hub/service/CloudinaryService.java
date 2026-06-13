package com.nelli.smart_campus_operations_hub.service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * Placeholder Cloudinary integration service.
 *
 * <p>Current implementation returns synthetic upload metadata so ticket flows can compile/run
 * until concrete Cloudinary SDK wiring is added.
 */
@Service
@Slf4j
public class CloudinaryService {

    public Map<String, Object> uploadImage(MultipartFile file) {
        String publicId = "mock/" + UUID.randomUUID();
        String secureUrl = "https://res.cloudinary.com/demo/image/upload/" + publicId;
        Map<String, Object> result = new HashMap<>();
        result.put("public_id", publicId);
        result.put("secure_url", secureUrl);
        log.info("Mock Cloudinary upload generated. publicId={}", publicId);
        return result;
    }

    public void deleteImage(String publicId) {
        log.info("Mock Cloudinary delete called. publicId={}", publicId);
    }
}
