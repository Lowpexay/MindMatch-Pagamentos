package com.mindmatch.pagamento.dto;

import com.mindmatch.pagamento.entities.SinalSaude;
import com.mindmatch.pagamento.entities.enums.Categoria;
import com.mindmatch.pagamento.entities.enums.StatusAgente;

public record SinalSaudeResponse(
        Long id,
        String nome,
        String valor,
        Categoria categoria,
        StatusAgente status,
        Long agenteId
) {
    public SinalSaudeResponse(SinalSaude entity) {
        this(entity.getId(), entity.getNome(), entity.getValor(), entity.getCategoria(), entity.getStatus(), entity.getAgente().getId());
    }
}
