package com.mindmatch.pagamento.dto;

import java.time.LocalDate;
import java.util.List;

public record MediaAgentesResponse(
    Integer numeroAgentes,
    LocalDate proximaAvaliacao,
    List<MediaSinal> valorNedias
) {
}
