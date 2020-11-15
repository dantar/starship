package it.dantar.games.starship.beans;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import it.dantar.games.starship.models.TokenDto;

@RestController
@CrossOrigin
public class SpaceportController {

	Map<String, String> ids = new HashMap<String, String>();
	
	@GetMapping("/token/{code}")
	public TokenDto token(@PathVariable String code) {
		return new TokenDto().setToken(this.ids.get(code));
	}
	
	@PostMapping("/token")
	public String offer(@RequestBody TokenDto token) {
		String code = randomCode();
		this.ids.put(code, token.getToken());
		return code;
	}
	
	private String randomCode() {
		String code = "";
		Random random = new Random();
		while (code.length() < 6) {
			if (code.length() == 0) code = code + (random.nextInt(9)+1);
			else code = code + random.nextInt(10);
		}
		return code;
	}
	
}
