package com.weighbridge.config;

import com.weighbridge.admin.entities.CameraMaster;
import com.weighbridge.admin.entities.RoleMaster;
import com.weighbridge.admin.repsitories.CameraMasterRepository;
import com.weighbridge.admin.repsitories.RoleMasterRepository;
import com.weighbridge.camera.entites.CameraView;
import com.weighbridge.camera.services.FrameCaptureService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@RestController
public class FrameController {

    private final FrameCaptureService frameCaptureService;
    private final FrameSseService frameSseService;

    private final CameraMasterRepository cameraMasterRepository;

    private final RoleMasterRepository roleMasterRepository;

    public FrameController(FrameCaptureService frameCaptureService, FrameSseService frameSseService, CameraMasterRepository cameraMasterRepository, RoleMasterRepository roleMasterRepository) {
        this.frameCaptureService = frameCaptureService;
        this.frameSseService = frameSseService;
        this.cameraMasterRepository = cameraMasterRepository;
        this.roleMasterRepository = roleMasterRepository;
    }


    @GetMapping(value = "/frames", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamFramesWithCompanyAndSite(@RequestParam String company, @RequestParam String site, @RequestParam String index, @RequestParam String url) {
        SseEmitter emitter = new SseEmitter((long) (60000 * 5));

        System.out.println("Received request for company: " + company + ", site: " + site + ", index: " + index+", url: "+url);

        frameSseService.addEmitter(company + "_" + site + "_" + index, emitter);

        new Thread(() -> {
            try {
                frameCaptureService.streamFrames(url, frameBytes -> {
                    frameSseService.streamFrames(company + "_" + site + "_" + index, frameBytes);
                });
            } catch (Exception e) {
                System.err.println("Error starting frame capture: " + e.getMessage());
                emitter.completeWithError(e);
            }
        }).start();

        return emitter;
    }

    @GetMapping("/api/rtsp-urls")
    public List<String> getRtspUrls(@RequestParam String company, @RequestParam String site, @RequestParam String roleName) {
        List<String> sseUrls = new ArrayList<>();
        Integer roleId = roleMasterRepository.findRoleIdByRoleName(roleName);
        CameraMaster cameraMaster = cameraMasterRepository.findByCompanyIdAndSiteIdAndRoleId(company, site, roleId);

        if (cameraMaster != null) {
            addUrlIfNotNull(sseUrls, cameraMaster.getBackCamUrl4(), company, site, 0);
            addUrlIfNotNull(sseUrls, cameraMaster.getBottomCamUrl2(), company, site, 1);
            addUrlIfNotNull(sseUrls, cameraMaster.getFrontCamUrl3(), company, site, 2);
            addUrlIfNotNull(sseUrls, cameraMaster.getLeftCamUrl5(), company, site, 3);
            addUrlIfNotNull(sseUrls, cameraMaster.getTopCamUrl1(), company, site, 4);
        }
        return sseUrls;
    }

    private void addUrlIfNotNull(List<String> sseUrls, String url, String company, String site, int index) {
        if (url != null && !url.isEmpty()) {
            String encodedUrl = URLEncoder.encode(url, StandardCharsets.UTF_8);
            String sseUrl = String.format("/frames?company=%s&site=%s&index=%d&url=%s", company, site, index, encodedUrl);
            sseUrls.add(sseUrl);
        }
    }


    @GetMapping("/api/stop-frame-grabber")
    public String stopFrameGrabber(@RequestParam String uniqueId) {
        frameCaptureService.stopFrameCapture();
        return "Frame grabber stopped for ID: " + uniqueId;
    }

}

