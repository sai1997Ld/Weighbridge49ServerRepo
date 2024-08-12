package com.weighbridge.config;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
@Service
public class FrameSseService {

    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();

    public void addEmitter(String path, SseEmitter emitter) {
        emitters.put(path, emitter);
        emitter.onCompletion(() -> emitters.remove(path));
        emitter.onTimeout(() -> emitters.remove(path));
    }

    public void removeEmitter(String path) {
        emitters.remove(path);
    }

    public void streamFrames(String path, byte[] frameBytes) {
        SseEmitter emitter = emitters.get(path);
        if (emitter == null) {
            System.out.println("No emitter found for path: " + path);
            return;
        }

        System.out.println("Sending frame...");

        try {
            String base64Image = Base64.getEncoder().encodeToString(frameBytes);
            emitter.send(SseEmitter.event().name("frame").data(base64Image));
        } catch (IOException e) {
            System.err.println("Error sending frame: " + e.getMessage());
            emitter.completeWithError(e);
        }
    }
}
