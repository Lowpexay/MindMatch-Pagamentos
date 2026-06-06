package com.mindmatch.pagamento.dto;

import com.mindmatch.pagamento.entities.enums.Categoria;
import com.mindmatch.pagamento.entities.enums.StatusAgente;

public record SinalSaudeRequest(
        String nome,
        String valor,
        Categoria categoria,
        StatusAgente status,
        Long agenteId
) {
}
