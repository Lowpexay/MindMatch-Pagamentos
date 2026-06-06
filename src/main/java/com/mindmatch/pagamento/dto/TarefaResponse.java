package com.mindmatch.pagamento.dto;

import com.mindmatch.pagamento.entities.Tarefa;
import com.mindmatch.pagamento.entities.enums.Prioridade;
import com.mindmatch.pagamento.entities.enums.StatusTarefa;

import java.time.LocalDateTime;

public record TarefaResponse(
        Long id,
        String nome,
        String tipo,
        LocalDateTime horario,
        Prioridade prioridade,
        StatusTarefa status,
        Long idAgente
) {

    public TarefaResponse(Tarefa entity) {
        this(entity.getId(), entity.getNome(), entity.getTipo(), entity.getHorario(), entity.getPrioridade(), entity.getStatus(), entity.getAgente().getId());
    }
}
