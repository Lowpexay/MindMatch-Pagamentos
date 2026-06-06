package com.mindmatch.pagamento.service;

import com.mindmatch.pagamento.dto.*;
import com.mindmatch.pagamento.entities.Agente;
import com.mindmatch.pagamento.entities.Missao;
import com.mindmatch.pagamento.entities.SinalSaude;
import com.mindmatch.pagamento.entities.enums.StatusAgente;
import com.mindmatch.pagamento.entities.enums.Tendencia;
import com.mindmatch.pagamento.repositories.AgenteRepository;
import com.mindmatch.pagamento.repositories.MissaoRepository;
import com.mindmatch.pagamento.service.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AgenteService {

    private final AgenteRepository repository;
    private final MissaoRepository missaoRepository;

    @Transactional
    public AgenteCreationResponse create(AgenteCreationRequest request) {
        Agente created = new Agente();

        created.setNome(request.nome());
        created.setEspecialidade(request.especialidade());
        created.setUltimaRevisao(request.ultimaRevisao());
        created.setStatus(StatusAgente.NORMAL);
        created.setDescanso(request.descanso());

        if(!missaoRepository.existsById(request.idMissao())) {
            throw new ResourceNotFoundException("Missao não encontrada, id: " + request.idMissao());
        }

        Missao ref = new Missao();
        ref.setId(request.idMissao());
        created.setMissao(ref);
        Agente savedAgente = repository.save(created);

        return new AgenteCreationResponse(savedAgente);
    }

    @Transactional(readOnly = true)
    public List<AgenteFetchResponse> findAll() {
        return repository.findAll()
                .stream().map(AgenteFetchResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public AgenteCreationResponse findById(Long id) {
        return new AgenteCreationResponse(
                repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Agente não encontrado; Id: " + id))
        );
    }

    @Transactional(readOnly = true)
    public AgenteRotinaResponse findRotinaAgenteById(Long id) {
        return new AgenteRotinaResponse(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agente não encontrado; Id: " + id)));
    }

    @Transactional(readOnly = true)
    public AgenteSinalResponse findAgenteSinal(Long id) {
        return new AgenteSinalResponse(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agente não encontrado; Id: " + id)));
    }

    @Transactional(readOnly = true)
    public MediaAgentesResponse mediaAgentes() {
        ArrayList<Agente> agentes = new ArrayList<>(repository.findAll());
        if(agentes.isEmpty()) {
            throw new ResourceNotFoundException("Nenhum agente encontrado para avaliação.");
        }

        List<SinalSaude> todosSinais = agentes
                .stream().flatMap(agente -> agente.getSinaisSaude().stream())
                .toList();

        Map<String, List<SinalSaude>> sinaisAgrupadosPorNome = todosSinais
                .stream().collect(Collectors.groupingBy(SinalSaude::getNome));

        List<MediaSinal> listaMedia = sinaisAgrupadosPorNome.entrySet()
                .stream().map(entry -> {
                    String nome = entry.getKey();
                    List<SinalSaude> sinais = entry.getValue();

                    double mediaCalculada = sinais
                            .stream().mapToDouble(sinal -> {
                                try {
                                    return Double.parseDouble(sinal.getValor().replaceAll("[^\\d.]", ""));
                                } catch (Exception e) {
                                    return 0.0;
                                }
                            })
                            .average()
                            .orElse(0.0);

                    int countNormal = (int) sinais.stream()
                            .filter(s -> s.getStatus() == StatusAgente.NORMAL) // Altere para os enums corretos do seu projeto
                            .count();

                    int countAtencao = (int) sinais.stream()
                            .filter(s -> s.getStatus() == StatusAgente.ATENCAO) // Altere para os enums corretos do seu projeto
                            .count();

                    BigDecimal mediabd = BigDecimal.valueOf(mediaCalculada).setScale(2, RoundingMode.UP);
                    return new MediaSinal(sinais.get(0).getId(), nome, mediabd, countNormal, countAtencao, Tendencia.ESTAVEL);
                }).toList();

        return new MediaAgentesResponse(agentes.size(), LocalDate.now().plusDays(1), listaMedia);
    }


}
