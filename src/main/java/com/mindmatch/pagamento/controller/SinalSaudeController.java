package com.mindmatch.pagamento.controller;

import com.mindmatch.pagamento.dto.SinalSaudeRequest;
import com.mindmatch.pagamento.dto.SinalSaudeResponse;
import com.mindmatch.pagamento.service.SinalSaudeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/sinal-saude")
@RequiredArgsConstructor
public class SinalSaudeController {

    private final SinalSaudeService service;

    @PostMapping
    public ResponseEntity<SinalSaudeResponse> create(@RequestBody SinalSaudeRequest request) {
        SinalSaudeResponse responseBody = service.create(request);

        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/id/{id:[0-9]+}")
                .buildAndExpand(responseBody.id())
                .toUri();

        return ResponseEntity.created(uri).body(responseBody);
    }

    @PutMapping("/id/{id:[0-9]+}")
    public ResponseEntity<SinalSaudeResponse> update(@PathVariable Long id, @RequestBody SinalSaudeRequest request) {
        SinalSaudeResponse responseBody = service.update(id, request);

        return ResponseEntity.ok(responseBody);
    }
}
