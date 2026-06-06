package com.mindmatch.pagamento.service;

import com.mindmatch.pagamento.repositories.TarefaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TarefaService {

    private final TarefaRepository repository;


}
