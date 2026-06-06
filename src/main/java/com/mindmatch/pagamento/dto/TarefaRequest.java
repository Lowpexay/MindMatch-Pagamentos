package com.mindmatch.pagamento.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.mindmatch.pagamento.entities.enums.Prioridade;
import com.mindmatch.pagamento.entities.enums.StatusTarefa;

import java.time.LocalDateTime;

public record TarefaRequest(
        String nome,
        String tipo,
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        LocalDateTime horario,
        Prioridade prioridade,
        StatusTarefa statusTarefa,
        Long idAgente
) {
}
