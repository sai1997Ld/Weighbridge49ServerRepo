package com.weighbridge.config;



import com.weighbridge.camera.services.WeighbridgeService;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.beans.factory.annotation.Autowired;
import java.io.IOException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
public class WeighbridgeWebSocketHandler extends TextWebSocketHandler {

    private final WeighbridgeService weighbridgeService;
    private final ExecutorService executorService = Executors.newCachedThreadPool();

    @Autowired
    public WeighbridgeWebSocketHandler(WeighbridgeService weighbridgeService) {
        this.weighbridgeService = weighbridgeService;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        executorService.execute(() -> sendWeightUpdates(session));
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        // Clean up resources if needed
    }

    private void sendWeightUpdates(WebSocketSession session) {
        try {
            String lastSentWeight = null;
            while (session.isOpen()) {
                System.out.println(weighbridgeService.getLatestWeight()+"==========="+lastSentWeight);
                String currentWeight = weighbridgeService.getLatestWeight();
                if (currentWeight != null && !currentWeight.equals(lastSentWeight)) {
                    System.out.println("sending finally");
                    session.sendMessage(new TextMessage(currentWeight));
                    lastSentWeight = currentWeight;
                }
                Thread.sleep(1000); // Adjust delay as needed
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }
}
