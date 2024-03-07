package com.ssafy.koala.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class TestController {
	@GetMapping("/test")
	public String test() { return "Hello, world!"; }
	@GetMapping("/test2")
	public String test2() { return "Hell, world!"; }
}
