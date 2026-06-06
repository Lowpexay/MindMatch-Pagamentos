package com.mindmatch.pagamento.entities;

import com.mindmatch.pagamento.entities.enums.StatusAgente;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")

@Entity
@Table(name = "tb_agente")
public class Agente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_agente")
    private Long id;

    @Column(name = "nome_agente", nullable = false)
    private String nome;

    @Column(name = "especialidade_agente", nullable = false)
    private String especialidade;

    @Column(name = "ultiva_revisao_agente", nullable = false)
    private LocalDate ultimaRevisao;

    @Column(name = "descanso_agente", nullable = false)
    private Double descanso;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_missao", nullable = true)
    private Missao missao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusAgente status;


    @OneToMany(mappedBy = "agente", cascade = CascadeType.MERGE)
    private List<SinalSaude> sinaisSaude;

}
