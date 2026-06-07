package com.mindmatch.pagamento.service;

import com.mindmatch.pagamento.dto.TarefaRequest;
import com.mindmatch.pagamento.dto.TarefaResponse;
import com.mindmatch.pagamento.entities.Agente;
import com.mindmatch.pagamento.entities.Tarefa;
import com.mindmatch.pagamento.repositories.AgenteRepository;
import com.mindmatch.pagamento.repositories.TarefaRepository;
import com.mindmatch.pagamento.service.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TarefaService {

    private final TarefaRepository tarefaRepository;
    private final AgenteRepository agenteRepository;

    @Transactional
    public TarefaResponse create(TarefaRequest request) {
        Tarefa created = new Tarefa();

        created.setNome(request.nome());
        created.setTipo(request.tipo());
        created.setHorario(request.horario());
        created.setPrioridade(request.prioridade());
        created.setStatus(request.statusTarefa());

        Agente ref = agenteRepository.findById(request.idAgente()).orElse(null);

        created.setAgente(ref);

        Tarefa saved = tarefaRepository.save(created);

        return new TarefaResponse(saved);
    }

    @Transactional(readOnly = true)
    public TarefaResponse findById(Long id) {
        return new TarefaResponse(tarefaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tarefa não encontrada, id: " + id)));
    }
}
