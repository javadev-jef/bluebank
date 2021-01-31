package br.com.bluebank.application.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.bluebank.domain.Blacklist.Blacklist;
import br.com.bluebank.domain.Blacklist.BlacklistRepository;
import br.com.bluebank.infrastructure.web.security.Utils.JWTTokenUtils;
import io.jsonwebtoken.Claims;

@Service
public class BlacklistService 
{
    @Autowired
    private BlacklistRepository blacklistRepository;

    public void save(String token)
    {
        Claims body = JWTTokenUtils.getAllClaimsFromToken(token);

        Blacklist blacklist = new Blacklist();
        blacklist.setTokenId(body.getId());
        blacklist.setExp(body.getExpiration());
        blacklist.setIat(body.getIssuedAt());
        blacklist.setUsername(body.getSubject());
        blacklist.setBlockDate(LocalDateTime.now());

        blacklistRepository.save(blacklist);
    }
}