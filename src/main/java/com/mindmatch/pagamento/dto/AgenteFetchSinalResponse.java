package com.mindmatch.pagamento.dto;

import com.mindmatch.pagamento.entities.Agente;
import com.mindmatch.pagamento.entities.SinalSaude;
import com.mindmatch.pagamento.entities.enums.StatusAgente;

import java.time.LocalDate;
import java.util.List;

public record AgenteFetchSinalResponse(
        Long id,
        String nomeAgente,
        String especialidade,
        LocalDate ultimaRevisao,
        StatusAgente statusSaude,
        Long idMissao,
        String nomeMissao,
        Long tempoMissao,
        List<SinalSaudeResponse> sinalSaude
) {
    public AgenteFetchSinalResponse(Agente entity) {
        this(
                entity.getId(),
                entity.getNome(),
                entity.getEspecialidade(),
                entity.getUltimaRevisao(),
                entity.getStatus(),
                entity.getMissao().getId(),
                entity.getMissao().getNome(),
                entity.getMissao().getTempo(),
                entity.getSinaisSaude()
                        .stream().map(SinalSaudeResponse::new)
                        .toList()
        );
    }
}
