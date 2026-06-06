package com.mindmatch.pagamento.entities;

import com.mindmatch.pagamento.entities.enums.Categoria;
import com.mindmatch.pagamento.entities.enums.StatusAgente;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "tb_sinal_saude")
public class SinalSaude {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_sinal_saude")
    private Long id;
    @Column(name = "nome_sinal", nullable = false)
    private String nome;
    @Column(name = "valor_sinal", nullable = false)
    private String valor;

    @Enumerated(EnumType.STRING)
    @Column(name = "categoria_sinal", nullable = false)
    private Categoria categoria;
    @Enumerated(EnumType.STRING)
    @Column(name = "status_sinal", nullable = false)
    private StatusAgente status;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_agente", nullable = false)
    private Agente agente;
}
