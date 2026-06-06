package com.mindmatch.pagamento.service;

import com.mindmatch.pagamento.dto.SinalSaudeRequest;
import com.mindmatch.pagamento.dto.SinalSaudeResponse;
import com.mindmatch.pagamento.entities.Agente;
import com.mindmatch.pagamento.entities.SinalSaude;
import com.mindmatch.pagamento.repositories.SinalSaudeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor

@Service
public class SinalSaudeService {

    private final SinalSaudeRepository repository;

    @Transactional
    public SinalSaudeResponse create(SinalSaudeRequest request) {
        SinalSaude created = new SinalSaude();

        created.setNome(request.nome());
        created.setCategoria(request.categoria());
        created.setStatus(request.status());
        created.setValor(request.valor());

        Agente ref = new Agente();
        ref.setId(request.agenteId());

        SinalSaude saved = repository.save(created);

        return new SinalSaudeResponse(saved);
    }


}
