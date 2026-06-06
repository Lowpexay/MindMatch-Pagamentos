package com.mindmatch.pagamento.service;

import com.mindmatch.pagamento.dto.AgenteCreationRequest;
import com.mindmatch.pagamento.dto.AgenteCreationResponse;
import com.mindmatch.pagamento.dto.AgenteFetchResponse;
import com.mindmatch.pagamento.entities.Agente;
import com.mindmatch.pagamento.entities.enums.StatusAgente;
import com.mindmatch.pagamento.repositories.AgenteRepository;
import com.mindmatch.pagamento.service.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AgenteService {

    private final AgenteRepository repository;

    @Transactional
    public AgenteCreationResponse create(AgenteCreationRequest request) {
        Agente created = new Agente();

        created.setNome(request.nome());
        created.setEspecialidade(request.especialidade());
        created.setUltimaRevisao(request.ultimaRevisao());
        created.setStatus(StatusAgente.NORMAL);
        System.out.println(request.descanso());
        created.setDescanso(request.descanso());

        Agente savedAgente = repository.save(created);

        return new AgenteCreationResponse(savedAgente);
    }

    @Transactional(readOnly = true)
    public List<AgenteFetchResponse> findAll() {
        return repository.findAll()
                .stream().map(AgenteFetchResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public AgenteCreationResponse findById(Long id) {
        return new AgenteCreationResponse(
                repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Agente não encontrado; Id: " + id))
        );
    }
}
