package com.mindmatch.pagamento.entities;

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
@Table(name = "tb_missao")
public class Missao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_missao")
    private Long id;

    @Column(name = "nome_missao", nullable = false)
    private String nome;

    @Column(name = "tempo_missao", nullable = false)
    private Long tempo;

}
