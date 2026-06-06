package com.mindmatch.pagamento.repositories;

import com.mindmatch.pagamento.entities.Agente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AgenteRepository extends JpaRepository<Agente, Long> {
}
