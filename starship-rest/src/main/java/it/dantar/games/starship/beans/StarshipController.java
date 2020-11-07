package it.dantar.games.starship.beans;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import it.dantar.games.starship.models.PlayerDto;

@RestController
@CrossOrigin
public class StarshipController {

	@Autowired
	StarshipService starshipService;

	@GetMapping("/alive")
	public Boolean alive() {
		return true;
	}

	@GetMapping("/spaceport/player/{playerId}/sse")
	public SseEmitter playerSse(@PathVariable String playerId) {
		return starshipService.playerSse(playerId);
	}
	
	@PostMapping("/spaceport/player/subscribe")
	public PlayerDto playerSubscribe() {
		return new PlayerDto().setName("Someone");
	}
	
}
