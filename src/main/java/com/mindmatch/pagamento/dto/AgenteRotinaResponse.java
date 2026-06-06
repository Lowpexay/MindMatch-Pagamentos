package com.mindmatch.pagamento.dto;

import com.mindmatch.pagamento.entities.Agente;

import java.util.List;

public record AgenteRotinaResponse(
    Long idAgente,
    String nomeAgente,
    Double tempoDescanso,
    List<TarefaResponse> cronograma

) {
    public AgenteRotinaResponse(Agente entity) {
        this(
                entity.getId(),
                entity.getNome(),
                entity.getDescanso(),
                entity.getTarefas()
                        .stream().map(TarefaResponse::new)
                        .toList()
        );
    }
}
