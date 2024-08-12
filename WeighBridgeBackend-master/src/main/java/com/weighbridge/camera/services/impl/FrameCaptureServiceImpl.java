package com.weighbridge.camera.services.impl;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.function.Consumer;

import javax.imageio.ImageIO;

import com.weighbridge.camera.services.FrameCaptureService;
import org.bytedeco.javacv.FFmpegFrameGrabber;
import org.bytedeco.javacv.Frame;
import org.bytedeco.javacv.Java2DFrameConverter;
import org.springframework.stereotype.Service;

@Service
public class FrameCaptureServiceImpl implements FrameCaptureService {

    private final AtomicBoolean isRunning = new AtomicBoolean(false);

    public void streamFrames(String rtspUrl, Consumer<byte[]> frameConsumer) throws Exception {
        FFmpegFrameGrabber frameGrabber = new FFmpegFrameGrabber(rtspUrl);
        frameGrabber.setOption("rtsp_transport", "tcp");
        frameGrabber.setOption("stimeout", "3000000");

        System.out.println("Starting frame capture...");

        try {
            frameGrabber.start();
            System.out.println("Frame grabber started successfully for URL: " + rtspUrl);
            isRunning.set(true);
        } catch (Exception e) {
            System.err.println("Failed to start frame grabber: " + e.getMessage());
            throw new Exception("Failed to start frame grabber: " + e.getMessage(), e);
        }

        Java2DFrameConverter converter = new Java2DFrameConverter();

        try {
            while (isRunning.get()) {
                Frame frame = frameGrabber.grab();
                if (frame == null) {
                    System.err.println("Frame is null, stream might have ended.");
                    break;
                }

                BufferedImage bufferedImage = converter.convert(frame);
                if (bufferedImage != null) {
                    try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
                        ImageIO.write(bufferedImage, "jpeg", baos);
                        frameConsumer.accept(baos.toByteArray());
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (isRunning.get()) {
                    frameGrabber.stop();
                    System.out.println("Frame grabber stopped for URL: " + rtspUrl);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public void stopFrameCapture() {
        System.out.println("isrunning "+isRunning);
        isRunning.set(false);
    }
}
