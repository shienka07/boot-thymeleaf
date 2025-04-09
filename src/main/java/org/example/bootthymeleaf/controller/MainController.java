package org.example.bootthymeleaf.controller;

import lombok.RequiredArgsConstructor;
import org.example.bootthymeleaf.model.entity.Word;
import org.example.bootthymeleaf.model.repository.WordRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@RequiredArgsConstructor
@Controller
public class MainController {
    private final WordRepository wordRepository;

    @GetMapping
    public String index(Model model) {
        Word word = new Word();
        word.setText("고양이");
        wordRepository.save(word);
        model.addAttribute("words", wordRepository.findAll());
        return "index";
    }
}
