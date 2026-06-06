package com.mindmatch.pagamento.dto;

import com.mindmatch.pagamento.entities.enums.Prioridade;
import com.mindmatch.pagamento.entities.enums.StatusTarefa;

import java.time.LocalDateTime;

public record TarefaRequest(
        String nome,
        String tipo,
        LocalDateTime horario,
        Prioridade prioridade,
        StatusTarefa statusTarefa,
        Long idAgente
) {
}
