package com.mindmatch.pagamento.dto;

import com.mindmatch.pagamento.entities.Agente;
import com.mindmatch.pagamento.entities.enums.StatusAgente;

import java.time.LocalDate;

public record AgenteFetchResponse(
        Long id,
        String nome,
        String especialidade,
        LocalDate ultimaRevisao,
        Long idMissao,
        Long duracaoMissao,
        StatusAgente status
) {

    public AgenteFetchResponse(Agente entity) {
        this(entity.getId(), entity.getNome(), entity.getEspecialidade(), entity.getUltimaRevisao(), entity.getMissao().getId(), entity.getMissao().getTempo(), entity.getStatus());
    }
}
