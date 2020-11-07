package it.dantar.games.starship.beans;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class SpaceportController {

	Map<String, String> ids = new HashMap<String, String>();
	
	@GetMapping("/token/{code}")
	public String token(@PathVariable String code) {
		return this.ids.get(code);
	}
	
	@PostMapping("/token")
	public String offer(@RequestParam String token) {
		String code = randomCode();
		this.ids.put(code, token);
		return code;
	}
	
	private String randomCode() {
		String code = "";
		Random random = new Random();
		while (code.length() < 6) {
			code = code + random.nextInt(10);
		}
		return code;
	}
	
}
