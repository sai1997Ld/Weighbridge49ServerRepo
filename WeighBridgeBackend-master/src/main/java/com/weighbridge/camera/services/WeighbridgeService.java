package com.weighbridge.camera.services;


import org.springframework.stereotype.Service;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.Socket;

@Service
public class WeighbridgeService {

    private static final String WEIGHBRIDGE_IP = "192.168.1.50";
    private static final int WEIGHBRIDGE_PORT = 1;

    private String lastSentWeight = null;

    public String getLatestWeight() {
        String weightData = null;
        try (Socket socket = new Socket(WEIGHBRIDGE_IP, WEIGHBRIDGE_PORT);
             BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream()))) {
            weightData = reader.readLine();  // Adjust reading method as per weighbridge protocol
            System.out.println("Received weight: " + weightData);
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Only update last sent weight if it's different
        if (weightData != null && !weightData.equals(lastSentWeight)) {
            lastSentWeight = weightData;
        }

        return lastSentWeight;
    }
}

