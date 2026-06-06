package com.mindmatch.pagamento.dto;

import com.mindmatch.pagamento.entities.Agente;

import java.time.LocalDate;

public record AgenteCreationRequest(
        String nome,
        String especialidade,
        LocalDate ultimaRevisao,
        Double descanso,
        Long idMissao
) {

}
