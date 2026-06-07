package com.mindmatch.pagamento.controller;

import com.mindmatch.pagamento.dto.TarefaRequest;
import com.mindmatch.pagamento.dto.TarefaResponse;
import com.mindmatch.pagamento.service.TarefaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/tarefas")
@RequiredArgsConstructor
public class TarefaController {

    private final TarefaService service;

    @PostMapping
    public ResponseEntity<TarefaResponse> create(@RequestBody TarefaRequest request) {
        TarefaResponse responseBody = service.create(request);

        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/id/{id:[0-9]+}")
                .buildAndExpand(responseBody.id())
                .toUri();

        return ResponseEntity.created(uri).body(responseBody);
    }

    @GetMapping("/id/{id:[0-9]+}")
    public ResponseEntity<TarefaResponse> findById(@PathVariable Long id) {
        TarefaResponse responseBody = service.findById(id);

        return ResponseEntity.ok(responseBody);
    }
}
