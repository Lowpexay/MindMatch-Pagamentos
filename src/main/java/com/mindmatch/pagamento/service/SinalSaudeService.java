package com.mindmatch.pagamento.service;

import com.mindmatch.pagamento.dto.SinalSaudeRequest;
import com.mindmatch.pagamento.dto.SinalSaudeResponse;
import com.mindmatch.pagamento.entities.Agente;
import com.mindmatch.pagamento.entities.SinalSaude;
import com.mindmatch.pagamento.repositories.AgenteRepository;
import com.mindmatch.pagamento.repositories.SinalSaudeRepository;
import com.mindmatch.pagamento.service.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor

@Service
public class SinalSaudeService {

    private final SinalSaudeRepository repository;
    private final AgenteRepository agenteRepository;

    @Transactional
    public SinalSaudeResponse create(SinalSaudeRequest request) {
        if (!agenteRepository.existsById(request.agenteId())) {
            throw new ResourceNotFoundException("Agente não encontrado, id: " + request.agenteId());
        }

        SinalSaude created = new SinalSaude();

        created.setNome(request.nome());
        created.setCategoria(request.categoria());
        created.setStatus(request.status());
        created.setValor(request.valor());

        Agente ref = new Agente();
        ref.setId(request.agenteId());
        created.setAgente(ref);

        SinalSaude saved = repository.save(created);

        return new SinalSaudeResponse(saved);
    }

    @Transactional
    public SinalSaudeResponse update(Long id, SinalSaudeRequest request) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Sinal de saúde não encontrado, id: " + id);
        }
        if (!agenteRepository.existsById(request.agenteId())) {
            throw new ResourceNotFoundException("Agente não encontrado, id: " + request.agenteId());
        }

        SinalSaude updated = new SinalSaude();

        updated.setNome(request.nome());
        updated.setCategoria(request.categoria());
        updated.setStatus(request.status());
        updated.setValor(request.valor());

        Agente ref = new Agente();
        ref.setId(request.agenteId());

        SinalSaude saved = repository.save(updated);

        return new SinalSaudeResponse(saved);
    }


}
