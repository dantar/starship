package it.dantar.games.starship.beans;

import java.io.IOException;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.springframework.context.annotation.Scope;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import it.dantar.games.starship.models.SseDto;

@Component
@Scope("prototype")
public class BroadcastSseDtoOperation {

	Set<String> sent = new HashSet<>();
	Set<String> stale = new HashSet<>();
	Map<String, SseEmitter> emitters;
	
	public void send(Map<String, SseEmitter> emitters, SseDto dto) {
		this.emitters = emitters;
		this.emitters.entrySet().stream().forEach(e -> this.sendToSse(e.getKey(), e.getValue(), dto));
		this.stale.forEach(s -> this.emitters.remove(s));
	}

	private void sendToSse(String player, SseEmitter emitter, SseDto message) {
		try {
			emitter.send(SseEmitter.event()
					.data(message, MediaType.APPLICATION_JSON)
					);
			sent.add(player);
		} catch (IOException | IllegalStateException e) {
			emitter.completeWithError(e);
			stale.add(player);
		}
	}
	
}
