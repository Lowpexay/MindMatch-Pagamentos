package com.mindmatch.pagamento.dto;

import com.mindmatch.pagamento.entities.Missao;

public record MissaoResponse(
        Long id,
        String nome,
        Long tempo
) {
    public MissaoResponse(Missao entity) {
        this(entity.getId(), entity.getNome(), entity.getTempo());
    }
}
