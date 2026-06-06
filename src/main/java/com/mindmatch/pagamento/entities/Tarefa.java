package com.mindmatch.pagamento.entities;

import com.mindmatch.pagamento.entities.enums.Prioridade;
import com.mindmatch.pagamento.entities.enums.StatusTarefa;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "tb_tarefa")
public class Tarefa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tarefa")
    private Long id;

    @Column(name = "nome_tarefa", nullable = false)
    private String nome;

    @Column(name = "tipo_tarefa", nullable = false)
    private String tipo;

    @Column(name = "horario_tarefa", nullable = false)
    private LocalDateTime horario;

    @Enumerated(EnumType.STRING)
    @Column(name = "prioridade_tarefa", nullable = false)
    private Prioridade prioridade;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_tarefa", nullable = false)
    private StatusTarefa status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_agente")
    private Agente agente;
}
