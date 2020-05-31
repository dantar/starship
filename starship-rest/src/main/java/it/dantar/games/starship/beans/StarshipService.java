package it.dantar.games.starship.beans;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import it.dantar.games.starship.models.SseDto;

@Service
public class StarshipService {

	@Autowired
	ApplicationContext context;
	
	private static final Long TIMEOUT = 1000 * 60 * 60L; //1 ora

	private Map<String, SseEmitter> emitters = new HashMap<String, SseEmitter>();
	
	public SseEmitter playerSse(String playerId) {
		if (!emitters.containsKey(playerId)) {
			emitters.put(playerId, new SseEmitter(TIMEOUT));
		}
		return emitters.get(playerId);
	}

	@Scheduled(fixedRate = 1000*5L)
	public void refreshSse() {
		this.broadcastMessage(new SseDto().setCode("ping"));
	}

	public void broadcastMessage(SseDto dto) {
		this.context.getBean(BroadcastSseDtoOperation.class).send(emitters, dto);
	}

}
