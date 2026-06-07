package com.mindmatch.pagamento.dto;

import com.mindmatch.pagamento.entities.enums.Tendencia;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MediaSinal {

    private Long idSinal;
    private String nomeSinal;
    private BigDecimal valorMedio;
    private Integer agentesNormais;
    private Integer agentesAtencao;
    private Tendencia tendencia;

}
