package com.weighbridge.config;

import com.weighbridge.camera.services.FrameCaptureService;
import com.weighbridge.camera.services.WeighbridgeService;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    private final FrameCaptureService frameCaptureService;
    private final WeighbridgeService weighbridgeService;

    public WebSocketConfig(FrameCaptureService frameCaptureService, WeighbridgeService weighbridgeService) {
        this.frameCaptureService = frameCaptureService;
        this.weighbridgeService = weighbridgeService;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // Register handlers for RTSP streams
        String[] rtspUrls = {
                "rtsp://admin:Techn0l0gy@172.16.20.90:554/cam/realmonitor?channel=1&subtype=0",
                "rtsp://admin:Techn0l0gy@172.16.20.90:554/cam/realmonitor?channel=1&subtype=0",
                "rtsp://admin:Techn0l0gy@172.16.20.90:554/cam/realmonitor?channel=1&subtype=0",
                "rtsp://admin:Techn0l0gy@172.16.20.90:554/cam/realmonitor?channel=1&subtype=0",
                "rtsp://admin:Techn0l0gy@172.16.20.90:554/cam/realmonitor?channel=1&subtype=0"
                // Add more RTSP URLs as needed
        };
        //below is vikram camera urls
        /*String[][] rtspUrls = {
            {"gate", "1", "rtsp://admin:vikram@123@192.168.1.223:554/cam/realmonitor?channel=1&subtype=0"},
            {"gate", "2", "rtsp://admin:vikram@123@192.168.1.227:554/cam/realmonitor?channel=1&subtype=0"},
            {"gate", "3", "rtsp://admin:admin123@192.168.1.202:554/cam/realmonitor?channel=1&subtype=0"},
            {"weigh", "1", "rtsp://admin:admin123@192.168.1.231:554/cam/realmonitor?channel=1&subtype=0"},
            {"weigh", "2", "rtsp://admin:vikram@123@192.168.1.222:554/cam/realmonitor?channel=1&subtype=0"}
        };
        */
        for (int i = 0; i < rtspUrls.length; i++) {
            registry.addHandler(new FrameWebSocketHandler(frameCaptureService, rtspUrls[i]), "/ws/frame" + (i + 1))
                    .setAllowedOrigins("*");
        }

        // Register handler for weighbridge data
        registry.addHandler(new WeighbridgeWebSocketHandler(weighbridgeService), "/ws/weight")
                .setAllowedOrigins("*");
    }
}
