package com.weighbridge.config;

import com.weighbridge.camera.services.FrameCaptureService;
import com.weighbridge.camera.services.WeighbridgeService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.util.Base64;
import java.util.Collections;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
public class FrameWebSocketHandler extends TextWebSocketHandler {
    private final FrameCaptureService frameCaptureService;
    private final String rtspUrl;

    @Autowired
    public FrameWebSocketHandler(FrameCaptureService frameCaptureService, String rtspUrl) {
        this.frameCaptureService = frameCaptureService;
        this.rtspUrl = rtspUrl;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        if (rtspUrl != null && !rtspUrl.isEmpty()) {
            new Thread(() -> {
                try {
                    frameCaptureService.streamFrames(rtspUrl, (frameBytes) -> {
                        try {
                            String base64Image = Base64.getEncoder().encodeToString(frameBytes);
                            session.sendMessage(new TextMessage(base64Image));
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    });
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }).start();
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        // Perform cleanup if needed
    }
}
