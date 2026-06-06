package com.mindmatch.pagamento.dto;

import com.mindmatch.pagamento.entities.Agente;
import com.mindmatch.pagamento.entities.enums.StatusAgente;

import java.time.LocalDate;

public record AgenteCreationResponse(
    Long id,
    String nome,
    String especialidade,
    LocalDate ultimaRevisao,
    StatusAgente status,
    Double descanso
) {

    public AgenteCreationResponse(Agente entity) {
        this(entity.getId(), entity.getNome(), entity.getEspecialidade(), entity.getUltimaRevisao(), entity.getStatus(), entity.getDescanso());
    }
}
