package com.mindmatch.pagamento.repositories;

import com.mindmatch.pagamento.entities.SinalSaude;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SinalSaudeRepository extends JpaRepository<SinalSaude, Long> {
}
